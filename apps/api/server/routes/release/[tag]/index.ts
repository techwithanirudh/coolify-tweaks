import {
  createError,
  defineEventHandler,
  getQuery,
  getRouterParam,
  processContent,
} from "#imports";
import { setHeader } from "h3";
import mime from "mime";
import { ofetch } from "ofetch";

import { allowedHeaders, owner, repo } from "~/config";

export default defineEventHandler(async (event) => {
  const tag = getRouterParam(event, "tag");
  const assetParam = getQuery(event)?.asset;
  const asset =
    typeof assetParam === "string" && assetParam.length > 0
      ? assetParam
      : "main.user.css";

  if (!(tag && asset)) {
    throw createError({
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
    } = await ofetch.raw(url, {
      method: "GET",
      responseType: "text",
      ignoreResponseError: true,
      retry: 0,
      headers: { Accept: "*/*" },
    });

    if (!ok) {
      throw createError({
        status,
        statusMessage: statusText,
        message: `GitHub returned ${status}: ${statusText}`,
        data: { url, tag },
      });
    }

    const contentText = typeof content === "string" ? content : "";
    const processed = await processContent({ content: contentText, event });

    const detected = mime.getType(asset);

    setHeader(event, "Content-Type", detected ?? "application/octet-stream");
    setHeader(event, "X-Proxy-Host", "github.com");

    const headers = new Headers(rawHeaders);

    for (const headerName of allowedHeaders) {
      const value = headers.get(headerName);
      if (value) {
        setHeader(event, headerName, value);
      }
    }

    return processed;
  } catch (error) {
    throw createError({
      status: 500,
      statusMessage: "Internal Server Error",
      message: `${error instanceof Error ? error.message : "Unknown error"}`,
      data: { url, tag },
    });
  }
});
