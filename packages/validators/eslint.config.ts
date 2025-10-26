import { defineConfig } from "eslint/config";

import { baseConfig } from "@repo/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
