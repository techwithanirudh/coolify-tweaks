import { defineConfig } from 'taze'

export default defineConfig({
  force: true,
  write: true,
  install: true,
  interactive: true,
  recursive: true,
  includeLocked: true,
  maturityPeriod: 3,
  ignorePaths: [
    '**/node_modules/**',
  ],
  ignoreOtherWorkspaces: true,
  packageMode: {
    'typescript': 'major',
    'eslint': 'minor',
    '@types/node': 'minor',
    '/react/': 'minor',
  },
  depFields: {
    overrides: false,
  },
})
