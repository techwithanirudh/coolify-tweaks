import { openapi } from "@/lib/openapi";

export const { GET, HEAD, PUT, POST, PATCH, DELETE } = openapi.createProxy({
  allowedOrigins: [
    "https://coolify-tweaks-api.techwithanirudh.com",
    "https://api.coolify-tweaks.techwithanirudh.com",
    "http://localhost:3001",
  ],
});
