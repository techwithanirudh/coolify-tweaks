import type { H3Event } from "nitro/h3";

const ALLOW_ORIGIN = "*";
const ALLOW_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const FALLBACK_ALLOW_HEADERS = "Content-Type,Authorization";
const MAX_AGE_SECONDS = "86400";

export function applyCors(event: H3Event): void {
  event.res.headers.set("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  event.res.headers.set("Access-Control-Allow-Credentials", "true");
  event.res.headers.set("Access-Control-Allow-Methods", ALLOW_METHODS);

  const requestedHeaders = event.req.headers.get(
    "access-control-request-headers",
  );
  event.res.headers.set(
    "Access-Control-Allow-Headers",
    requestedHeaders ?? FALLBACK_ALLOW_HEADERS,
  );
  event.res.headers.set("Access-Control-Max-Age", MAX_AGE_SECONDS);
}
