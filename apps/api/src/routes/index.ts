import { defineRouteMeta } from "nitro/runtime";

import { apiInfoMeta } from "@/utils/openapi";

defineRouteMeta(apiInfoMeta);

export default () => {
  return {
    service: "Coolify Tweaks API",
    description: "Proxies GitHub release assets for Coolify Tweaks",
    version: "1.0",
  };
};
