import {
  getQuery,
  getRouterParam,
  H3Event,
  HTTPError,
} from "nitro/h3";
import { lookup as getType } from "mime-types";
import { processContent } from "@/utils/stylus";
import { $fetch } from "nitro/deps/ofetch";

import { allowedHeaders, owner, repo } from "@/config";

export default async (event: H3Event) => {
  const tag = getRouterParam(event, "tag");
  const assetParam = getQuery(event).asset;
  const asset =
    typeof assetParam === "string" && assetParam.length > 0
      ? assetParam
      : "main.user.css";

  if (!(tag && asset)) {
    throw new HTTPError({
      status: 400,
      statusMessage: "Bad Request",
      message: "Invalid input",
      data: { field: tag ? "asset" : "tag" },
    });
  }

  const url =
    tag === "latest"
      ? `https://github.com/${owner}/${repo}/releases/latest/download/${encodeURIComponent(asset)}`
      : `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset)}`;

  try {
    const {
      _data: content,
      headers: rawHeaders,
      status,
      statusText,
      ok,
    } = await $fetch.raw(url, {
      method: "GET",
      responseType: "text",
      ignoreResponseError: true,
      retry: 0,
      headers: { Accept: "*/*" },
    });

    if (!ok) {
      throw new HTTPError({
        status,
        statusMessage: statusText,
        message: `GitHub returned ${status}: ${statusText}`,
        data: { url, tag },
      });
    }

    const contentText = typeof content === "string" ? content : "";
    const processed = await processContent({ content: contentText, event });

    const detected = getType(asset);

    event.res.headers.set("Content-Type", detected || "application/octet-stream");
    event.res.headers.set("X-Proxy-Host", "github.com");

    const headers = new Headers(rawHeaders);

    for (const headerName of allowedHeaders) {
      const value = headers.get(headerName);
      if (value) {
        event.res.headers.set(headerName, value);
      }
    }

    return processed;
  } catch (error) {
    throw new HTTPError({
      status: 500,
      statusMessage: "Internal Server Error",
      message: `${error instanceof Error ? error.message : "Unknown error"}`,
      data: { url, tag },
    });
  }
};
