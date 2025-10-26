// build.ts
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
// import browserslist from "browserslist";
import { Command } from "commander";
// import { browserslistToTargets, transform as lcTransform } from "lightningcss";
import ora from "ora";
import postcss from "postcss";
import loadConfig from "postcss-load-config";
import prettier from "prettier";
import * as sass from "sass-embedded";
import { z } from "zod";

const BuildParamsSchema = z.object({
  src: z.string().default("src/main.scss"),
  out: z.string().default("dist/main.user.css"),
  loadPath: z
    .union([
      z.array(z.string()),
      z.string().transform((s) =>
        s
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    ])
    .default(["src"]),
  // minify: z.coerce.boolean().default(true),
  minify: z.coerce.boolean().default(false),
  format: z.coerce.boolean().default(false),
  silent: z.coerce.boolean().default(false),
});

export type BuildParams = z.infer<typeof BuildParamsSchema>;
export interface BuildResult {
  out: string;
  bytesKB: number;
  seconds: number;
}

export async function build(
  input: Partial<BuildParams> = {},
): Promise<BuildResult> {
  const params = BuildParamsSchema.parse(input);

  const cwd = process.cwd();
  const SRC = path.resolve(cwd, params.src);
  const OUT = path.resolve(cwd, params.out);
  const LOAD_PATHS = params.loadPath.map((p) => path.resolve(cwd, p));
  const OUT_DIR = path.dirname(OUT);
  const OUT_MAP = `${OUT}.map`;
  const MINIFY = params.minify;
  const FORMAT = params.format && !MINIFY;
  const SILENT = params.silent;

  const spinner = ora({
    text: "Building styles (Sass → Lightning → PostCSS)",
    isEnabled: !SILENT,
  });

  if (!SILENT) spinner.start();
  const t0 = performance.now();

  try {
    if (!existsSync(OUT_DIR)) await fs.mkdir(OUT_DIR, { recursive: true });

    if (!SILENT) spinner.text = "Compiling SCSS";
    const sassResult = await sass.compileAsync(SRC, {
      style: "expanded",
      sourceMap: true,
      loadPaths: LOAD_PATHS,
    });

    // if (!SILENT) spinner.text = "Running LightningCSS";
    // const blQueries = browserslist.loadConfig({ path: cwd }) ?? ["defaults"];
    // const targets = browserslistToTargets(browserslist(blQueries));
    // const lightningResult = lcTransform({
    //   filename: SRC,
    //   code: Buffer.from(sassResult.css),
    //   minify: MINIFY,
    //   sourceMap: true,
    //   targets,
    // });

    if (!SILENT) spinner.text = "Loading PostCSS config";
    const { plugins, options } = await loadConfig({}, cwd);

    if (!SILENT) spinner.text = "Running PostCSS";
    const processor = postcss(plugins);
    const postcssResult = await processor.process(
      sassResult.css,
      {
        ...options,
        from: SRC,
        to: OUT,
        map: {
          inline: false,
          annotation: path.basename(OUT_MAP),
          prev:
            sassResult.sourceMap ??
            undefined,
          ...(typeof options.map === "object" ? options.map : {}),
        },
      },
    );

    let css = postcssResult.css;

    if (MINIFY && params.format && !SILENT) {
      console.warn("\nMinify and Format are both enabled, skipping formatting");
    }
    if (FORMAT) {
      if (!SILENT) spinner.text = "Formatting";
      try {
        const conf = (await prettier.resolveConfig(OUT)) ?? {};
        css = await prettier.format(css, { ...conf, parser: "css" });
      } catch (e) {
        if (!SILENT) console.warn("Formatting failed:", (e as Error).message);
      }
    }

    if (!SILENT) spinner.text = "Writing output";
    await fs.writeFile(OUT, css, "utf8");
    const mapText = postcssResult.map.toString();
    if (mapText) {
      await fs.writeFile(OUT_MAP, mapText, "utf8");
    }

    const kb = (new TextEncoder().encode(css).length / 1024).toFixed(1);
    const dt = ((performance.now() - t0) / 1000).toFixed(2);
    if (!SILENT)
      spinner.succeed(`Built ${path.relative(cwd, OUT)} (${kb} kB) in ${dt}s`);

    return { out: OUT, bytesKB: Number(kb), seconds: Number(dt) };
  } catch (err: unknown) {
    if (!SILENT) {
      try {
        ora().fail("Build failed");
      } catch {
        // Ignore spinner error
      }
    }
    const message =
      err instanceof Error ? (err.stack ?? err.message) : String(err);
    console.error(message);
    throw err;
  }
}

if (import.meta.main) {
  const program = new Command()
    .name("build")
    .description("Compile SCSS with Sass → LightningCSS → PostCSS")
    .option("-s, --src <path>", "entry SCSS file", "src/main.scss")
    .option("-o, --out <path>", "output CSS file", "dist/main.user.css")
    .option("-l, --load-path <paths>", "comma-separated Sass load paths", "src")
    .option("-m, --minify", "minify output", false)
    .option("-p, --format", "format with Prettier", false)
    .option("--silent", "suppress output", false)
    .allowUnknownOption(false)
    .parse(process.argv);

  const cli = program.opts<{
    src: string;
    out: string;
    loadPath: string;
    minify: boolean;
    format: boolean;
    silent: boolean;
  }>();

  build({
    src: cli.src,
    out: cli.out,
    loadPath: cli.loadPath
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    minify: cli.minify,
    format: cli.format,
    silent: cli.silent,
  }).catch((err: unknown) => {
    const message =
      err instanceof Error ? (err.stack ?? err.message) : String(err);
    console.error(message);
    process.exit(1);
  });
}
