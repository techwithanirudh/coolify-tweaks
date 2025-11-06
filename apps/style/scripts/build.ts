import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import browserslist from "browserslist";
import { Command } from "commander";
import { browserslistToTargets, transform as lcTransform } from "lightningcss";
import ora from "ora";
import postcss from "postcss";
import loadConfig from "postcss-load-config";
import * as sass from "sass-embedded";
import { z } from "zod";

import appendThemeIdentifier from "../plugins/postcss/theme-identifier";

/**
 * Coerce CLI strings to boolean where appropriate.
 * Accepts actual booleans too.
 */
const boolish = (v: unknown) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    if (s === "false" || s === "0" || s === "off" || s === "no") return false;
    if (s === "true" || s === "1" || s === "on" || s === "yes") return true;
  }
  return v;
};

const BuildParamsSchema = z.object({
  src: z.string().default("src/main.scss"),
  out: z.string().default("dist/main.user.css"),

  // Accept either a string path or false to disable
  transformed: z
    .preprocess(boolish, z.union([z.string(), z.boolean()]))
    .default("dist/main.css"),

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

  minify: z.coerce.boolean().default(false),
  silent: z.coerce.boolean().default(false),
});

export type BuildParams = z.infer<typeof BuildParamsSchema>;

export interface BuildResult {
  out: string;
  bytesKB: number;
  seconds: number;
  transformed?: string;
  transformedBytesKB?: number;
}

export async function build(
  input: Partial<BuildParams> = {},
): Promise<BuildResult> {
  const params = BuildParamsSchema.parse(input);

  const cwd = process.cwd();
  const SRC = path.resolve(cwd, params.src);
  const OUT = path.resolve(cwd, params.out);
  const OUT_DIR = path.dirname(OUT);
  const OUT_MAP = `${OUT}.map`;

  const TRANSFORM_ENABLED = typeof params.transformed === "string";
  const TRANSFORMED = TRANSFORM_ENABLED
    ? path.resolve(cwd, params.transformed as string)
    : undefined;
  const TRANSFORMED_DIR = TRANSFORM_ENABLED
    ? path.dirname(TRANSFORMED as string)
    : undefined;
  const TRANSFORMED_MAP = TRANSFORM_ENABLED
    ? `${TRANSFORMED}.map`
    : undefined;

  const LOAD_PATHS = params.loadPath.map((p) => path.resolve(cwd, p));
  const MINIFY = params.minify;
  const SILENT = params.silent;

  const spinner = ora({
    text: "Building styles (Sass → Lightning → PostCSS)",
    isEnabled: !SILENT,
  });

  if (!SILENT) spinner.start();
  const t0 = performance.now();

  try {
    if (!existsSync(OUT_DIR)) await fs.mkdir(OUT_DIR, { recursive: true });
    if (TRANSFORM_ENABLED && TRANSFORMED_DIR && !existsSync(TRANSFORMED_DIR)) {
      await fs.mkdir(TRANSFORMED_DIR, { recursive: true });
    }

    if (!SILENT) spinner.text = "Compiling SCSS";
    const sassResult = await sass.compileAsync(SRC, {
      style: "expanded",
      sourceMap: true,
      loadPaths: LOAD_PATHS,
    });

    if (!SILENT) spinner.text = "Running LightningCSS";
    const blQueries =
      browserslist.loadConfig({ path: cwd }) ?? browserslist.defaults;
    const targets = browserslistToTargets(browserslist(blQueries));
    const lightningResult = lcTransform({
      filename: SRC,
      code: Buffer.from(sassResult.css),
      minify: MINIFY,
      sourceMap: true,
      targets,
    });

    const lightningCss =
      typeof lightningResult.code === "string"
        ? lightningResult.code
        : Buffer.from(lightningResult.code).toString("utf8");

    const lightningMapText = lightningResult.map?.toString() ?? sassResult.sourceMap ?? undefined;

    if (!SILENT) spinner.text = "Loading PostCSS config (OUT)";
    const { plugins, options } = await loadConfig({}, cwd);

    if (!SILENT) spinner.text = "PostCSS (OUT)";
    const processorMain = postcss(plugins);
    const postcssMain = await processorMain.process(lightningCss, {
      ...options,
      from: SRC,
      to: OUT,
      map: {
        inline: false,
        annotation: path.basename(OUT_MAP),
        prev: lightningMapText,
        ...(typeof options.map === "object" ? options.map : {}),
      },
    });

    if (!SILENT) spinner.text = "Writing main output";
    await fs.writeFile(OUT, postcssMain.css, "utf8");
    const mainMapText = postcssMain.map?.toString();
    if (mainMapText) await fs.writeFile(OUT_MAP, mainMapText, "utf8");

    let kbTransformed: number | undefined;

    if (TRANSFORM_ENABLED && TRANSFORMED && TRANSFORMED_MAP) {
      if (!SILENT) spinner.text = "PostCSS (TRANSFORMED)";
      const processorTransformed = postcss([appendThemeIdentifier()]);
      const postcssTransformed = await processorTransformed.process(
        lightningCss,
        {
          from: SRC,
          to: TRANSFORMED,
          map: {
            inline: false,
            annotation: path.basename(TRANSFORMED_MAP),
            prev: lightningMapText,
          },
        },
      );

      if (!SILENT) spinner.text = "Writing transformed output";
      await fs.writeFile(TRANSFORMED, postcssTransformed.css, "utf8");
      const transformedMapText = postcssTransformed.map?.toString();
      if (transformedMapText)
        await fs.writeFile(TRANSFORMED_MAP, transformedMapText, "utf8");

      kbTransformed =
        Number(
          (
            new TextEncoder().encode(postcssTransformed.css).length / 1024
          ).toFixed(1)
        ) || 0;
    }

    const kbMain = Number(
      (new TextEncoder().encode(postcssMain.css).length / 1024).toFixed(1),
    );
    const dt = Number(((performance.now() - t0) / 1000).toFixed(2));

    if (!SILENT) {
      if (TRANSFORM_ENABLED) {
        spinner.succeed(
          `Built ${path.relative(cwd, OUT)} (${kbMain} kB)` +
            ` and ${path.relative(
              cwd,
              TRANSFORMED!,
            )} (${kbTransformed ?? 0} kB) in ${dt}s`,
        );
      } else {
        spinner.succeed(
          `Built ${path.relative(cwd, OUT)} (${kbMain} kB) in ${dt}s`,
        );
      }
    }

    return {
      out: OUT,
      bytesKB: kbMain,
      seconds: dt,
      transformed: TRANSFORM_ENABLED ? TRANSFORMED : undefined,
      transformedBytesKB: TRANSFORM_ENABLED ? kbTransformed : undefined,
    };
  } catch (err: unknown) {
    if (!SILENT) {
      try {
        ora().fail("Build failed");
      } catch {
        // ignore spinner error
      }
    }
    const message =
      err instanceof Error ? err.stack ?? err.message : String(err);
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
    .option(
      "-t, --transformed <pathOrBool>",
      "path for transformed CSS, or false to disable",
      "dist/main.css",
    )
    .option("-l, --load-path <paths>", "comma-separated Sass load paths", "src")
    .option("-m, --minify", "minify output", false)
    .option("--silent", "suppress output", false)
    .allowUnknownOption(false)
    .parse(process.argv);

  const cli = program.opts<{
    src: string;
    out: string;
    transformed: string | boolean;
    loadPath: string;
    minify: boolean | string;
    silent: boolean | string;
  }>();

  build({
    src: cli.src,
    out: cli.out,
    transformed: cli.transformed as string | boolean,
    loadPath: typeof cli.loadPath === "string"
      ? cli.loadPath
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      : [],
    minify: Boolean(boolish(cli.minify)),
    silent: Boolean(boolish(cli.silent)),
  }).catch((err: unknown) => {
    const message =
      err instanceof Error ? err.stack ?? err.message : String(err);
    console.error(message);
    process.exit(1);
  });
}
