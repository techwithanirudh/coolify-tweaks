import postcss from "postcss";

const LEADING_DASHES_REGEX = /^--/;

export function cssVarsToCss(cssVars: Record<string, Record<string, string>>) {
  const root = postcss.root();

  for (const [themeKey, vars] of Object.entries(cssVars)) {
    const selector =
      themeKey === "light" || themeKey === "theme" ? ":root" : `.${themeKey}`;

    const ruleNode = postcss.rule({
      selector,
      raws: {
        between: " ",
      },
    });

    for (const [key, value] of Object.entries(vars)) {
      const prop = `--${key.replace(LEADING_DASHES_REGEX, "")}`;
      ruleNode.append(
        postcss.decl({
          prop,
          value,
          raws: {
            before: "\n  ",
            between: ": ",
            after: "",
            semicolon: true,
          },
        }),
      );
    }

    root.append(ruleNode);
  }

  return root.toResult().css;
}
