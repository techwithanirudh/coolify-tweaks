import type { Plugin } from 'vite';

/**
 * Vite plugin to move @import rules inside @-moz-document wrapper
 */
export function fixImportsInMozDocument(): Plugin {
  return {
    name: 'fix-imports-in-moz-document',
    generateBundle(_, bundle) {
      // Find the CSS file in the bundle
      const cssFile = Object.keys(bundle).find(fileName => fileName.endsWith('.css'));
      if (!cssFile) return;

      const asset = bundle[cssFile];
      if (asset.type !== 'asset' || typeof asset.source !== 'string') return;

      let cssContent = asset.source;

      // Find @import rules that are outside @-moz-document
      const importMatches = cssContent.match(/@import\s+[^;]+;/g) || [];
      if (importMatches.length === 0) return;

      // Find @-moz-document block
      const mozDocMatch = cssContent.match(/@-moz-document\s+[^{]+\{([\s\S]*?)\}\s*$/m);
      if (!mozDocMatch) return;

      // Remove @import rules from outside the @-moz-document
      importMatches.forEach(importRule => {
        cssContent = cssContent.replace(importRule, '');
      });

      // Insert @import rules at the beginning of @-moz-document block
      const importRules = importMatches.join('\n');
      cssContent = cssContent.replace(
        /@-moz-document\s+[^{]+\{/,
        match => `${match}\n${importRules}`
      );

      // Clean up extra whitespace
      cssContent = cssContent.replace(/\n\s*\n/g, '\n');

      // Update the asset source
      asset.source = cssContent;
    },
  };
}
