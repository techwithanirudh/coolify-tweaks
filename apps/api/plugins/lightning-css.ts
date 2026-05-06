import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import type { Plugin } from "rolldown";

const nodeRequire = createRequire(import.meta.url);

export function lightningCss(): Plugin {
  return {
    name: "lightningcss-wasm-asset",
    buildStart() {
      this.emitFile({
        type: "asset",
        fileName: "_libs/lightningcss_node.wasm",
        source: readFileSync(
          nodeRequire.resolve("lightningcss-wasm/lightningcss_node.wasm"),
        ),
      });
    },
  };
}
