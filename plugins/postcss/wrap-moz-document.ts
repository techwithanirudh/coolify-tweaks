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
  Once(root) {
    const domains = options.domains || [''];

    const charsetRules = root.nodes.filter(
      node => node.type === 'atrule' && node.name === 'charset'
    );

    const otherNodes = root.nodes.filter(
      node => !(node.type === 'atrule' && node.name === 'charset')
    );

    const params = domains
      .map(domain => {
        if (typeof domain === 'string') {
          return `url-prefix("${domain}")`;
        }
        return `${domain.type}("${domain.value}")`;
      })
      .join(', ');

    const wrapper = postcss.atRule({
      name: '-moz-document',
      params,
    });

    otherNodes.forEach(node => wrapper.append(node.clone()));

    root.removeAll();
    charsetRules.forEach(rule => root.append(rule));
    root.append(wrapper);
  },
});

wrapMozDocument.postcss = true;

export default wrapMozDocument;
