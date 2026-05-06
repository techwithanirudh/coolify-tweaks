import type { RemarkAutoTypeTableOptions } from "fumadocs-typescript";
import type { ElementContent } from "hast";
import type { Root } from "mdast";
import type { ShikiTransformer } from "shiki";
import type { Transformer } from "unified";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { applyMdxPreset, defineConfig, defineDocs } from "fumadocs-mdx/config";
import jsonSchema from "fumadocs-mdx/plugins/json-schema";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { visit } from "unist-util-visit";
import { z } from "zod";

import { defaultShikiOptions } from "./src/lib/shiki";

const isLint = process.env.LINT === "1";

export const docs = defineDocs({
  docs: {
    schema: pageSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
      /**
       * API routes only
       */
      method: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
      valueToExport: ["elementIds"],
    },
    async: true,
    async mdxOptions(environment) {
      const { rehypeCodeDefaultOptions } =
        await import("fumadocs-core/mdx-plugins/rehype-code");
      const { remarkSteps } =
        await import("fumadocs-core/mdx-plugins/remark-steps");
      const { transformerTwoslash } = await import("fumadocs-twoslash");
      const { createFileSystemTypesCache } =
        await import("fumadocs-twoslash/cache-fs");
      const { default: remarkMath } = await import("remark-math");
      const { remarkTypeScriptToJavaScript } =
        await import("fumadocs-docgen/remark-ts2js");
      const { default: rehypeKatex } = await import("rehype-katex");
      const {
        remarkAutoTypeTable,
        createGenerator,
        createFileSystemGeneratorCache,
      } = await import("fumadocs-typescript");

      const typeTableOptions: RemarkAutoTypeTableOptions = {
        generator: createGenerator({
          cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
        }),
        shiki: defaultShikiOptions,
      };
      return applyMdxPreset({
        rehypeCodeOptions: isLint
          ? false
          : {
              langs: ["ts", "js", "html", "tsx", "mdx"],
              inline: "tailing-curly-colon",
              themes: {
                light: "catppuccin-latte",
                dark: "catppuccin-mocha",
              },
              transformers: [
                ...(rehypeCodeDefaultOptions.transformers ?? []),
                transformerTwoslash({
                  typesCache: createFileSystemTypesCache(),
                  twoslashOptions: {
                    compilerOptions: {
                      types: ["@types/node"],
                    },
                  },
                }),
                transformerEscape(),
              ],
            },
        remarkCodeTabOptions: {
          parseMdx: true,
        },
        remarkStructureOptions: {
          stringify: {
            filterElement(node) {
              switch (node.type) {
                case "mdxJsxFlowElement":
                case "mdxJsxTextElement":
                  switch (node.name) {
                    case "File":
                    case "TypeTable":
                    case "Callout":
                    case "Card":
                    case "Custom":
                      return true;
                    default:
                      return "children-only";
                  }
                default:
                  return true;
              }
            },
          },
        },
        remarkNpmOptions: {
          persist: {
            id: "package-manager",
          },
        },
        remarkPlugins: isLint
          ? [remarkElementIds]
          : [
              remarkSteps,
              remarkMath,
              [remarkAutoTypeTable, typeTableOptions],
              remarkTypeScriptToJavaScript,
            ],
        rehypePlugins: (v) => [rehypeKatex, ...v],
      })(environment);
    },
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

function transformerEscape(): ShikiTransformer {
  return {
    name: "@shikijs/transformers:remove-notation-escape",
    code(hast) {
      function replace(node: ElementContent) {
        if (node.type === "text") {
          node.value = node.value.replace("[\\!code", "[!code");
        } else if ("children" in node) {
          for (const child of node.children) {
            replace(child);
          }
        }
      }

      replace(hast);
      return hast;
    },
  };
}

function remarkElementIds(): Transformer<Root, Root> {
  return (tree, file) => {
    file.data ??= {};
    file.data.elementIds ??= [];

    visit(tree, "mdxJsxFlowElement", (element) => {
      if (!(element.name && element.attributes)) {
        return;
      }

      const idAttr = element.attributes.find(
        (attr) => attr.type === "mdxJsxAttribute" && attr.name === "id",
      );

      if (idAttr && typeof idAttr.value === "string") {
        (file.data.elementIds as string[]).push(idAttr.value);
      }
    });
  };
}

export default defineConfig({
  plugins: [
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
});
