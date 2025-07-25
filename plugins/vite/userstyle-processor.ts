import type { Plugin } from 'vite';

interface DomainConfig {
  type: 'url-prefix' | 'url' | 'regexp' | 'domain';
  value: string;
}

interface UserstyleProcessorOptions {
  domains?: (string | DomainConfig)[];
}

export default function userstyleProcessor(options: UserstyleProcessorOptions = {}): Plugin {
  return {
    name: 'userstyle-processor',
    generateBundle(_, bundle) {
      const cssFile = Object.keys(bundle).find(fileName => fileName.endsWith('.user.css'));
      if (!cssFile) return;

      const asset = bundle[cssFile];
      if (asset.type !== 'asset' || typeof asset.source !== 'string') return;

      let css = asset.source;
      const parts = extractCssParts(css);
      const wrappedContent = wrapWithMozDocument(parts.mainContent, options.domains);
      const finalCss = reconstructCss(parts, wrappedContent);
      asset.source = finalCss;
      console.log('✅ Processed userstyle: wrapped with @-moz-document and fixed imports');
    },
  };
}

interface CssParts {
  userStyleHeader: string;
  charset: string;
  imports: string[];
  mainContent: string;
}

function extractCssParts(css: string): CssParts {
  const parts: CssParts = {
    userStyleHeader: '',
    charset: '',
    imports: [],
    mainContent: '',
  };

  const userStyleMatch = css.match(/(\/\*\s*==UserStyle==[\s\S]*?==\/UserStyle==\s*\*\/)/);
  if (userStyleMatch) {
    parts.userStyleHeader = userStyleMatch[1];
    css = css.replace(userStyleMatch[1], '').trim();
  }

  const charsetMatch = css.match(/(@charset[^;]+;)/);
  if (charsetMatch) {
    parts.charset = charsetMatch[1];
    css = css.replace(charsetMatch[1], '').trim();
  }

  const importMatches = css.match(/@import[^;]+;/g);
  if (importMatches) {
    parts.imports = importMatches;
    importMatches.forEach(importStmt => {
      css = css.replace(importStmt, '');
    });
  }

  const mozDocMatch = css.match(/@-moz-document[^{]+\{([\s\S]*)\}$/);
  if (mozDocMatch) {
    parts.mainContent = mozDocMatch[1].trim();
  } else {
    parts.mainContent = css.trim();
  }

  return parts;
}

function wrapWithMozDocument(content: string, domains: (string | DomainConfig)[] = ['']): string {
  if (!content.trim()) return content;

  const params = domains
    .map(domain => {
      if (typeof domain === 'string') {
        return domain ? `url-prefix("${domain}")` : 'url-prefix("")';
      }
      return `${domain.type}("${domain.value}")`;
    })
    .join(', ');

  return `@-moz-document ${params} {\n${content}\n}`;
}

function reconstructCss(parts: CssParts, wrappedContent: string): string {
  const sections: string[] = [];

  if (parts.userStyleHeader) {
    sections.push(parts.userStyleHeader);
  }

  if (parts.charset) {
    sections.push(parts.charset);
  }

  if (wrappedContent.trim()) {
    sections.push(wrappedContent);
  }

  if (parts.imports.length > 0) {
    const lastSection = sections[sections.length - 1];
    if (lastSection && lastSection.includes('@-moz-document')) {
      const openBraceIndex = lastSection.indexOf('{');
      if (openBraceIndex !== -1) {
        const beforeBrace = lastSection.substring(0, openBraceIndex + 1);
        const afterBrace = lastSection.substring(openBraceIndex + 1);
        const importsStr = parts.imports.join('\n');
        sections[sections.length - 1] = `${beforeBrace}\n${importsStr}${afterBrace}`;
      }
    }
  }

  return sections.join('\n\n');
}
