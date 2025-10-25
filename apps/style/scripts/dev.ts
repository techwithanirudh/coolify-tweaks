// dev.ts
import path from "node:path";
import http from "node:http";
import serveHandler from "serve-handler";
import { Command } from "commander";
import { startWatch } from "./watch.ts";
import { build as runBuild } from "./build.ts";

type RunningServer = {
  server: http.Server;
  url: string;
  close: () => Promise<void>;
};

async function startServer({
  host,
  port,
  spa,
  root,
}: {
  host: string;
  port: number;
  spa: boolean;
  root: string;
}): Promise<RunningServer> {
  const handlerOptions: Parameters<typeof serveHandler>[2] = {
    public: root,
    cleanUrls: true,
    etag: true,
    headers: [
      {
        source: "**/*",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ],
    ...(spa ? { rewrites: [{ source: "**", destination: "/index.html" }] } : {}),
  };

  const server = http.createServer((req, res) => serveHandler(req, res, handlerOptions));

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve());
  });

  const url = `http://${host}:${port}`;
  const close = async () =>
    new Promise<void>((resolve) => {
      try {
        server.closeAllConnections?.();
      } catch {}
      server.close(() => resolve());
      setTimeout(() => resolve(), 250).unref();
    });

  return { server, url, close };
}

const program = new Command()
  .name("dev")
  .description("Watch and rebuild. Optionally serve dist.")
  // watch options
  .option("-d, --dir <dir>", "directory to watch", "src")
  .option("--debounce <ms>", "debounce delay", "120")
  .option("--silent", "suppress output", false)
  // minimal serve options
  .option("--serve", "start static server for dist", false)
  .option("--host <host>", "host for server", "127.0.0.1")
  .option("--port <port>", "port for server", "5173")
  .option("--spa", "rewrite unknown routes to /index.html", false)
  .allowUnknownOption(false)
  .parse(process.argv);

const opts = program.opts<{
  dir: string;
  debounce: string;
  silent: boolean;
  serve: boolean;
  host: string;
  port: string;
  spa: boolean;
}>();

async function main() {
  const controller = await startWatch(
    {
      dir: opts.dir,
      debounce: Number(opts.debounce) || 120,
      silent: !!opts.silent,
    },
    runBuild
  );

  let serverRef: RunningServer | null = null;
  if (opts.serve) {
    const SERVE_ROOT = path.resolve(process.cwd(), "dist");
    serverRef = await startServer({
      host: opts.host,
      port: Number(opts.port) || 5173,
      spa: !!opts.spa,
      root: SERVE_ROOT,
    });
    if (!opts.silent) {
      const rel = path.relative(process.cwd(), SERVE_ROOT) || ".";
      console.log(`Serving ${rel}/ at ${serverRef.url}`);
    }
  }

  const cleanup = async () => {
    if (!opts.silent) console.log("\nshutting down…");
    try {
      controller.close();
    } catch {}
    try {
      await serverRef?.close();
    } catch {}
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

if (import.meta.main) {
  main().catch((err) => {
    console.error(err?.stack || err?.message || err);
    process.exit(1);
  });
}
