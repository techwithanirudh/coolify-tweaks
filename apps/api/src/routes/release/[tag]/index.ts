import { lookup as getType } from "mime-types";
import { defineRouteMeta } from "nitro";
import { $fetch } from "nitro/deps/ofetch";
import {
  defineHandler,
  getQuery,
  getRequestIP,
  getRouterParam,
  HTTPError,
} from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

import { logRequest } from "@repo/db/queries";

import { allowedHeaders, owner, repo } from "@/config";
import { hashIp } from "@/utils/hash";
import { processContent } from "@/utils/themes";

defineRouteMeta({
  openAPI: {
    tags: ["Releases"],
    summary: "Get release asset",
    description:
      "Fetch a release asset from GitHub releases with optional theme injection.",
    operationId: "getReleaseAsset",
    parameters: [
      {
        in: "path",
        name: "tag",
        required: true,
        description: "Release tag (`latest` or version like `v3.8.10`).",
        schema: { type: "string" },
        example: "latest",
      },
      {
        in: "query",
        name: "asset",
        description: "Asset file name. Defaults to `main.user.css`.",
        schema: { type: "string", default: "main.user.css" },
      },
      {
        in: "query",
        name: "theme",
        description: "TweakCN theme ID for CSS variable injection.",
        schema: { type: "string", pattern: "^c[a-z0-9]{24}$" } as {
          type: "string";
          pattern: string;
        },
      },
    ],
    responses: {
      "200": {
        description: "Release asset content.",
        content: {
          "text/css": { schema: { type: "string" } },
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      },
      "400": { description: "Invalid parameters." },
      "404": { description: "Asset, tag, or theme not found." },
      "500": { description: "Server error." },
    },
  },
});

export default defineHandler(async (event) => {
  const { hashSalt } = useRuntimeConfig();
  const tag = getRouterParam(event, "tag");
  const query = getQuery(event);

  const asset =
    typeof query.asset === "string" && query.asset
      ? query.asset
      : "main.user.css";
  const theme =
    typeof query.theme === "string" && query.theme ? query.theme : null;

  if (!tag) {
    throw new HTTPError({
      status: 400,
      statusMessage: "Bad Request",
      message: "Missing tag parameter",
    });
  }

  const url =
    tag === "latest"
      ? `https://github.com/${owner}/${repo}/releases/latest/download/${encodeURIComponent(asset)}`
      : `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset)}`;

  try {
    const response = await $fetch.raw(url, {
      method: "GET",
      responseType: "text",
      ignoreResponseError: true,
      retry: 0,
      headers: { Accept: "*/*" },
    });

    if (!response.ok) {
      throw new HTTPError({
        status: response.status,
        statusMessage: response.statusText,
        message: `GitHub returned ${response.status}: ${response.statusText}`,
        data: { url, tag },
      });
    }

    const content = typeof response._data === "string" ? response._data : "";
    const processed = await processContent({ content, event });

    event.res.headers.set(
      "Content-Type",
      getType(asset) || "application/octet-stream",
    );
    event.res.headers.set("X-Proxy-Host", "github.com");

    const headers = new Headers(response.headers);
    for (const name of allowedHeaders) {
      const value = headers.get(name);
      if (value) event.res.headers.set(name, value);
    }

    void logRequest({
      asset,
      theme,
      tag,
      statusCode: response.status,
      ipHash: hashIp(getRequestIP(event, { xForwardedFor: true }), hashSalt),
    });

    return processed;
  } catch (error) {
    if (error instanceof HTTPError) throw error;

    throw new HTTPError({
      status: 500,
      statusMessage: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
      data: { url, tag },
    });
  }
});
