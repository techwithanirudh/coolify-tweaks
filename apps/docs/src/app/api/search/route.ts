import { createSearchAPI } from 'fumadocs-core/search/server'
import { source } from '@/lib/source'

export const { GET } = createSearchAPI('advanced', {
  language: 'english',
  indexes: async () => {
    const pages = source.getPages()

    const indexes = await Promise.all(
      pages.map(async (page) => {
        const { structuredData } = await page.data.load()

        return {
          title: page.data.title,
          description: page.data.description,
          url: page.url,
          id: page.url,
          structuredData: structuredData ?? undefined,
          tag: page.path.split('/')[0],
        }
      })
    )

    return indexes
  },
})