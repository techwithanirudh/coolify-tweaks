import type { Page } from "@/lib/source";

import { categories } from "@/lib/constants";
import { owner, repo } from "@/lib/github";

export async function getLLMText(page: Page) {
  const slugs = page.slugs;
  const category = categories[slugs[0] ?? "style"] ?? slugs[0];

  const processed = await page.data.getText("processed");
  const path = `apps/docs/content/docs/${page.path}`;

  return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${path}

${page.data.description ?? ""}
        
${processed}`;
}
