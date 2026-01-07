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
searchDocs(query: "Fumadocs themes and layouts", locale: "en", limit: 10)

### 2) getPageContent
Purpose: Fetch the content of a specific internal doc page.

IMPORTANT:
- Do not prefix the path with \`/docs\`; the path already starts from the root
- Correct: \`guides/using-custom-themes\`
- Wrong: \`docs/guides/using-custom-themes\`

Example:
getPageContent(path: "guides/using-custom-themes")
</tools>
`;
