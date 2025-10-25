import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { parseArgs } from "node:util";
import * as sass from "sass-embedded";
import ora from "ora";
import { transform as lcTransform, browserslistToTargets } from "lightningcss";
import browserslist from "browserslist";

const { values } = parseArgs({
  options: {
    src: { type: "string", short: "s", default: "src/main.scss" },
    out: { type: "string", short: "o", default: "dist/main.user.css" },
    "load-path": { type: "string", short: "l", default: "src" },
    minify: { type: "boolean", short: "m", default: true },
    banner: { type: "string", default: "" },
    nesting: { type: "boolean", default: false }
  }
});

const cwd = process.cwd();
const SRC = path.resolve(cwd, String(values.src));
const OUT = path.resolve(cwd, String(values.out));
const LOAD_PATHS = String(values["load-path"]).split(",").map(p => path.resolve(cwd, p.trim())).filter(Boolean);
const SHOULD_MINIFY = Boolean(values.minify);
const BANNER = String(values.banner || "");
const USE_NESTING = Boolean(values.nesting);
const OUT_DIR = path.dirname(OUT);
const OUT_MAP = `${OUT}.map`;

function prependBanner(css: string) {
  return BANNER ? `${BANNER}\n${css}` : css;
}

export async function buildOnce() {
    const spinner = ora(`Building styles...`).start();
    const startTime = performance.now();  
  try {
    if (!existsSync(OUT_DIR)) await fs.mkdir(OUT_DIR, { recursive: true });

    spinner.text = "Compiling SCSS with Sass";
    const sassResult = await sass.compileAsync(SRC, {
      style: "expanded",
      sourceMap: true,
      loadPaths: LOAD_PATHS
    });

    spinner.text = `Transforming with Lightning CSS${SHOULD_MINIFY ? " + minify" : ""}`;
    const blQueries = browserslist.loadConfig({ path: cwd }) || ["defaults"];
    const targets = browserslistToTargets(browserslist(blQueries));

    const result = lcTransform({
      filename: SRC,
      code: Buffer.from(sassResult.css),
      minify: SHOULD_MINIFY,
      sourceMap: true,
      targets
    });

    let css = prependBanner(result.code.toString());
    const map = result.map ? result.map.toString() : null;

    if (map && !/sourceMappingURL=/.test(css)) {
      css += `\n/*# sourceMappingURL=${path.basename(OUT_MAP)} */\n`;
    }

    spinner.text = "Writing output files";
    await fs.writeFile(OUT, css, "utf8");
    if (map) await fs.writeFile(OUT_MAP, map, "utf8");

    const endTime = performance.now();
    const durationSec = ((endTime - startTime) / 1000).toFixed(2);
    const sizeKB = (new TextEncoder().encode(css).length / 1024).toFixed(1);
    spinner.succeed(`Built ${path.relative(cwd, OUT)} (${sizeKB} kB) in ${durationSec}s`);
  } catch (e: any) {
    spinner.fail("Build failed");
    console.error(e?.stack || e?.message || e);
    process.exit(1);
  }
}

if (import.meta.main) {
  buildOnce();
}
