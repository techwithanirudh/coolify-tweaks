import {
  eventHandler,
  getRequestHeader,
  setResponseHeader,
  setResponseStatus,
} from "#imports";

const ALLOW_ORIGIN = "*";
const ALLOW_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const FALLBACK_ALLOW_HEADERS = "Content-Type,Authorization";
const MAX_AGE_SECONDS = 86400;

export default eventHandler((event) => {
  setResponseHeader(event, "Access-Control-Allow-Origin", ALLOW_ORIGIN);
  setResponseHeader(event, "Access-Control-Allow-Credentials", "true");
  setResponseHeader(event, "Access-Control-Allow-Methods", ALLOW_METHODS);

  const requestedHeaders = getRequestHeader(
    event,
    "access-control-request-headers",
  );
  setResponseHeader(
    event,
    "Access-Control-Allow-Headers",
    requestedHeaders ?? FALLBACK_ALLOW_HEADERS,
  );
  setResponseHeader(event, "Access-Control-Max-Age", MAX_AGE_SECONDS);

  if (event.node.req.method === "OPTIONS") {
    setResponseStatus(event, 204);
    return "";
  }
});
