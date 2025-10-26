import { defineConfig } from "eslint/config";

import { baseConfig } from "@repo/eslint-config/base";
import { reactConfig } from "@repo/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
