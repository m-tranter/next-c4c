import type { Entry } from "contensis-delivery-api/lib/models";

export const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "2-digit",
};

export const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

export const dateOptions2: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

type PrunedPageEntry = Omit<
  Entry,
  | "emailOfPageOwner"
  | "entryThumbnail"
  | "availableLanguages"
  | "owner"
  | "projectId"
  | "workflow"
  | "sys"
> & {
  sys: Pick<Entry["sys"], "contentTypeId" | "slug" | "uri" | "dataFormat"> & {
    version: {
      published?: string;
      created?: string;
    };
  };
};

type PrunedEntry = Omit<
  Entry,
  "entryThumbnail" | "entryTags" | "thumbnail" | "sys"
> & {
  sys: Omit<
    Entry["sys"],
    | "availableLanguages"
    | "language"
    | "isPublished"
    | "allUris"
    | "version"
    | "owner"
    | "metadata"
    | "workflow"
    | "versionStatus"
    | "projectId"
    | "properties"
  > & {
    metadata: Omit<
      Entry["sys"]["metadata"],
      "contentOwnerName" | "contentOwnerEmail" | "nodeId"
    >;
    version: {
      published?: string;
      created?: string;
    };
  };
};
export function prunePageEntry(entry: Entry): PrunedPageEntry {
  try {
    const {
      emailOfPageOwner,
      entryThumbnail,
      sys,
      availableLanguages,
      owner,
      projectId,
      workflow,
      ...rest
    } = entry;
    return {
      ...rest,
      sys: {
        contentTypeId: sys.contentTypeId,
        slug: sys.slug,
        uri: sys.uri,
        dataFormat: sys.dataFormat,
        version: {
          created: sys.version?.created,
          published: sys.version?.published,
        },
      },
    };
  } catch {
    return {} as PrunedPageEntry;
  }
}

export function pruneEntry(entry: Entry): PrunedEntry {
  try {
    const { entryThumbnail, entryTags, thumbnail, sys, ...rest } = entry;
    const {
      availableLanguages,
      language,
      isPublished,
      allUris,
      version,
      owner,
      metadata,
      workflow,
      versionStatus,
      projectId,
      properties,
      ...sysRest
    } = sys;
    const { contentOwnerName, contentOwnerEmail, nodeId, ...meta } = metadata;
    return {
      ...rest,
      sys: {
        ...sysRest,
        metadata: meta,
        version: { published: version?.published },
      },
    };
  } catch {
    return {} as PrunedEntry;
  }
}

export const toCamelCase = (str: string) => {
  if (!str) {
    return;
  }
  const arr = str
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(" ")
    .filter((e) => e.length);
  return arr.length === 1
    ? arr[0]
    : arr
        .map((s, i) =>
          !i
            ? s.toLowerCase()
            : `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`,
        )
        .join("");
};

export const formatTime = (t: Date) => {
  let time = t.toLocaleTimeString("en-GB", timeOptions);
  if (time === "12:00 pm") {
    return " 12 noon";
  } else if (time.startsWith("0")) {
    time = "12" + time.slice(1);
  }
  return " " + time.replace(" ", "").toLowerCase().replace(/:00/g, "");
};

export const formatDate = (
  value: Date,
  opts: Intl.DateTimeFormatOptions = dateOptions,
): string => {
  return value.toLocaleString("en-GB", opts);
};

export const endOfDay = (d: Date) => {
  d.setHours(23, 59, 59, 999);
  return d;
};

export const removeSpaces = (str: string) => {
  return str.replace(/\s+/g, "");
};

export const makeShortId = (n: number) => {
  return Array(n)
    .fill(0)
    .map(() => Math.ceil(Math.random() * 15).toString(16))
    .join("");
};
