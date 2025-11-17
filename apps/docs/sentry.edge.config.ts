// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: "https://a453fcb267d9832bc3a9511e93c00aa1@o4506561774551040.ingest.us.sentry.io/4510377696690176",
  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: true,
});
