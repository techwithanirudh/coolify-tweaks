import type { InferPageType } from "fumadocs-core/source";
import type { FileObject } from "next-validate-link";
import { printErrors, scanURLs, validateFiles } from "next-validate-link";

import { source } from "@/lib/source";

type AnySource = typeof source;

async function checkLinks() {
  const scanned = await scanURLs({
    preset: "next",
    populate: {
      "docs/[[...slug]]": await Promise.all(
        source.getPages().map(async (page) => ({
          value: {
            slug: page.slugs,
          },
          hashes: await getHeadings(page),
        })),
      ),
    },
  });

  console.log(
    `collected ${scanned.urls.size} URLs, ${scanned.fallbackUrls.length} fallbacks`,
  );

  printErrors(
    await validateFiles([...(await getFiles(source))], {
      scanned,
      markdown: {
        components: {
          Card: { attributes: ["href"] },
        },
      },
      checkRelativePaths: "as-url",
    }),
    true,
  );
}

async function getHeadings({
  data,
}: InferPageType<AnySource>): Promise<string[]> {
  const { _exports, toc } = await data.load();
  const headings = toc.map((item) => item.url.slice(1));
  const elementIds = _exports.elementIds as string[] | undefined;
  if (elementIds) {
    headings.push(...elementIds);
  }

  return headings;
}

async function getFiles(docsSource: AnySource) {
  const files: FileObject[] = [];
  for (const page of docsSource.getPages()) {
    if ("type" in page.data && page.data.type === "openapi") {
      continue;
    }

    files.push({
      data: page.data,
      url: page.url,
      path: page.data.info.fullPath,
      content: await page.data.getText("raw"),
    });
  }

  return files;
}

await checkLinks();
