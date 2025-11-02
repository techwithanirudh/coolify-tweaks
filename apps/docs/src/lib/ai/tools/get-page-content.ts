import { tool } from 'ai'
import { z } from 'zod'
import { source } from '@/lib/source'

export const getPageContent = tool({
  description: 'Get the list of pages in the documentation.',
  inputSchema: z.object({
    path: z.string().describe('The path of the page to get the content of.'),
  }),
  execute: async ({ path }) => {
    const slugs = path.split('/')
    const page = source.getPage(slugs)

    if (!page) {
      return {
        success: false,
        data: 'Page not found',
      }
    }

    return {
      success: true,
      data: await page.data.getText('processed'),
    }
  },
})
