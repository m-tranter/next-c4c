import { headers } from "next/headers";
import { cache } from "react";
import client from "@/lib/client";
import { mapEntries } from "@/lib/mapper";
import { Query, Op } from "contensis-delivery-api";

import type { Entry, EntryGetOptions } from "contensis-delivery-api/lib/models";

export type Options = EntryGetOptions & {
  versionStatus?: string;
};
import type { Block } from "@contensis/canvas-react";
import { pruneEntry, prunePageEntry } from "@/lib/helpers";

export async function getEntryById(
  id: string,
  versionStatus: string = "latest",
) {
  try {
    return await client.entries.get({
      id,
      linkDepth: 2,
      versionStatus,
    } as Options);
  } catch (err) {
    console.log("getEntry failed:", err);
    return null;
  }
}

async function getNodeById(id: string, status: string) {
  try {
    return await client.nodes.get({ id, versionStatus: status } as Options);
  } catch (err: any) {
    console.log(err?.data?.message || "Something went wrong in node fetch");
    return null;
  }
}

export const getPageData = async (
  nodeId: string,
  entryId: string,
  status: string,
) => {
  // Disable caching for dynamic content to ensure fresh data
  const [node, entry, config, theme] = await Promise.all([
    getNodeById(nodeId, status),
    getEntryById(entryId, status),
    getEntries("siteConfig", status, 1, 2),
    getEntries("theme", status, 1, 1),
  ]);
  return { node, entry: entry ? prunePageEntry(entry) : null, config, theme };
};

export const getRequestData = cache(async () => {
  const headersList = await headers();
  const forwarded = headersList.get("x-orig-host");
  const host = headersList.get("host");
  const status =
    !forwarded || !forwarded.includes("gov.uk") ? "latest" : "published";
  const nodeId = headersList.get("x-node-id") ?? "";
  const entryId = headersList.get("x-entry-id") ?? "";
  const nonce = headersList.get("x-nonce") ?? "";
  const { node, entry, config, theme } = await getPageData(
    nodeId,
    entryId,
    status,
  );
  if (entry) {
    entry._host = host;
  }
  return { node, entry, config, theme, status, nonce };
});

// ─── Content Type Placeholder Resolution ─────────────────────────────────────

// Returns array of unique contentTypeIds found.
function findContentTypeIds(blocks: Block[]): string[] {
  const contentTypeIds = new Set<string>();
  function scan(blocks: Block[]) {
    for (const block of blocks) {
      if (block.type === "_component") {
        const component = block.properties?.component as string;
        if (component === "listingPlaceholder") {
          const contentTypeId = block.value?.contentTypeId as string;
          if (contentTypeId) {
            contentTypeId
              .split(",")
              .map((e) => e.trim())
              .filter((el) => el.length)
              .forEach((ct) => {
                contentTypeIds.add(ct);
              });
          }
        }
      }
      // Recurse into nested content if present
      if (block.value && typeof block.value === "object") {
        const val = block.value as Record<string, unknown>;
        if (Array.isArray(val.content)) {
          scan(val.content as Block[]);
        }
      }
    }
  }

  scan(blocks);
  return Array.from(contentTypeIds);
}

/**
 * Fetch all entries for a given content type, or a list of content types.
 * Applies pruning to remove unnecessary fields.
 */
export async function getEntries(
  contentTypeId: string,
  status = "published",
  n = 1000,
  ld = 2,
): Promise<Entry[]> {
  try {
    const contentTypeIds = contentTypeId
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const contentTypeQuery =
      contentTypeIds.length > 1
        ? Op.or(
            ...contentTypeIds.map((id) => Op.equalTo("sys.contentTypeId", id)),
          )
        : Op.equalTo("sys.contentTypeId", contentTypeIds[0]);

    const query = new Query(
      contentTypeQuery,
      Op.equalTo("sys.versionStatus", status),
    );
    query.pageSize = n;
    const result = await client.entries.search(query, ld);
    return result?.items || [];
  } catch (err) {
    console.error(`Failed to fetch content type '${contentTypeId}':`, err);
    return [];
  }
}

export async function resolveContentTypePlaceholders(
  blocks: Block[],
): Promise<Block[]> {
  const contentTypeIds = findContentTypeIds(blocks);
  if (contentTypeIds.length === 0) {
    return blocks;
  }
  // Helper to fetch content type definition
  const getContentTypeInfo = async (ctId: string) => {
    try {
      const ct = await client.contentTypes.get(ctId);
      return ct;
    } catch (err) {
      console.error(
        `Failed to fetch content type definition for '${ctId}':`,
        err,
      );
      return null;
    }
  };

  // Fetch entries and content type info for each content type in parallel
  const dataByType = await Promise.all(
    contentTypeIds.map(async (ctId) => {
      ctId = ctId.replace(/Current$/, "");
      const [entries, ctInfo] = await Promise.all([
        getEntries(ctId),
        getContentTypeInfo(ctId),
      ]);
      return { contentTypeId: ctId, entries: entries.map(pruneEntry), ctInfo };
    }),
  );

  const entriesMap = new Map(
    dataByType.map((e) => [e.contentTypeId, e.entries]),
  );
  const ctInfoMap = new Map(dataByType.map((e) => [e.contentTypeId, e.ctInfo]));

  // Transform blocks: add entries and content type info to listingPlaceholder objects
  const resolvedBlocks: Block[] = [];

  for (const block of blocks) {
    if (block.type === "_component") {
      const component = block.properties?.component as string;
      if (component === "listingPlaceholder") {
        const valueObj = (block.value as Record<string, unknown>) || {};
        const contentTypeId = valueObj?.contentTypeId as string;
        const allCts = contentTypeId
          .split(",")
          .map((e) => e.trim().replace(/Current$/, ""))
          .filter((f) => f.length);
        const entries = allCts.reduce((acc: Entry[], ct) => {
          return [...acc, ...(entriesMap.get(ct) as Entry[])];
        }, []);
        const ctInfo = ctInfoMap.get(allCts[0]) || null;
        // Add entries and contentType info to the placeholder object
        const resolvedBlock = {
          ...block,
          value: {
            ...valueObj,
            entries: mapEntries(entries as Entry[]),
            contentType: ctInfo,
          },
        };
        resolvedBlocks.push(resolvedBlock);
        continue;
      }
    }
    // Keep other blocks as-is
    resolvedBlocks.push({ ...block });
  }

  return resolvedBlocks;
}
