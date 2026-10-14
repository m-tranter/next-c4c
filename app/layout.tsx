import type { Metadata } from "next";

import "./globals.css";

import FontLoader from "@/components/FontLoader";
import makeSchema from "@/lib/makeSchema";
import type { Entry } from "contensis-delivery-api/lib/models";
import { NonceProvider } from "@/components/NonceProvider";
import { getEntries, getRequestData } from "@/services/pagedata";
import { themeToVars, varsToRootCss } from "@/lib/themeVars";

export type NavItem = {
  sys: { id: string; uri?: string };
  entryTitle: string;
  url?: string;
};
export type NavObj = {
  title: string;
  links: NavItem[];
};
export const metadata: Metadata = {
  title: {
    template: "%s | Cheshire East Council",
    default: "Cheshire East Council",
  },
  openGraph: { siteName: "Cheshire East Council", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { node, entry, theme, nonce, config, status } = await getRequestData();
  const themeEntry = theme.length ? theme[0] : ({} as Entry);
  const configEntry = config.length ? config[0] : ({} as Entry);
  const css = themeEntry && varsToRootCss(themeToVars(themeEntry));
  const url = configEntry
    ? `${configEntry?.domain}${node?.path ? node.path : entry?.sys?.uri}`
    : "/";
  const fonts = await getEntries("themeFont");

  return (
    <html lang="en" className="h-full antialiased">
      <NonceProvider nonce={nonce}>
        <head>
          {fonts.length ? <FontLoader fonts={fonts} /> : null}
          {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}

          <link
            href="/asset-library/css/override.css"
            rel="stylesheet"
            type="text/css"
          />
        </head>
        <body className="min-h-full flex flex-col">
          {status === "latest" && (
            <style>{`.grecaptcha-badge { display: none; }`}</style>
          )}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: makeSchema({
                faqSchema: entry?.faqSchema,
                url,
                name: entry?.entryTitle,
                description: entry?.entryDescription,
              }),
            }}
          ></script>
          {children}
        </body>
      </NonceProvider>
    </html>
  );
}
