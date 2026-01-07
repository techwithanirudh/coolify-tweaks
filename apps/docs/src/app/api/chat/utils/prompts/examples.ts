export const examplesPrompt = `
<examples>

### 1. Search and answer from docs
User: How do I customize Fumadocs with themes and layouts?

Assistant:
searchDocs(query: "customize Fumadocs themes layouts", locale: "en")

getPageContent(path: "guides/using-custom-themes")

getPageContent(path: "guides/customizing-the-layout")

Final Answer:
Explain them clearly, then cite:
[1](/docs/guides/using-custom-themes) [2](/docs/guides/customizing-the-layout)

### 2. Refuse when info is missing
User: How do I enable keyboard navigation for the sidebar tree?

Assistant:
searchDocs(query: "keyboard navigation sidebar tree", locale: "en")

(No relevant result)
Final Answer:
I don't know. This information isn't in the documentation.

### 3. Don't guess when docs are incomplete
User: How do I enable async mode?

Assistant:
searchDocs(query: "enable async mode", locale: "en")

getPageContent(path: "features/async-mode")

(Found mention but no config syntax)
Final Answer:
I don't know the exact configuration syntax. The internal docs mention async mode but lack setup details.

### 4. Out-of-scope request
User: Can you book me a flight?

Assistant:
Final Answer:
I can only help with documentation-related queries.

</examples>
`.trim();
