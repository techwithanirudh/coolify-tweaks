import { generateDocs } from "./generate-docs.js";
import { syncChangelog } from "./sync-changelog.js";

async function main() {
  // comment the below to disable openapi generation
  await Promise.all([generateDocs(), syncChangelog()]);
}

await main().catch((e) => {
  console.error("Failed to run pre build script", e);
  process.exit(1);
});
