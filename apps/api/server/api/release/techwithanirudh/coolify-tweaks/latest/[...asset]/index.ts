import { defineEventHandler, getRouterParam, sendRedirect } from "h3";

export default defineEventHandler((event) => {
  const asset = getRouterParam(event, "asset");

  return sendRedirect(
    event,
    `/release/latest/?asset=${encodeURIComponent(asset ?? "")}`,
    301,
  );
});
