import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import ora from "ora";
import { z } from "zod";

import type { BuildParams, BuildResult } from "./build";
import { build as defaultBuild } from "./build";

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
          .filter(Boolean),
      ),
    ])
    .default([".scss", ".sass", ".css"]),
});

export type WatchParams = z.infer<typeof WatchParamsSchema>;

export interface WatchController {
  schedule: (reason: string) => void;
  close: () => void;
}

export async function startWatch(
  params: Partial<WatchParams> = {},
  build: (input: Partial<BuildParams>) => Promise<BuildResult> = defaultBuild,
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

  let timer: ReturnType<typeof setTimeout> | null = null;

  let running = false;   
  let pending = false;
  const reasons = new Set<string>();

  let watcher: fs.FSWatcher | null = null;

  async function doBuildOnce() {
    if (!SILENT) spinner.start("rebuilding…");
    try {
      const result = await build({ silent: true });
      const { out, bytesKB, seconds } = result;
      if (!SILENT) {
        spinner.succeed(
          `rebuilt ${path.relative(cwd, out)} (${bytesKB} kB) in ${seconds}s`,
        );
      }
    } catch (err: unknown) {
      if (!SILENT) spinner.fail("build failed");
      const msg = err instanceof Error ? err.stack ?? err.message : String(err);
      console.error(msg);
    } finally {
      if (!SILENT) {
        spinner.text = "watching…";
        spinner.start();
      }
    }
  }

  async function run() {
    if (running) return; 
    running = true;
    try {
      while (pending) {
        pending = false;

        const why =
          reasons.size > 0 ? `change: ${Array.from(reasons).join(", ")}` : "";
        if (!SILENT && why) spinner.text = why;
        reasons.clear();

        await doBuildOnce();
      }
    } finally {
      running = false;
    }
  }

  function schedule(reason: string) {
    if (reason) reasons.add(reason);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      pending = true;
      void run();
    }, DEBOUNCE_MS);
  }

  if (!fs.existsSync(ROOT)) {
    console.error(`watch dir not found: ${ROOT}`);
    process.exit(1);
  }

  if (!SILENT) spinner.start("initial build…");

  pending = true;
  await run();

  watcher = fs.watch(ROOT, { recursive: true }, (_event, filename) => {
    const name = filename?.toString();
    if (!name) return;
    const fp = path.join(ROOT, name);
    if (!isInteresting(fp)) return;
    schedule(name);
  });

  if (!SILENT) {
    const rel = path.relative(cwd, ROOT) || ".";
    spinner.text = `watching ${rel}/`;
    spinner.start();
  }

  const close = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    try {
      watcher?.close();
    } catch {
      // ignore
    }
    watcher = null;
    if (!SILENT) {
      try {
        spinner.succeed("watcher stopped");
      } catch {
        // ignore
      }
    }
  };

  return { schedule, close };
}

/**
 * CLI
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
      silent: Boolean(opts.silent),
    },
    defaultBuild,
  )
    .then((controller) => {
      const cleanup = () => {
        controller.close();
        process.exit(0);
      };
      process.on("SIGINT", cleanup);
      process.on("SIGTERM", cleanup);
    })
    .catch((err: unknown) => {
      const message =
        err instanceof Error ? err.stack ?? err.message : String(err);
      console.error(message);
      process.exit(1);
    });
}
