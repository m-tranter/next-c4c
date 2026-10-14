import type { Entry } from "contensis-delivery-api/lib/models";

// ─── Types ────────────────────────────────────────────────────────────────────

type Surface = {
  background: string;
  text: string;
  title: string;
  border: string;
  linkDefault: string;
  linkHover: string;
  titleLinkDefault: string;
  titleLinkHover: string;
  accent: string;
  taxonomy: string;
  button: string;
};

type ButtonTheme = {
  background: string;
  text: string;
};

type FontTheme = {
  fontStack: string;
  googleFontID: string;
};

// ─── Variable map ─────────────────────────────────────────────────────────────

export function themeToVars(theme: Entry): Record<string, string> {
  const d = theme.themeSurfaceDefault;
  const s1 = theme.themeSurface01;
  const s2 = theme.themeSurface02;
  const ov = theme.themeSurfaceOverlay;

  return {
    // ── Default surface (body, main content) ──
    "--color-bg-hover": "#d5cce8",
    "--color-bg": "#f2eff8",
    "--color-text": d.text,
    "--color-title": d.title,
    "--color-border": d.border,
    "--color-link": d.linkDefault,
    "--color-link-hover": d.linkHover,
    "--color-title-link": d.titleLinkDefault,
    "--color-title-link-hover": d.titleLinkHover,
    "--color-accent": d.accent,
    "--color-taxonomy": d.taxonomy,

    // ── Surface 01 (nav panels, dropdowns) ──
    "--color-s1-bg": s1.background,
    "--color-s1-text": s1.text,
    "--color-s1-title": s1.title,
    "--color-s1-border": s1.border,
    "--color-s1-link": s1.linkDefault,
    "--color-s1-link-hover": s1.linkHover,

    // ── Surface 02 (feedback header, green band) ──
    "--color-s2-bg": s2.background,
    "--color-s2-text": s2.text,
    "--color-s2-title": s2.title,
    "--color-s2-border": s2.border,
    "--color-s2-link": s2.linkDefault,
    "--color-s2-link-hover": s2.linkHover,

    // ── Overlay surface ──
    "--color-overlay-bg": ov.background,
    "--color-overlay-text": ov.text,
    "--color-overlay-opacity": String(
      theme.themeSurfaceOverlayBackgroundOpacity,
    ),

    // ── Buttons ──
    "--btn-01-bg": theme.themeButton01.background,
    "--btn-01-text": theme.themeButton01.text,
    "--btn-02-bg": theme.themeButton02.background,
    "--btn-02-text": theme.themeButton02.text,
    "--btn-white-bg": theme.themeButtonWhite.background,
    "--btn-white-text": theme.themeButtonWhite.text,

    // ── Tag ──
    "--tag-bg": theme.themeTag.background,
    "--tag-text": theme.themeTag.text,

    // ── Focus ring ──
    "--focus-color": theme.themeFocus,

    // ── Status colours ──
    "--color-warning": "#F5B223",
    "--color-error": "#D4351C",
    "--color-info": "#1D70B8",
    "--color-note": "#B1B4B6",
    "--color-success": "#43CCC1",

    // ── Accordion specific colours ──
    "--accordion-color-border": d.border,
    "--accordion-color-text": d.text,
    "--accordion-color-bg": d.background,

    // ── Fonts ──
    "--font-heading": theme.themeFontHeading?.fontStack,
    "--font-body": theme.themeFontBody?.fontStack,
    "--default-font-family": theme.themeFontBody?.fontStack,
  };
}

// Serialise the var map to a CSS :root block string.
export function varsToRootCss(vars: Record<string, string>): string {
  const declarations = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${declarations}\n};`;
}
