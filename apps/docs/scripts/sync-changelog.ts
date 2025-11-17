import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { BlockContent, Heading, Root, RootContent } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx";
import matter from "gray-matter";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import { is } from "unist-util-is";

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
      createMdxJsxFlowElement("Updates", [], updates.map(buildUpdateNode)),
    ],
  };
}

function buildUpdateNode(entry: ReleaseEntry): MdxJsxFlowElement {
  return createMdxJsxFlowElement(
    "Update",
    [{ name: "label", value: entry.version }],
    trimNodes(entry.nodes),
  );
}

function createMdxJsxFlowElement(
  name: string,
  attributes: { name: string; value: string | null }[],
  children: BlockContent[],
): MdxJsxFlowElement {
  return {
    type: "mdxJsxFlowElement",
    name,
    attributes: attributes.map(
      (attr): MdxJsxAttribute => ({
        type: "mdxJsxAttribute",
        name: attr.name,
        value: attr.value,
      }),
    ),
    children,
  };
}

interface ReleaseEntry {
  version: string;
  nodes: BlockContent[];
}

function extractUpdates(markdown: string): ReleaseEntry[] {
  const tree = parser.parse(markdown);
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

    if (current && isBlockContent(node)) {
      current.nodes.push(node);
    }
  }

  if (current) {
    entries.push(current);
  }

  return entries;
}

function trimNodes(nodes: RootContent[]): BlockContent[] {
  const blockNodes = nodes.filter(isBlockContent);
  let start = 0;
  let end = blockNodes.length;

  while (start < end) {
    const node = blockNodes[start];
    if (!node || !isWhitespaceNode(node)) break;
    start += 1;
  }
  while (end > start) {
    const node = blockNodes[end - 1];
    if (!node || !isWhitespaceNode(node)) break;
    end -= 1;
  }

  return blockNodes.slice(start, end);
}

function isWhitespaceNode(node: BlockContent) {
  if (node.type !== "paragraph") return false;
  return node.children.every(
    (child) =>
      child.type === "text" &&
      typeof child.value === "string" &&
      child.value.trim() === "",
  );
}

function isBlockContent(node: RootContent): node is BlockContent {
  return is(node, [
    "paragraph",
    "heading",
    "code",
    "blockquote",
    "list",
    "table",
    "thematicBreak",
    "html",
  ]);
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
