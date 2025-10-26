import type { Plugin, Root, Rule, AtRule } from "postcss";
import postcss from "postcss";
import { ContainerWithChildren } from "postcss/lib/container";

const START = "==UI-THEME-VARS:START==";
const END = "==UI-THEME-VARS:END==";

const hasVars = (r: Rule) => {
  let bg = false, fg = false;
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
  let res: { r: Rule, p: ContainerWithChildren | undefined } | undefined;
  root.walkRules(".dark", (r) => {
    if (hasVars(r)) res = { r, p: r.parent };
  });
  return res;
};

const appendThemeIdentifier = (): Plugin => ({
  postcssPlugin: "append-theme-identifier",
  Once(root) {
    let start = false, end = false;
    const first = findRoot(root);
    const last = findDark(root);

    if (first) {
      first.before(postcss.comment({ text: START }));
      start = true;
    }
    if (last) {
      const { r, p } = last;
      if (p?.type === "atrule") (p as AtRule).after(postcss.comment({ text: END }));
      else r.after(postcss.comment({ text: END }));
      end = true;
    }
    if (!start) root.prepend(postcss.comment({ text: START }));
    if (!end) root.append(postcss.comment({ text: END }));
  },
});

appendThemeIdentifier.postcss = true;

export default appendThemeIdentifier;
