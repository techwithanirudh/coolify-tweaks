import { defineConfig } from 'taze'

export default defineConfig({
  force: true,
  write: true,
  install: true,
  maturityPeriod: 14,
  ignorePaths: [
    '**/node_modules/**',
  ],
  ignoreOtherWorkspaces: true,
  packageMode: {
    'typescript': 'major',
    'eslint': 'major',
    '@types/node': 'minor',
    '/react/': 'minor',
  },
  depFields: {
    overrides: false,
  },
})
