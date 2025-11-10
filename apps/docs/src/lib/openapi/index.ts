import path from "node:path";
import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  input: [path.resolve("./content/docs/api-reference/openapi.yml")],
  proxyUrl: "/api/proxy",
});
