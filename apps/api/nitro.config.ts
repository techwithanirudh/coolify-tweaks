import { fileURLToPath } from "node:url";
import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "src",
  experimental: {
    openAPI: true,
  },
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
  runtimeConfig: {
    hashSalt: process.env.HASH_SALT ?? "",
    stylePath: fileURLToPath(new URL("../style/dist", import.meta.url)),
  },
  openAPI: {
    route: "/_docs/openapi.json",
    production: "runtime",
    meta: {
      title: "Coolify Tweaks API",
      description: "Proxies GitHub release assets for Coolify Tweaks",
      version: "1.0",
    },
    ui: {
      scalar: {
        route: "/_docs/scalar",
      },
      swagger: {
        route: "/_docs/swagger",
      },
    },
  },
  routeRules: {
    "/main.user.css": {
      redirect: "/release/latest/?asset=main.user.css",
    },
    "/main.css": {
      redirect: "/release/latest/?asset=main.css",
    },
  },
});
