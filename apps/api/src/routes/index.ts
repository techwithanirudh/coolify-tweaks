import { defineRouteMeta } from "nitro/runtime";

defineRouteMeta({
  openAPI: {
    tags: ["Operations"],
    summary: "API information",
    description: "Returns basic information about the API service.",
    operationId: "getApiInfo",
    responses: {
      "200": {
        description: "API information.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                service: {
                  type: "string",
                  example: "Coolify Tweaks API",
                },
                description: {
                  type: "string",
                  example: "Proxies GitHub release assets for Coolify Tweaks",
                },
                version: {
                  type: "string",
                  example: "1.0",
                },
              },
              required: ["service", "description", "version"],
            },
            examples: {
              default_example: {
                summary: "API information response",
                value: {
                  service: "Coolify Tweaks API",
                  description: "Proxies GitHub release assets for Coolify Tweaks",
                  version: "1.0",
                },
              },
            },
          },
        },
      },
    },
  },
});

export default () => {
  return {
    service: "Coolify Tweaks API",
    description: "Proxies GitHub release assets for Coolify Tweaks",
    version: "1.0",
  };
};
