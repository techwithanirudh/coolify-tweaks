import type { InferMetaType, InferPageType } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { openapiPlugin } from "fumadocs-openapi/server";

import { docs } from "@/.source";

export const source = loader(docs.toFumadocsSource(), {
  baseUrl: "/docs",
  plugins: [lucideIconsPlugin()],
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
