import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { remark } from "remark";
import remarkMdx from "remark-mdx";
import type { Heading, Root, RootContent } from "mdast";

import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

const SOURCE_PATH = path.join(repoRoot, "apps/style/CHANGELOG.md");
const DESTINATION_PATH = path.join(
  repoRoot,
  "apps/docs/content/docs/style/changelog.mdx",
);

const parser = remark();
const mdxStringifier = remark()
  .use(remarkMdx)
  .data("settings", { bullet: "-" });

export async function syncChangelog() {
  const raw = await readFile(SOURCE_PATH, "utf8");
  const updates = extractUpdates(raw);

  if (updates.length === 0) {
    throw new Error("No release entries found in CHANGELOG.md");
  }

  const doc = buildDoc(updates);
  const frontmatter = {
    title: "Changelog",
    description: "Latest updates to the Coolify Tweaks userstyle.",
    icon: "List",
  };
  const mdxBody = mdxStringifier.stringify(doc);
  const output = matter.stringify(mdxBody, frontmatter);

  await mkdir(path.dirname(DESTINATION_PATH), { recursive: true });
  await writeFile(DESTINATION_PATH, output, "utf8");

  console.log(
    `Synced ${updates.length} release entries to ${path.relative(
      repoRoot,
      DESTINATION_PATH,
    )}`,
  );
}

function buildDoc(updates: ReleaseEntry[]): Root {
  return {
    type: "root",
    children: [
      {
        type: "mdxJsxFlowElement",
        name: "Updates",
        attributes: [],
        children: updates.map(buildUpdateNode),
      } as unknown as RootContent,
    ],
  };
}

function buildUpdateNode(entry: ReleaseEntry): RootContent {
  return {
    type: "mdxJsxFlowElement",
    name: "Update",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "label",
        value: entry.version,
      },
    ],
    children: trimNodes(entry.nodes),
  } as unknown as RootContent;
}

type ReleaseEntry = { version: string; nodes: RootContent[] };

function extractUpdates(markdown: string): ReleaseEntry[] {
  const tree = parser.parse(markdown) as Root;
  const entries: ReleaseEntry[] = [];
  let current: ReleaseEntry | null = null;

  for (const node of tree.children) {
    if (isReleaseHeading(node)) {
      const version = headingText(node);
      if (!version) continue;

      if (current) {
        entries.push(current);
      }

      current = { version, nodes: [] };
      continue;
    }

    if (current) {
      current.nodes.push(node);
    }
  }

  if (current) {
    entries.push(current);
  }

  return entries;
}

function trimNodes(nodes: RootContent[]) {
  let start = 0;
  let end = nodes.length;

  while (start < end && isWhitespaceNode(nodes[start]!)) start += 1;
  while (end > start && isWhitespaceNode(nodes[end - 1]!)) end -= 1;

  return nodes.slice(start, end);
}

function isWhitespaceNode(node: RootContent) {
  if (node.type !== "paragraph") return false;
  return node.children.every(
    (child) =>
      child.type === "text" &&
      typeof child.value === "string" &&
      child.value.trim() === "",
  );
}

function isReleaseHeading(node: RootContent): node is Heading {
  return node.type === "heading" && node.depth === 2;
}

function headingText(node: Heading) {
  return node.children.map(nodeText).join("").trim();
}

function nodeText(node: RootContent): string {
  if ("value" in node && typeof node.value === "string") {
    return node.value;
  }

  if ("children" in node && Array.isArray(node.children)) {
    return (node.children as RootContent[]).map(nodeText).join("");
  }

  return "";
}

const entryFile = process.argv[1];
const isDirectExecution =
  entryFile && pathToFileURL(entryFile).href === import.meta.url;

if (isDirectExecution) {
  await syncChangelog().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
