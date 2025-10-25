import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@repo/eslint-config/base";

export default defineConfig(
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: [".nitro/**", ".output/**"],
  },
  baseConfig,
  {
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
  restrictEnvAccess,
);
