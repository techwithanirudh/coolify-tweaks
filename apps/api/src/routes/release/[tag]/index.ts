import { lookup as getType } from "mime-types";
import { defineRouteMeta } from "nitro";
import {
  defineHandler,
  getQuery,
  getRequestHeader,
  getRequestIP,
  getRouterParam,
  HTTPError,
} from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

import { trackSession } from "@repo/db/queries";

import { allowedHeaders } from "@/config";
import { hashIp, isValidId } from "@/utils/analytics";
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
      {
        in: "query",
        name: "id",
        description: "Session ID",
        schema: {
          type: "string",
          pattern: "^[a-z0-9]{8}$",
        } as {
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
  const id = isValidId(query.id) ? query.id : null;

  if (!tag) {
    throw new HTTPError({
      status: 400,
      statusMessage: "Bad Request",
      message: "Missing tag parameter",
    });
  }

  const ipHash = hashIp(getRequestIP(event, { xForwardedFor: true }), hashSalt);
  const referer = getRequestHeader(event, "referer") ?? null;
  let statusCode = 500;

  try {
    const { content, headers } = await fetchAsset(tag, asset);
    statusCode = 200;

    const { sessionId, isNewSession } = await trackSession({
      id,
      asset,
      theme,
      tag,
      statusCode,
      ipHash,
      referer,
    });

    const processed = await processContent({
      content,
      event,
      sessionId: isNewSession ? sessionId : undefined,
    });

    event.res.headers.set(
      "Content-Type",
      getType(asset) || "application/octet-stream",
    );

    if (import.meta.dev) {
      event.res.headers.set("X-Source", "local");
    } else {
      event.res.headers.set("X-Source", "github");
      if (headers) {
        for (const name of allowedHeaders) {
          const value = headers.get(name);
          if (value) event.res.headers.set(name, value);
        }
      }
    }

    return processed;
  } catch (error) {
    if (error instanceof HTTPError) {
      statusCode = error.status;
      throw error;
    }

    throw new HTTPError({
      status: 500,
      statusMessage: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
