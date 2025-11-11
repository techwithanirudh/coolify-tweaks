import { fileURLToPath } from "node:url";
import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  apiDir: "src",
  experimental: {
    openAPI: true,
  },
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
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
});
