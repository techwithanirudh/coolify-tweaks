import browserslist from "browserslist";
import { browserslistToTargets, transform } from "lightningcss-wasm";

export function transformCss(css: string, filename = "main.user.css"): string {
  const blQueries =
    browserslist.loadConfig({ path: "apps/style" }) ?? browserslist.defaults;
  const targets = browserslistToTargets(browserslist(blQueries));

  const { code } = transform({
    filename,
    code: new TextEncoder().encode(css),
    minify: false,
    sourceMap: false,
    targets,
  });

  return new TextDecoder().decode(code);
}
