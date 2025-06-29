import { file } from 'bun';
import * as config from '@/config.json';

export interface UserStyleOptions {
  inputFile?: string;
  outputFile?: string;
  exitOnError?: boolean;
}

/**
 * Generates a UserStyle CSS file with metadata header and @-moz-document wrapper
 */
export async function generateUserStyle(options: UserStyleOptions = {}): Promise<boolean> {
  const {
    inputFile = 'dist/main.css',
    outputFile = 'dist/main.css',
    exitOnError = false,
  } = options;

  const header = `/* ==UserStyle==
@name ${config.name}
@version ${config.version}
@namespace ${config.namespace}
@updateURL ${config.updateURL}
@description ${config.description}
@license ${config.license}
==/UserStyle== */`;

  const urlPrefixes = config.domains.exact.map(domain => `url-prefix("${domain}")`);
  const regexps = config.domains.regex.map(pattern => `regexp("${pattern}")`);
  const allTargets = [...urlPrefixes, ...regexps];

  const document = `@-moz-document ${allTargets.join(',\n               ')}`;

  try {
    const cssFile = file(inputFile);
    if (!(await cssFile.exists())) {
      console.log(`⏳ Waiting for ${inputFile} to be generated...`);
      return false;
    }

    const css = await cssFile.text();
    const content = css.replace(/@charset\s+["'][^"']*["'];\s*/g, '').trim();

    const indentContent = (str: string, spaces = 2) =>
      str
        .split('\n')
        .map(line => (line.trim() ? ' '.repeat(spaces) + line : line))
        .join('\n');

    const finalCss = `${header}

${document}
{
${indentContent(content)}
}
`;

    await Bun.write(outputFile, finalCss);

    const mode = inputFile === outputFile ? 'production' : 'development';
    console.log(`✅ Generated UserStyle v${config.version} for ${mode}!`);
    return true;
  } catch (error) {
    console.error('❌ Error generating UserStyle:', error);
    if (exitOnError) {
      process.exit(1);
    }
    return false;
  }
}
