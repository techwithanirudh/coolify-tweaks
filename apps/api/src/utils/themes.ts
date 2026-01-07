import type { H3Event } from "nitro/h3";
import type { RegistryItem } from "shadcn/schema";
import { $fetch } from "nitro/deps/ofetch";
import { getQuery, getRequestURL, HTTPError } from "nitro/h3";
import { registryItemSchema } from "shadcn/schema";

import { transformCss } from "./css-compiler";
import { cssVarsToCss } from "./css-transformer";
import { buildFontImportBlock, extractFontFamily } from "./fonts";

const THEME_START = "/* ==UI-THEME-VARS:START== */";
const THEME_END = "/* ==UI-THEME-VARS:END== */";
const FONT_IMPORT_START = "/* ==FONT-IMPORT:START== */";
const FONT_IMPORT_END = "/* ==FONT-IMPORT:END== */";

const escapeRegex = (s: string) => s.replace(/[-[\]{}()*+?.\\^$|]/g, "\\$&");
const markerRegex = (start: string, end: string) =>
  new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`, "m");

const THEME_BLOCK_RE = markerRegex(THEME_START, THEME_END);
const FONT_BLOCK_RE = markerRegex(FONT_IMPORT_START, FONT_IMPORT_END);

const CUID_RE = /^c[a-z0-9]{24}$/;
const buildThemeUrl = (id: string) =>
  `https://tweakcn.com/r/themes/${encodeURIComponent(id)}${CUID_RE.test(id) ? "" : ".json"}`;

interface ThemeData {
  css: string;
  fonts: { sans?: string; mono?: string };
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

    const cssVars = parsed.data.cssVars ?? {};
    const themeVars = cssVars.theme ?? {};
    const lightVars = cssVars.light ?? {};

    return {
      css: cssVarsToCss(cssVars),
      fonts: {
        sans:
          extractFontFamily(themeVars["font-sans"] ?? lightVars["font-sans"]) ??
          undefined,
        mono:
          extractFontFamily(themeVars["font-mono"] ?? lightVars["font-mono"]) ??
          undefined,
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

export async function getThemeCss(themeId: string): Promise<string> {
  return (await getThemeData(themeId)).css;
}

export function changeMetadata(
  content: string,
  field: string,
  value: string,
): string {
  return content.replace(new RegExp(`^(@${field}\\s+).+$`, "m"), `$1${value}`);
}

export async function processContent({
  content,
  event,
}: {
  content: string;
  event: H3Event;
}): Promise<string> {
  const { theme, asset = "main.user.css" } = getQuery(event);

  if (!theme || (asset !== "main.user.css" && asset !== "main.css")) {
    return content;
  }

  const themeData = await getThemeData(theme);
  const themeCss = transformCss(themeData.css, asset);

  let result = content;

  const url = getRequestURL(event);
  result = changeMetadata(
    result,
    "updateURL",
    `${url.origin}/release/latest/?${url.search.slice(1)}`,
  );

  result = result.replace(
    THEME_BLOCK_RE,
    `${THEME_START}\n\n${themeCss}\n\n${THEME_END}`,
  );

  const fontBlock = buildFontImportBlock(
    [themeData.fonts.sans, themeData.fonts.mono],
    FONT_IMPORT_START,
    FONT_IMPORT_END,
  );
  result = result.replace(FONT_BLOCK_RE, fontBlock);

  return result;
}
