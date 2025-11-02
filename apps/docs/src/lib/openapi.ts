import { createOpenAPI } from 'fumadocs-openapi/server'

export const openapi = createOpenAPI({
  input: ['./content/docs/api-reference/openapi.yml'],
  proxyUrl: '/api/proxy',
  shikiOptions: {
    themes: {
      dark: 'vesper',
      light: 'vitesse-light',
    },
  },
})
