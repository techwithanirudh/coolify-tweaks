import { createOpenAPI } from "fumadocs-openapi/server";
import { env } from "@/env";

const API_URL = env.NEXT_PUBLIC_API_URL;
const route = new URL(`${API_URL}/_docs/openapi.json`);

export const openapi = createOpenAPI({
  input: [route.toString()],
  proxyUrl: "/api/proxy",
});
