import type { Plugin } from 'vite';
import postcss, { Root, AtRule } from 'postcss';
import prettier from 'prettier';

export function organizeImports(): Plugin {
  return {
    name: 'organize-imports',
    async generateBundle(_, bundle) {
      const key = Object.keys(bundle).find(n => n.endsWith('.css'));
      if (!key) return;
      const asset = bundle[key];
      if (asset.type !== 'asset' || typeof asset.source !== 'string') return;

      const root = postcss.parse(asset.source) as Root;
      const imports: AtRule[] = [];

      root.walkAtRules('import', at => {
        imports.push(at.clone());
        at.remove();
      });
      if (!imports.length) return;

      const mozDoc = root.nodes.find(
        n => n.type === 'atrule' && (n as AtRule).name === '-moz-document'
      ) as AtRule | undefined;
      if (!mozDoc) return;

      imports.reverse().forEach(imp => mozDoc.prepend(imp));

      const rawCss = root.toString();
      const formattedCss = await prettier.format(rawCss, { parser: 'css' });

      asset.source = formattedCss;
    },
  };
}
