import { defineEventHandler } from "#imports";

export default defineEventHandler((_event) => {
  return {
    service: "Coolify Tweaks API",
    description: "Proxies GitHub release assets for Coolify Tweaks",
    version: "1.0",
  };
});
