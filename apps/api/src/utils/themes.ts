import type { H3Event } from "nitro/h3";
import type { RegistryItem } from "shadcn/schema";
import { $fetch } from "nitro/deps/ofetch";
import { getQuery, getRequestURL, HTTPError } from "nitro/h3";
import { registryItemSchema } from "shadcn/schema";

import { transformCss } from "./css-compiler";
import { cssVarsToCss } from "./css-transformer";

const THEME_START = "/* ==UI-THEME-VARS:START== */";
const THEME_END = "/* ==UI-THEME-VARS:END== */";

const ESCAPED_THEME_BLOCK = new RegExp(
  `${THEME_START.replace(/[-[\]{}()*+?.\\^$|]/g, "\\$&")}` +
    "[\\s\\S]*?" +
    `${THEME_END.replace(/[-[\]{}()*+?.\\^$|]/g, "\\$&")}`,
  "m",
);

// Regex to match the Google Fonts @import line
const GOOGLE_FONTS_IMPORT_REGEX =
  /@import\s+["']https:\/\/fonts\.googleapis\.com\/css2\?[^"']+["'];?/g;

// Regex to match the hardcoded font override block
const FONT_OVERRIDE_BLOCK_REGEX =
  /:root\s*\{\s*--default-font-family:[^}]+\}[\s\S]*?h4\s*\{[^}]+\}/;

const CUID_REGEX = /^c[a-z0-9]{24}$/;
const isCUID = (id: string) => CUID_REGEX.test(id);

const buildThemeUrl = (id: string) => {
  const safeId = encodeURIComponent(id);
  return `https://tweakcn.com/r/themes/${safeId}${isCUID(id) ? "" : ".json"}`;
};

interface ThemeData {
  css: string;
  fonts: {
    sans?: string;
    mono?: string;
  };
}

/**
 * Extract font family name from a CSS font-family value
 * e.g., "Architects Daughter, sans-serif" -> "Architects Daughter"
 * e.g., '"Fira Code", "Courier New", monospace' -> "Fira Code"
 */
function extractPrimaryFont(fontValue: string | undefined): string | undefined {
  if (!fontValue) return undefined;

  // Split by comma and get first font
  const firstFont = fontValue.split(",")[0]?.trim();
  if (!firstFont) return undefined;

  // Remove quotes if present
  const unquoted = firstFont.replace(/^["']|["']$/g, "");

  // Skip generic font families
  const genericFonts = [
    "sans-serif",
    "serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui",
    "ui-sans-serif",
    "ui-serif",
    "ui-monospace",
  ];
  if (genericFonts.includes(unquoted.toLowerCase())) {
    return undefined;
  }

  return unquoted;
}

/**
 * Check if a font is likely a Google Font (not a system font)
 */
function isGoogleFont(fontName: string): boolean {
  const systemFonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Times",
    "Courier New",
    "Courier",
    "Verdana",
    "Georgia",
    "Palatino",
    "Garamond",
    "Bookman",
    "Comic Sans MS",
    "Trebuchet MS",
    "Impact",
    "Lucida Sans",
    "Lucida Console",
    "Tahoma",
    "Geneva",
    "Century Gothic",
    "Geist",
    "Geist Mono",
    "SF Pro",
    "SF Mono",
    "Segoe UI",
    "Roboto",
    "Noto Sans",
    "Apple Color Emoji",
    "Segoe UI Emoji",
  ];

  return !systemFonts.some((sf) => fontName.toLowerCase() === sf.toLowerCase());
}

/**
 * Build Google Fonts @import URL from font names
 */
function buildGoogleFontsUrl(fonts: string[]): string {
  const googleFonts = fonts.filter((f) => f && isGoogleFont(f));

  if (googleFonts.length === 0) {
    // Fallback to Geist fonts
    return "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap";
  }

  const familyParams = googleFonts
    .map((font) => `family=${font.replace(/\s+/g, "+")}:wght@100..900`)
    .join("&");

  return `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
}

/**
 * Generate font override CSS using CSS variables
 */
function generateFontOverrideCss(): string {
  return `:root {
  --default-font-family: var(--font-sans, "Geist", sans-serif);
  --font-mono: var(--font-mono, "Geist Mono", monospace);
}

h1 {
  color: var(--foreground);
  font: 700 2.1rem / 1.25 var(--font-sans, Geist, sans-serif);
}

h2 {
  color: var(--foreground);
  font: 700 1.5rem / 1.35 var(--font-sans, Geist, sans-serif);
}

h3 {
  color: var(--foreground);
  font: 700 1.25rem / 1.35 var(--font-sans, Geist, sans-serif);
}

h4 {
  color: var(--foreground);
  font: 700 1.1rem / 1.35 var(--font-sans, Geist, sans-serif);
}`;
}

export async function getThemeData(themeId: string): Promise<ThemeData> {
  const url = buildThemeUrl(themeId);

  try {
    const theme = await $fetch<RegistryItem>(url, {
      retry: 0,
      ignoreResponseError: true,
    });

    const parsed = registryItemSchema.safeParse(theme);
    if (!parsed.success) {
      throw new HTTPError({
        status: 400,
        statusMessage: "Invalid theme data",
        data: parsed.error.issues,
      });
    }

    const registryItem = parsed.data;
    const cssVars = registryItem.cssVars ?? {};

    // Extract font information from theme, light, or dark sections
    const themeVars = cssVars.theme ?? {};
    const lightVars = cssVars.light ?? {};

    const fontSans =
      themeVars["font-sans"] ?? lightVars["font-sans"] ?? undefined;
    const fontMono =
      themeVars["font-mono"] ?? lightVars["font-mono"] ?? undefined;

    return {
      css: cssVarsToCss(cssVars),
      fonts: {
        sans: extractPrimaryFont(fontSans),
        mono: extractPrimaryFont(fontMono),
      },
    };
  } catch {
    throw new HTTPError({
      status: 404,
      statusMessage: "Not Found",
      message: `Theme not found: ${themeId}`,
    });
  }
}

// Keep the old function for backwards compatibility
export async function getThemeCss(themeId: string): Promise<string> {
  const data = await getThemeData(themeId);
  return data.css;
}

export function changeMetadata(
  content: string,
  field: string,
  value: string,
): string {
  const rx = new RegExp(`^(@${field}\\s+).+$`, "m");
  return content.replace(rx, `$1${value}`);
}

export async function processContent({
  content,
  event,
}: {
  content: string;
  event: H3Event;
}): Promise<string | null | undefined> {
  const { theme, asset = "main.user.css" } = getQuery(event);

  let result = content;

  if (theme && (asset === "main.user.css" || asset === "main.css")) {
    const themeData = await getThemeData(theme);
    const transformedCss = transformCss(themeData.css, asset);
    const wrappedCss = `${THEME_START}\n\n${transformedCss}\n\n${THEME_END}`;

    const url = getRequestURL(event);
    const searchParams = new URLSearchParams(url.search);

    result = changeMetadata(
      result,
      "updateURL",
      `${url.origin}/release/latest/?${searchParams.toString()}`,
    );

    // Replace theme block
    // biome-ignore lint/style/useBlockStatements: the code is more readable this way
    if (ESCAPED_THEME_BLOCK.test(result))
      result = result.replace(ESCAPED_THEME_BLOCK, wrappedCss);

    // Build fonts list from theme
    const themeFonts: string[] = [];
    if (themeData.fonts.sans) themeFonts.push(themeData.fonts.sans);
    if (themeData.fonts.mono) themeFonts.push(themeData.fonts.mono);

    // Replace Google Fonts @import with theme fonts
    const newFontsUrl = buildGoogleFontsUrl(themeFonts);
    result = result.replace(
      GOOGLE_FONTS_IMPORT_REGEX,
      `@import "${newFontsUrl}";`,
    );

    // Replace hardcoded font override block with CSS variable-based version
    result = result.replace(
      FONT_OVERRIDE_BLOCK_REGEX,
      generateFontOverrideCss(),
    );
  }

  return result;
}
