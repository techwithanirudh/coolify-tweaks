import { defineEventHandler } from "#imports";

export default defineEventHandler((_event) => {
  return {
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  };
});
