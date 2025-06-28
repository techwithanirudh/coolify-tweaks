import { file } from 'bun';
import semver from 'semver';

type Part = 'major' | 'minor' | 'patch';
const PARTS = ['major', 'minor', 'patch'] as const;

function getPart(): Part {
  const [, , arg] = Bun.argv;
  return PARTS.includes(arg as Part) ? (arg as Part) : 'patch';
}

async function bumpFile(path: string, part: Part) {
  const json = (await file(path).json()) as { version: string };
  const oldV = json.version;
  const newV = semver.inc(oldV, part);
  if (!newV) {
    console.error(`❌ Invalid version "${oldV}" in ${path}`);
    process.exit(1);
  }
  json.version = newV;
  await Bun.write(path, JSON.stringify(json, null, 2) + '\n');
  console.log(`✅ ${path} bumped: ${oldV} → ${newV}`);
}

async function main() {
  const part = getPart();
  await bumpFile('package.json', part);
  await bumpFile('src/config.json', part);
}

await main();
