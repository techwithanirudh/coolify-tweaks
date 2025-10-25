import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import ora from "ora";
import { Command } from "commander";
import * as sass from "sass-embedded";
import prettier from "prettier";
import { transform as lcTransform, browserslistToTargets } from "lightningcss";
import browserslist from "browserslist";
import postcss from "postcss";
import loadConfig from "postcss-load-config";

const program = new Command()
  .name("build")
  .description("Compile SCSS with Sass → LightningCSS → PostCSS pipeline")
  .option("-s, --src <path>", "entry SCSS file", "src/main.scss")
  .option("-o, --out <path>", "output CSS file", "dist/main.user.css")
  .option("-l, --load-path <paths>", "comma-separated Sass load paths", "src")
  .option("-m, --minify", "minify output", true)
  .option("-p, --format", "format with Prettier", false)
  .allowUnknownOption(false)
  .parse(process.argv);

const opts = program.opts<{
  src: string;
  out: string;
  loadPath: string;
  minify: boolean;
  format: boolean;
}>();

const cwd = process.cwd();
const SRC = path.resolve(cwd, opts.src);
const OUT = path.resolve(cwd, opts.out);
const LOAD_PATHS = opts.loadPath
  .split(",")
  .map((p) => path.resolve(cwd, p.trim()))
  .filter(Boolean);

const OUT_DIR = path.dirname(OUT);
const OUT_MAP = `${OUT}.map`;
const MINIFY = !!opts.minify;
const FORMAT = !!opts.format && !MINIFY;

export async function build() {
  const spinner = ora("Building styles (Sass → Lightning → PostCSS)").start();
  const t0 = performance.now();

  try {
    if (!existsSync(OUT_DIR)) await fs.mkdir(OUT_DIR, { recursive: true });

    spinner.text = "Compiling SCSS";
    const sassResult = await sass.compileAsync(SRC, {
      style: "expanded",
      sourceMap: true,
      loadPaths: LOAD_PATHS,
    });

    spinner.text = "Running LightningCSS";
    const blQueries = browserslist.loadConfig({ path: cwd }) || ["defaults"];
    const targets = browserslistToTargets(browserslist(blQueries));
    const lightningResult = lcTransform({
      filename: SRC,
      code: Buffer.from(sassResult.css),
      minify: MINIFY,
      sourceMap: true,
      targets,
    });

    spinner.text = "Loading PostCSS config";
    const { plugins, options } = await loadConfig({}, cwd);

    spinner.text = "Running PostCSS";
    const processor = postcss(plugins);
    const postcssResult = await processor.process(lightningResult.code.toString(), {
      ...options,
      from: SRC,
      to: OUT,
      map: {
        inline: false,
        annotation: path.basename(OUT_MAP),
        prev: lightningResult.map?.toString() ?? sassResult.sourceMap ?? undefined,
        ...(typeof options.map === "object" ? options.map : {}),
      },
    });

    let css = postcssResult.css;

    if (MINIFY && opts.format) console.warn("\nMinify and Format are both enabled, skipping formatting");
    if (FORMAT) {
      spinner.text = "Formatting";
      try {
        const conf = (await prettier.resolveConfig(OUT)) ?? {};
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

    const kb = (new TextEncoder().encode(css).length / 1024).toFixed(1);
    const dt = ((performance.now() - t0) / 1000).toFixed(2);
    spinner.succeed(`Built ${path.relative(cwd, OUT)} (${kb} kB) in ${dt}s`);
  } catch (err: any) {
    spinner.fail("Build failed");
    console.error(err.stack || err.message);
    throw err;
  }
}

if (import.meta.main) {
  build().catch((err) => {
    console.error(err.stack || err.message);
    process.exit(1);
  });
}
