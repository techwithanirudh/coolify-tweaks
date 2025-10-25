import path from "node:path";
import fs from "node:fs";
import ora from "ora";
import { Command } from "commander";
import { build as defaultBuild } from "./build.ts";
import { z } from "zod";

const WatchParamsSchema = z.object({
  dir: z.string().default("src"),
  debounce: z.coerce.number().int().positive().default(120),
  silent: z.coerce.boolean().default(false),
  interestingExts: z
    .union([
      z.array(z.string()),
      z.string().transform((s) =>
        s
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      ),
    ])
    .default([".scss", ".sass", ".css"]),
});

export type WatchParams = z.infer<typeof WatchParamsSchema>;

export type WatchController = {
  schedule: (reason: string) => void;
  close: () => void;
};

export async function startWatch(
  params: Partial<WatchParams> = {},
  build: () => Promise<void> = defaultBuild
): Promise<WatchController> {
  const cfg = WatchParamsSchema.parse(params);

  const cwd = process.cwd();
  const ROOT = path.resolve(cwd, cfg.dir);
  const DEBOUNCE_MS = Math.max(40, cfg.debounce);
  const SILENT = cfg.silent;

  const INTERESTING = new Set(cfg.interestingExts.map((e) => e.toLowerCase()));
  const spinner = ora({ text: "watching…", isEnabled: !SILENT });

  function isInteresting(fp: string) {
    return INTERESTING.has(path.extname(fp).toLowerCase());
  }

  let timer: NodeJS.Timeout | null = null;
  let building = false;
  let queued = false;
  let watcher: fs.FSWatcher | null = null;

  async function buildOnce() {
    building = true;
    queued = false;
    if (!SILENT) spinner.start("rebuilding…");
    try {
      await build();
      if (!SILENT) spinner.succeed("rebuilt");
    } catch (err: any) {
      if (!SILENT) spinner.fail("build failed");
      console.error(err?.stack || err?.message || err);
    } finally {
      building = false;
      if (queued) {
        queued = false;
        await buildOnce();
      } else if (!SILENT) {
        spinner.text = "watching…";
        spinner.start();
      }
    }
  }

  function schedule(reason: string) {
    if (!SILENT) spinner.text = `change: ${reason}`;
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      if (building) {
        queued = true;
        return;
      }
      await buildOnce();
    }, DEBOUNCE_MS);
  }

  if (!fs.existsSync(ROOT)) {
    console.error(`watch dir not found: ${ROOT}`);
    process.exit(1);
  }

  if (!SILENT) spinner.start("initial build…");
  await buildOnce();

  watcher = fs.watch(ROOT, { recursive: true }, (_event, filename) => {
    const name = filename?.toString();
    if (!name) return;
    const fp = path.join(ROOT, name);
    if (!isInteresting(fp)) return;
    schedule(name);
  });

  if (!SILENT) {
    const rel = path.relative(cwd, ROOT) || ".";
    spinner.text = `watching ${rel}/ (recursive)`;
    spinner.start();
  }

  const close = () => {
    try {
      watcher?.close();
    } catch {}
    watcher = null;
  };

  return { schedule, close };
}

/**
 * CLI
 * Flags remain simple. No JSON piping here.
 */
if (import.meta.main) {
  const program = new Command()
    .name("watch")
    .description("Watch SCSS/CSS files and rebuild on change")
    .option("-d, --dir <dir>", "directory to watch", "src")
    .option("--debounce <ms>", "debounce delay", "120")
    .option("--silent", "suppress output", false)
    .allowUnknownOption(false)
    .parse(process.argv);

  const opts = program.opts<{
    dir: string;
    debounce: string;
    silent: boolean;
  }>();

  startWatch(
    {
      dir: opts.dir,
      debounce: Number(opts.debounce) || 120,
      silent: !!opts.silent,
    },
    defaultBuild
  )
    .then((controller) => {
      const cleanup = () => {
        console.log("\nclosing watcher…");
        controller.close();
        process.exit(0);
      };
      process.on("SIGINT", cleanup);
      process.on("SIGTERM", cleanup);
    })
    .catch((err) => {
      console.error(err?.stack || err?.message || err);
      process.exit(1);
    });
}
