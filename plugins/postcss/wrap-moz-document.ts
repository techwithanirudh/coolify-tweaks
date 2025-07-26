// WARNING: This plugin is vibe-coded
import postcss, { type Plugin } from 'postcss';

interface DomainConfig {
  type: 'url-prefix' | 'url' | 'regexp' | 'domain';
  value: string;
}

interface Options {
  domains?: (string | DomainConfig)[];
}

const wrapMozDocument = (options: Options = {}): Plugin => ({
  postcssPlugin: 'wrap-moz-document',
  prepare() {
    const domains = options.domains || [''];
    const params = domains
      .map(domain => {
        if (typeof domain === 'string') {
          return `url-prefix("${domain}")`;
        }
        return `${domain.type}("${domain.value}")`;
      })
      .join(', ');

    return {
      Once(root) {
        const wrapper = postcss.atRule({
          name: '-moz-document',
          params,
        });

        const charsetRules: postcss.Node[] = [];
        const nodesToMove: postcss.Node[] = [];

        root.each(node => {
          if (node.type === 'atrule' && node.name === 'charset') {
            charsetRules.push(node.clone());
          } else {
            nodesToMove.push(node.clone());
          }
        });

        root.removeAll();

        charsetRules.forEach(rule => root.append(rule));
        nodesToMove.forEach(node => wrapper.append(node));
        root.append(wrapper);
      },
    };
  },
});

wrapMozDocument.postcss = true;

export default wrapMozDocument;
