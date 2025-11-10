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

const CUID_REGEX = /^c[a-z0-9]{24}$/;
const isCUID = (id: string) => CUID_REGEX.test(id);

const buildThemeUrl = (id: string) => {
  const safeId = encodeURIComponent(id);
  return `https://tweakcn.com/r/themes/${safeId}${isCUID(id) ? "" : ".json"}`;
};

export async function getThemeCss(themeId: string): Promise<string> {
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
    return cssVarsToCss(registryItem.cssVars ?? {});
  } catch {
    throw new HTTPError({
      status: 404,
      statusMessage: "Not Found",
      message: `Theme not found: ${themeId}`,
    });
  }
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
  const { theme, asset = "main.user.css" } = getQuery(event) as Record<
    string,
    string
  >;

  let result = content;

  if (theme && asset === "main.user.css") {
    const css = await getThemeCss(theme);
    const transformedCss = transformCss(css);
    const wrappedCss = `${THEME_START}\n\n${transformedCss}\n\n${THEME_END}`;

    const url = getRequestURL(event);
    const searchParams = new URLSearchParams(url.search);

    result = changeMetadata(
      result,
      "updateURL",
      `${url.origin}/release/latest/?${searchParams.toString()}`,
    );

    // biome-ignore lint/style/useBlockStatements: the code is more readable this way
    if (ESCAPED_THEME_BLOCK.test(result))
      result = result.replace(ESCAPED_THEME_BLOCK, wrappedCss);
  }

  return result;
}
