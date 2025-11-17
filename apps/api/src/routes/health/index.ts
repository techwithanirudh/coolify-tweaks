import { defineRouteMeta } from "nitro";
import { defineHandler } from "nitro/h3";

defineRouteMeta({
  openAPI: {
    tags: ["Operations"],
    summary: "Health check",
    description: "Returns service status information for monitoring.",
    operationId: "getHealth",
    responses: {
      "200": {
        description: "Service is healthy.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["ok"],
                  example: "ok",
                },
                message: {
                  type: "string",
                  example: "Server is running",
                },
                timestamp: {
                  type: "string",
                  format: "date-time",
                  example: "2025-01-01T00:00:00Z",
                },
              },
              required: ["status", "message", "timestamp"],
            },
            examples: {
              default_example: {
                summary: "Health check response",
                value: {
                  status: "ok",
                  message: "Server is running",
                  timestamp: "2025-01-01T00:00:00Z",
                },
              },
            },
          },
        },
      },
    },
  },
});

export default defineHandler(() => {
  return {
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  };
});
