import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
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

export default NextApp;
