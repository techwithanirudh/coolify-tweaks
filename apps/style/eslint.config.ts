import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@repo/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**", "plugins/**"],
  },
  baseConfig,
  restrictEnvAccess,
);
