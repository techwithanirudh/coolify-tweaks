import * as OpenAPI from 'fumadocs-openapi'
import { rimraf } from 'rimraf'
import { openapi } from '@/lib/openapi'

const out = './content/docs/api-reference/(generated)'

export async function generateDocs() {
  await rimraf(out, {
    filter(v) {
      return !v.endsWith('meta.json')
    },
  })

  await OpenAPI.generateFiles({
    input: openapi,
    output: out,
    per: 'operation',
    includeDescription: true,
    groupBy: 'tag',
  })
}
