import { docs } from "fumadocs-mdx:collections/server";
import type {
  InferMetaType,
  InferPageType,
  LoaderPlugin,
} from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { openapiPlugin } from "fumadocs-openapi/server";

export const source = loader({
  baseUrl: "/docs",
  plugins: [pageTreeCodeTitles(), lucideIconsPlugin(), openapiPlugin()],
  source: docs.toFumadocsSource(),
});

function pageTreeCodeTitles(): LoaderPlugin {
  return {
    transformPageTree: {
      file(node) {
        if (
          typeof node.name === "string" &&
          (node.name.endsWith("()") || node.name.match(/^<\w+ \/>$/))
        ) {
          return {
            ...node,
            name: <code className="text-[0.8125rem]">{node.name}</code>,
          };
        }
        return node;
      },
    },
  };
}

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
