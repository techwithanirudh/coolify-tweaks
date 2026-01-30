import { defineHandler } from "nitro/h3";

import { applyCors } from "@/utils/cors";

// @ts-expect-error - this is expected
export default defineHandler((event) => {
  applyCors(event);

  if (event.req.method === "OPTIONS") {
    event.res.status = 204;
    return "";
  }
});
