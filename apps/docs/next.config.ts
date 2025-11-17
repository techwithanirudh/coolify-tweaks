import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import { createMDX } from "fumadocs-mdx/next";

async function createNextConfig(): Promise<NextConfig> {
  const { createJiti } = await import("jiti");
  const jiti = createJiti(fileURLToPath(import.meta.url));

  await jiti.import("./src/env");

  const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: process.env.SOURCE_MAPS === "true",
    devIndicators: false,
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    serverExternalPackages: [
      "ts-morph",
      "typescript",
      "oxc-transform",
      "twoslash",
      "twoslash-protocol",
      "shiki",
      "@takumi-rs/core",
    ],
    transpilePackages: ["@repo/db", "@repo/ui", "@repo/validators"],
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "avatars.githubusercontent.com",
          port: "",
        },
      ],
      qualities: [75, 100],
    },
    async rewrites() {
      return [
        {
          source: "/docs/:path*.mdx",
          destination: "/llms.mdx/:path*",
        },
      ];
    },
  };

  return nextConfig;
}

const bundleAnalyzerPlugin = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const mdxPlugin = createMDX();

const NextApp = async () => {
  const nextConfig = await createNextConfig();
  const plugins = [bundleAnalyzerPlugin, mdxPlugin];
  return plugins.reduce((config, plugin) => plugin(config), nextConfig);
};

export default withSentryConfig(NextApp, {
  org: "tech-with-anirudh",
  project: "coolify-tweaks",
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/sntrys",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
