import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import client from "@/lib/client";
import { Query, Op } from "contensis-delivery-api";

const baseUrl = "https://www.cheshireeast.gov.uk";

const CSP_TTL_MS = 60 * 60 * 1000; // 1 hour

interface keyVal {
  key: string;
  value: string;
}

let cspCache: Record<string, string> | undefined;
let cspFetchedAt = 0;
let cspInFlight: Promise<Record<string, string> | undefined> | null = null;

const fetchCsp = async () => {
  try {
    const query = new Query(
      Op.equalTo("sys.contentTypeId", "genericKeyValue"),
      Op.equalTo("entryTitle", "CSP Headers"),
    );
    query.pageSize = 1;
    const res = await client.entries.search(query);
    return res.items[0].keyValue.reduce(
      (acc: Record<string, string>, e: keyVal) => {
        return { ...acc, [e.key]: e.value };
      },
      {},
    );
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

const getCsp = async () => {
  const isStale = Date.now() - cspFetchedAt > CSP_TTL_MS;
  if (cspCache && !isStale) {
    return cspCache;
  }
  // avoid duplicate concurrent fetches when many requests hit at once
  if (!cspInFlight) {
    cspInFlight = fetchCsp().then((result) => {
      if (result) {
        cspCache = result;
        cspFetchedAt = Date.now();
      }
      cspInFlight = null;
      return result;
    });
  }
  // serve stale cache while revalidating, if available
  if (cspCache) {
    return cspCache;
  }
  return cspInFlight;
};

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isDev = process.env.NODE_ENV === "development";
  const requestHeaders = new Headers(request.headers);

  const cspVals = await getCsp();
  // Promote query params to headers in dev
  const nodeId = searchParams.get("nodeId");
  const entryId = searchParams.get("entryId");
  if (nodeId) requestHeaders.set("x-node-id", nodeId);
  if (entryId) requestHeaders.set("x-entry-id", entryId);

  if (isDev) {
    // Fetch forms in dev
    if (pathname.startsWith("/api")) {
      return NextResponse.rewrite(
        new URL(`https://cms-chesheast.cloud.contensis.com${pathname}`),
      );
    }

    // Fetch images in dev
    if (
      pathname.startsWith("/images") ||
      pathname.startsWith("/asset-library") ||
      pathname.startsWith("/image-library")
    ) {
      return NextResponse.rewrite(new URL(`${baseUrl}${pathname}`));
    }
  }

  // CSP
  const nonce = crypto.randomBytes(16).toString("base64");
  requestHeaders.set("x-nonce", nonce);

  const csp = [
    "default-src 'self'",
    `script-src 'self' ${cspVals ? cspVals["script-src"] : ""} 'nonce-${nonce}' ${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline' ${cspVals ? cspVals["style-src"] : ""}`,
    `img-src 'self' data: blob: ${cspVals ? cspVals["img-src"] : ""}`,
    `font-src 'self' ${cspVals ? cspVals["font-src"] : ""}`,
    `connect-src 'self' ${cspVals ? cspVals["connect-src"] : ""}`,
    `frame-src ${cspVals ? cspVals["frame-src"] : ""}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (pathname.startsWith("/images/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
  }

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: "/((?!favicon.ico).*)",
};
