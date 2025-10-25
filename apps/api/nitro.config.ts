import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-07-15',
  imports: {
    autoImport: false,
  },
  experimental: {
    openAPI: true,
  },
  openAPI: {
    route: '/_docs/openapi.json',
    meta: {
      title: 'Coolify Tweaks API',
      description: 'Proxies GitHub release assets for Coolify Tweaks',
      version: '1.0',
    },
    ui: {
      scalar: {
        route: '/_docs/scalar',
        theme: 'purple',
      },
      swagger: {
        route: '/_docs/swagger',
      },
    },
  },
});
