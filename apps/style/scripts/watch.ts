import path from "node:path";
import fs from "node:fs";
import ora from "ora";
import { Command } from "commander";
import { build as runBuild } from "./build.ts";

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

const cwd = process.cwd();
const ROOT = path.resolve(cwd, opts.dir);
const DEBOUNCE_MS = Math.max(40, Number(opts.debounce) || 120);
const SILENT = !!opts.silent;

const INTERESTING = new Set([".scss", ".sass", ".css"]);
const spinner = ora({ text: "watching…", isEnabled: !SILENT });

function isInteresting(fp: string) {
  return INTERESTING.has(path.extname(fp));
}

let timer: NodeJS.Timeout | null = null;
let building = false;
let queued = false;

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

async function buildOnce() {
  building = true;
  queued = false;
  if (!SILENT) spinner.start("rebuilding…");
  try {
    await runBuild();
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

async function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`watch dir not found: ${ROOT}`);
    process.exit(1);
  }

  if (!SILENT) spinner.start("initial build…");
  await buildOnce();

  const watcher = fs.watch(ROOT, { recursive: true }, (_event, filename) => {
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

  const cleanup = () => {
    if (!SILENT) console.log("\nclosing watcher…");
    try { watcher.close(); } catch {}
    process.exit(0);
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

main().catch((err) => {
  console.error(err?.stack || err?.message || err);
  process.exit(1);
});
