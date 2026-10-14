import type { Entry } from "contensis-delivery-api/lib/models";
interface FontLoaderProps {
  fonts: Entry[];
}

const WEIGHTS = [400, 500, 700];

/**
 * Build a single Google Fonts v2 URL for all required fonts.
 * Deduplicates font IDs so a font used for both heading and body
 * only generates one family param.
 */
export function buildGoogleFontsUrl(fonts: Entry[]): string | null {
  if (!fonts.length) return null;

  // Deduplicate by googleFontID
  const uniqueFonts = Array.from(
    new Map(fonts.map((f) => [f.googleFontID, f])).values(),
  );

  const familyParams = uniqueFonts
    .map((f) => {
      // Google Fonts v2: spaces become '+', weights joined with ';'
      const name = f.googleFontID.replace(/\s+/g, "+");
      return `family=${name}:wght@${WEIGHTS.join(";")}`;
    })
    .join("&");

  return `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
}

export default function FontLoader({ fonts }: FontLoaderProps) {
  const url = buildGoogleFontsUrl(fonts);
  if (!url) return null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href={url} />
    </>
  );
}
