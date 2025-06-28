import { file } from 'bun';
import { config } from '../src/config.ts';

async function generate(): Promise<void> {
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
    const css = await file('dist/main.css').text();
    const content = css.replace(/@charset\s+["'][^"']*["'];\s*/g, '').trim();

    const finalCss = `\
    ${header}

    ${document} {
      ${content}
    }
    `;

    await Bun.write('dist/main.css', finalCss);
    console.log(`✅ Generated UserStyle v${config.version} successfully!`);
  } catch (error) {
    console.error('❌ Error generating UserStyle:', error);
    process.exit(1);
  }
}

await generate();
