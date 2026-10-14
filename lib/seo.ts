import type { Metadata } from "next";
import { Asset as ContensisAsset } from "contensis-delivery-api";

import type { Entry } from "contensis-delivery-api/lib/models";

interface Sys {
  uri: string;
  properties?: {
    height?: number;
    width?: number;
  };
}

export type Asset = {
  altText: string | null;
  keywords: string[];
  entryTags: string[];
  entryDescription: string | null;
  description: string | null;
  title: string;
  sys: Sys;
  entryTitle: string;
  asset: ContensisAsset;
};

interface OgImage {
  altText: string | null;
  transformations: unknown | null;
  caption: string;
  asset: Asset;
}

export interface PageMeta {
  excludeFromSearch: boolean;
  keywords: string | null;
  pageTitle: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: OgImage | null;
  noIndex: boolean;
}

export interface ConfigEntry {
  domain?: string;
  siteName: string;
}

export function getSEOProps(
  configEntry: Entry,
  metaInfo: PageMeta | undefined,
  entryTitle: string | undefined,
  entryDescription: string | undefined,
  path: string,
): Metadata {
  const domain = configEntry.domain ?? "";
  const title = metaInfo?.pageTitle || entryTitle;
  const description = metaInfo?.description || entryDescription;
  const canonicalUrl = `${domain}${path}`;

  const ogImage = metaInfo?.ogImage;
  const ogImages = ogImage
    ? [
        {
          url: `${domain}${ogImage.asset.sys.uri}`,
          alt: ogImage.altText ?? undefined,
          width: ogImage.asset.sys.properties?.width,
          height: ogImage.asset.sys.properties?.height,
        },
      ]
    : [];

  return {
    title,
    description,
    openGraph: {
      title: metaInfo?.ogTitle || title,
      description: metaInfo?.ogDescription || description,
      url: canonicalUrl,
      siteName: configEntry.siteName,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: metaInfo?.noIndex ? { index: false } : undefined,
  };
}
