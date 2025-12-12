import { notFound } from "next/navigation";
import { ImageResponse } from "@takumi-rs/image-response";

import { categories } from "@/lib/constants";
import { getPageImage } from "@/lib/metadata";
import { source } from "@/lib/source";
import { getImageResponseOptions, generate as MetadataImage } from "./generate";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/[...slug]">,
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) {
    notFound();
  }
  const slugs = page.path.split("/");
  if (!slugs[0]) {
    notFound();
  }
  const tag = categories[slugs[0]] ?? slugs[0];

  return new ImageResponse(
    <MetadataImage
      description={page.data.description}
      tag={tag}
      title={page.data.title}
    />,
    await getImageResponseOptions(),
  );
}

export function generateStaticParams(): {
  slug: string[];
}[] {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
