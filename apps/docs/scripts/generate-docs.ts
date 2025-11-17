import * as OpenAPI from "fumadocs-openapi";
import { rimraf } from "rimraf";

import { openapi } from "@/lib/openapi";

const out = "./content/docs/api/(generated)";

export async function generateDocs() {
  await rimraf(out, {
    filter(v) {
      return !v.endsWith("meta.json");
    },
  });

  await OpenAPI.generateFiles({
    input: openapi,
    output: out,
    per: "operation",
    includeDescription: true,
    groupBy: "none",
    beforeWrite: (files) => {
      for (let i = files.length - 1; i >= 0; i--) {
        const file = files[i];
        if (
          file &&
          (file.path.includes("_docs") || file.path.includes("_nitro"))
        ) {
          files.splice(i, 1);
        }
      }
    },
  });
}
