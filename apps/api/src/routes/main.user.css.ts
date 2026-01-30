import { lookup as getType } from "mime-types";
import { defineHandler, getQuery } from "nitro/h3";

import { releaseQuerySchema } from "@repo/validators";

import { allowedHeaders } from "@/config";
import { applyCors } from "@/utils/cors";
import { fetchAsset } from "@/utils/fetcher";
import { processContent } from "@/utils/themes";

export default defineHandler(async (event) => {
  applyCors(event);
  const query = releaseQuerySchema.parse(getQuery(event));
  const asset = "main.user.css";
  const theme = query.theme ?? null;

  const { content, headers } = await fetchAsset("latest", asset);
  const processed = await processContent({ content, event, asset, theme });

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
});
