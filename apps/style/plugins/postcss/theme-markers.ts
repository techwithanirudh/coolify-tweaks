import type { AtRule, Plugin, Root, Rule } from "postcss";
import postcss from "postcss";
import { ContainerWithChildren } from "postcss/lib/container";

const THEME_START = "==UI-THEME-VARS:START==";
const THEME_END = "==UI-THEME-VARS:END==";
const FONT_START = "==FONT-IMPORT:START==";
const FONT_END = "==FONT-IMPORT:END==";

const hasVars = (r: Rule) => {
  let bg = false,
    fg = false;
  r.walkDecls((d) => {
    if (d.prop === "--background") bg = true;
    if (d.prop === "--foreground") fg = true;
  });
  return bg && fg;
};

const findRoot = (root: Root) => {
  let res: Rule | undefined;
  root.walkRules(":root", (r) => {
    if (!res && hasVars(r)) res = r;
  });
  return res;
};

const findDark = (root: Root) => {
  let res: { r: Rule; p: ContainerWithChildren | undefined } | undefined;
  root.walkRules(".dark", (r) => {
    if (hasVars(r)) res = { r, p: r.parent };
  });
  return res;
};

const themeMarkers = (): Plugin => ({
  postcssPlugin: "theme-markers",
  Once(root) {
    // Add font import markers
    let fontFound = false;
    root.walkAtRules("import", (rule) => {
      if (fontFound) return;
      if (rule.params.includes("fonts.googleapis.com")) {
        rule.before(postcss.comment({ text: FONT_START }));
        rule.after(postcss.comment({ text: FONT_END }));
        fontFound = true;
      }
    });

    // Add theme variable markers
    let start = false,
      end = false;
    const first = findRoot(root);
    const last = findDark(root);

    if (first) {
      first.before(postcss.comment({ text: THEME_START }));
      start = true;
    }
    if (last) {
      const { r, p } = last;
      if (p?.type === "atrule")
        (p as AtRule).after(postcss.comment({ text: THEME_END }));
      else r.after(postcss.comment({ text: THEME_END }));
      end = true;
    }
    if (!start) root.prepend(postcss.comment({ text: THEME_START }));
    if (!end) root.append(postcss.comment({ text: THEME_END }));
  },
});

themeMarkers.postcss = true;

export default themeMarkers;
