import { cache } from "react";
import { electionMap } from "@/lib/electionMap";
import { Query, Op } from "contensis-delivery-api";
import type { ElectionResult } from "@/lib/electionMap";
import client from "@/lib/client";
import type { EntryGetOptions } from "contensis-delivery-api/lib/models";

export type Options = EntryGetOptions & {
  versionStatus?: string;
};

export const getElection = cache(
  async (
    slug: string,
    contentTypeId = "electionResults",
    status = "published",
    n = 10,
    ld = 2,
  ): Promise<ElectionResult | undefined> => {
    try {
      let query = new Query(
        Op.equalTo("sys.versionStatus", status),
        Op.equalTo("entryTitle", slug.trim().replace(/-/g, " ")),
        Op.equalTo("sys.contentTypeId", contentTypeId),
      );
      query.pageSize = n;
      const result = await client.entries.search(query, ld);

      // process entry here ?
      return result?.items.length
        ? electionMap(result.items[0] as ElectionResult)
        : undefined;
    } catch (err) {
      console.error(err);
    }
  },
);

export const getElectionById = cache(
  async (
    id: string,
    status = "published",
  ): Promise<ElectionResult | undefined> => {
    try {
      const result = await client.entries.get({
        id: id,
        versionStatus: status,
      } as Options);
      return result?.sys.id ? electionMap(result) : undefined;
    } catch (err) {
      console.error(err);
    }
  },
);
