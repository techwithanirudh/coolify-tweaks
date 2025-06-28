import { file } from 'bun';

interface PackageJson {
  version: string;
  [key: string]: any;
}

async function bumpVersion(versionType: 'major' | 'minor' | 'patch' = 'patch'): Promise<string> {
  try {
    const packageJson: PackageJson = await file('package.json').json();
    const currentVersion = packageJson.version;

    const [major, minor, patch] = currentVersion.split('.').map(Number);

    let newVersion: string;
    switch (versionType) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }

    packageJson.version = newVersion;
    await Bun.write('package.json', JSON.stringify(packageJson, null, 2) + '\n');

    const configContent = await file('src/config.ts').text();
    const updatedConfig = configContent.replace(/version:\s*"[^"]*"/, `version: "${newVersion}"`);
    await Bun.write('src/config.ts', updatedConfig);

    console.log(`✅ Version bumped from ${currentVersion} to ${newVersion}`);
    return newVersion;
  } catch (error) {
    console.error('❌ Error bumping version:', error);
    process.exit(1);
  }
}

const versionType = (process.argv[2] as 'major' | 'minor' | 'patch') || 'patch';
await bumpVersion(versionType);
