import type { Plugin } from 'vite';

export function fixImportsInMozDocument(): Plugin {
  return {
    name: 'fix-imports-in-moz-document',
    generateBundle(_, bundle) {
      const cssFile = Object.keys(bundle).find(fileName => fileName.endsWith('.css'));
      if (!cssFile) return;

      const asset = bundle[cssFile];
      if (asset.type !== 'asset' || typeof asset.source !== 'string') return;

      let cssContent = asset.source;

      const importMatches = cssContent.match(/@import\s+[^;]+;/g) || [];
      if (importMatches.length === 0) return;

      const mozDocMatch = cssContent.match(/@-moz-document\s+[^{]+\{([\s\S]*?)\}\s*$/m);
      if (!mozDocMatch) return;

      importMatches.forEach(importRule => {
        cssContent = cssContent.replace(importRule, '');
      });

      const importRules = importMatches.join('\n');
      cssContent = cssContent.replace(
        /@-moz-document\s+[^{]+\{/,
        match => `${match}\n${importRules}`
      );

      cssContent = cssContent.replace(/\n\s*\n/g, '\n');

      asset.source = cssContent;
    },
  };
}
