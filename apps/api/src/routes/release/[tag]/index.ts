import { lookup as getType } from "mime-types";
import { defineRouteMeta } from "nitro";
import { defineHandler, getQuery, getRouterParam, HTTPError } from "nitro/h3";

import { releaseQuerySchema } from "@repo/validators";

import { allowedHeaders } from "@/config";
import { applyCors } from "@/utils/cors";
import { fetchAsset } from "@/utils/fetcher";
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
  applyCors(event);
  const tag = getRouterParam(event, "tag");
  const query = releaseQuerySchema.parse(getQuery(event));

  if (!tag) {
    throw new HTTPError({
      status: 400,
      statusMessage: "Bad Request",
      message: "Missing tag parameter",
    });
  }

  const asset = query.asset ?? "main.user.css";
  const theme = query.theme ?? null;

  try {
    const { content, headers } = await fetchAsset(tag, asset);

    const processed = await processContent({
      content,
      event,
      asset,
      theme,
    });

    event.res.headers.set(
      "Content-Type",
      getType(asset) || "application/octet-stream",
    );

    if (import.meta.dev) {
      event.res.headers.set("X-Source", "local");
    } else {
      event.res.headers.set("X-Source", "github");
      event.res.headers.set("X-Proxy-Host", "github.com");
      for (const name of allowedHeaders) {
        const value = headers?.get(name);
        if (value) event.res.headers.set(name, value);
      }
    }

    return processed;
  } catch (error) {
    if (error instanceof HTTPError) throw error;

    throw new HTTPError({
      status: 500,
      statusMessage: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
