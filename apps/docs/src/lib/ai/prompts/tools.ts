export const toolsPrompt = `
<tools>
You have access to these tools. Use them exactly as shown below.

### 1) searchDocs
Purpose: Search the internal documentation using the search server.

Usage:
- Use this first to find relevant pages, then fetch them using \`getPageContent\`

Inputs:
- query: the search phrase (required)
- tag: section filter (optional, e.g. "all", "(index)", "api-reference", "changelog")
- locale: language filter (optional)
- limit: maximum number of results to return (optional, default: 10, max: 50)

Example:
\`\`\`tool
searchDocs(query: "Fumadocs themes and layouts", locale: "en", limit: 10)
\`\`\`

### 2) getPageContent
Purpose: Fetch the content of a specific internal doc page.

IMPORTANT:
- Do not prefix the path with \`/docs\`; the path already starts from the root
- Correct: \`guides/using-custom-themes\`
- Wrong: \`docs/guides/using-custom-themes\`

Example:
\`\`\`tool
getPageContent(path: "guides/using-custom-themes")
\`\`\`

### 3) provideLinks
Purpose: Return the exact URLs or internal paths cited in your answer.

CRITICAL:
- Always call this when citing internal pages
- You must provide links to back up every claim you make
- Never state information without providing a source
- Note: This is separate from inline text references - use this tool to provide the source links

Inputs:
- links: array of link objects, each with:
  - url: the full URL or path (required). Use simple paths like \`guides/xyz\` or \`changelog\` for internal docs (without /docs prefix), or full URLs like \`https://example.com\` for external sources
  - title: optional display title
  - label: optional footnote label (e.g., "1", "2")
  - type: optional type (e.g., "documentation")

Example:
\`\`\`tool
provideLinks(links: [
  { url: "guides/using-custom-themes", title: "Using Custom Themes", type: "documentation" },
  { url: "guides/customizing-the-layout", title: "Customizing the Layout", type: "documentation" }
])
\`\`\`
</tools>
`.trim();
