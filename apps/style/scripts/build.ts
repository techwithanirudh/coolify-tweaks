import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import ora from "ora";
import postcss from "postcss";
import loadConfig from "postcss-load-config";
import prettier from "prettier";
import * as sass from "sass";

const cwd = process.cwd();

const {
  values: { src, out, "load-path": loadPath, format },
} = parseArgs({
  options: {
    src: { type: "string", short: "s", default: "src/main.scss" },
    out: { type: "string", short: "o", default: "dist/main.user.css" },
    "load-path": { type: "string", short: "l", default: "src" },
    format: { type: "boolean", short: "p", default: false },
  },
});

const SRC = path.resolve(cwd, src);
const OUT = path.resolve(cwd, out);
const LOAD_PATHS = loadPath
  .split(",")
  .map((p) => path.resolve(cwd, p.trim()))
  .filter(Boolean);
const OUT_DIR = path.dirname(OUT);
const OUT_MAP = `${OUT}.map`;

export async function build() {
  const spinner = ora("Building styles...").start();
  const startTime = performance.now();

  try {
    if (!existsSync(OUT_DIR)) await fs.mkdir(OUT_DIR, { recursive: true });

    spinner.text = "Compiling SCSS with Sass";
    const sassResult = await sass.compileAsync(SRC, {
      style: "expanded",
      sourceMap: true,
      loadPaths: LOAD_PATHS,
    });

    spinner.text = "Loading PostCSS config";
    const { plugins, options } = await loadConfig({}, cwd);

    spinner.text = "Running PostCSS";
    const processor = postcss(plugins);
    const postcssResult = await processor.process(sassResult.css, {
      ...options,
      from: SRC,
      to: OUT,
      map: {
        inline: false,
        annotation: path.basename(OUT_MAP),
        prev: sassResult.sourceMap ?? undefined,
        ...(typeof options.map === "object" ? options.map : {}),
      },
    });

    let css = postcssResult.css;

    if (format) {
      spinner.text = "Formatting";
      try {
        const conf = (await prettier.resolveConfig(cwd)) ?? {};
        css = await prettier.format(css, { ...conf, parser: "css" });
      } catch (e) {
        console.warn("Formatting failed:", (e as Error).message);
      }
    }

    spinner.text = "Writing output";
    await fs.writeFile(OUT, css, "utf8");
    if (postcssResult.map) {
      await fs.writeFile(OUT_MAP, postcssResult.map.toString(), "utf8");
    }

    const endTime = performance.now();
    const durationSec = ((endTime - startTime) / 1000).toFixed(2);
    const sizeKB = (new TextEncoder().encode(css).length / 1024).toFixed(1);

    spinner.succeed(
      `Built ${path.relative(cwd, OUT)} (${sizeKB} kB) in ${durationSec}s`,
    );
  } catch (err: any) {
    spinner.fail("Build failed");
    console.error(err.stack || err.message);
    process.exit(1);
  }
}

build();
