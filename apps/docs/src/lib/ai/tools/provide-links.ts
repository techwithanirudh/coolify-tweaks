import { tool } from 'ai'
import { ProvideLinksToolSchema } from '../qa-schema'

export const provideLinks = tool({
  description:
    'Provide links to articles found using the Web Search tool. This is compulsory and MUST be called after a web search, as it gives the user context on which URLs were used to generate the response.',
  inputSchema: ProvideLinksToolSchema,
  execute: async ({ links }) => ({
    links,
  }),
})
