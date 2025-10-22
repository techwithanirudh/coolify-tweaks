const config = {
  version: "0.2",
  language: "en",
  allowCompoundWords: true,
  import: [
    "@cspell/dict-bash/cspell-ext.json",
    "@cspell/dict-npm/cspell-ext.json",
    "@cspell/dict-redis/cspell-ext.json"
  ],
  ignorePaths: [
    "**/.cache/**",
    "**/.changeset/**",
    "**/.git/**",
    "**/.husky/**",
    "**/.idea/**",
    "**/.swc/**",
    "**/.turbo/**",
    "**/.vscode/**",
    "**/build/**",
    "**/coverage/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/tmp/**",
    "**/package-lock.json",
    "**/pnpm-lock.yaml",
    "**/yarn.lock",
    "**/bun.lock",
    "**/bun.lockb"
  ],
  ignoreRegExpList: [
    "/https?:\\/\\/\\S+/g",
    "/0x[a-fA-F0-9]+/g",
    "/[\\dA-F]{32,}/g"
  ],
  overrides: [
    {
      filename: "**/*.json",
      languageId: "json"
    },
    {
      filename: "**/*.md",
      languageId: "markdown"
    },
    {
      filename: "**/*.scss",
      languageId: "scss"
    },
    {
      filename: "**/*.ts",
      languageId: "typescript"
    },
    {
      filename: "**/*.tsx",
      languageId: "typescriptreact"
    }
  ],
  words: [
    "anirudh",
    "coolify",
    "lefthook",
    "mailhog",
    "techwithanirudh",
    "vite"
  ]
};

module.exports = config;
