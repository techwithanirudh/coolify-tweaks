const SYSTEM_FONTS = new Set([
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "system-ui",
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy",
]);

export function extractFontFamily(
  fontValue: string | undefined,
): string | null {
  if (!fontValue) return null;

  const firstFont = fontValue
    .split(",")[0]
    ?.trim()
    .replace(/^["']|["']$/g, "");
  if (!firstFont || SYSTEM_FONTS.has(firstFont.toLowerCase())) {
    return null;
  }

  return firstFont;
}

export function buildFontImportBlock(
  fonts: (string | null | undefined)[],
  startMarker: string,
  endMarker: string,
  defaultUrl = "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap",
): string {
  const validFonts = fonts.filter(
    (f): f is string => f !== null && f !== undefined,
  );

  const url =
    validFonts.length === 0
      ? defaultUrl
      : `https://fonts.googleapis.com/css2?${validFonts.map((f) => `family=${f.replace(/\s+/g, "+")}:wght@100..900`).join("&")}&display=swap`;

  return `${startMarker}\n@import url("${url}");\n${endMarker}`;
}
