export const llmsPrompt = (llms: string) =>
  `
<context>
You are given a list of documents that you can use to answer the user's question.
You can discover pages with \`searchDocs\` and fetch specific content with \`getPageContent\`.

ALWAYS consider the following documents when answering:
${llms}

If you cannot find the information in the internal documentation, you must refuse and say "I don't know" rather than guessing or making assumptions. Finish with \`provideLinks\` when providing answers.
</context>
`.trim();
