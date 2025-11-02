import { generateDocs } from './generate-docs.js'

async function main() {
  // comment the below to disable openapi generation
  await Promise.all([generateDocs()])
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e)
  process.exit(1)
})
