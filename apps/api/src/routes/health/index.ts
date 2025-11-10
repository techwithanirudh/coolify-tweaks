import { defineRouteMeta } from "nitro/runtime";

import { healthMeta } from "@/utils/openapi";

defineRouteMeta(healthMeta);

export default () => {
  return {
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  };
};
