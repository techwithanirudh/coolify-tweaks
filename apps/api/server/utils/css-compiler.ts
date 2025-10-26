import browserslist from "browserslist";
import {
  browserslistToTargets,
  transform as lightningTransform,
} from "lightningcss";

export function transformCssWithLightning(css: string): string {
  const blQueries =
    browserslist.loadConfig({ path: "apps/style" }) ?? browserslist.defaults;
  const targets = browserslistToTargets(browserslist(blQueries));

  const result = lightningTransform({
    filename: "main.user.css",
    code: Buffer.from(css),
    minify: false,
    sourceMap: false,
    targets,
  });

  return result.code.toString();
}
