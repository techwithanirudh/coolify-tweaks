import { file } from 'bun';

type SemVerPart = 'major' | 'minor' | 'patch';

interface JsonWithVersion {
  version: string;
  [k: string]: any;
}

async function bumpPart(version: string, part: SemVerPart): Promise<string> {
  const parts = version.split('.').map(Number);
  const [maj = 0, min = 0, pat = 0] = parts;
  switch (part) {
    case 'major':
      return `${maj + 1}.0.0`;
    case 'minor':
      return `${maj}.${min + 1}.0`;
    case 'patch':
    default:
      return `${maj}.${min}.${pat + 1}`;
  }
}

async function bumpFile(path: string, part: SemVerPart): Promise<string> {
  const json = (await file(path).json()) as JsonWithVersion;
  const oldV = json.version;
  const newV = await bumpPart(oldV, part);
  json.version = newV;
  await Bun.write(path, JSON.stringify(json, null, 2) + '\n');
  console.log(`✅ ${path} bumped: ${oldV} → ${newV}`);
  return newV;
}

async function main() {
  const part = (process.argv[2] as SemVerPart) || 'patch';
  await bumpFile('package.json', part);
  await bumpFile('src/config.json', part);
}

await main();
