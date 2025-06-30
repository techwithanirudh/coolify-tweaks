import postcss, { type AtRule, type Plugin } from 'postcss';

const wrapMozDocument = (): Plugin => ({
  postcssPlugin: 'wrap-moz-document',
  Once(root) {
    const charsetRules: AtRule[] = [];
    root.walkAtRules('charset', rule => {
      charsetRules.push(rule.clone());
      rule.remove();
    });

    const wrapper = postcss.atRule({ name: '-moz-document', params: 'url-prefix("")' });

    root.nodes.forEach(node => wrapper.append(node));

    root.removeAll();
    charsetRules.forEach(rule => root.append(rule));
    root.append(wrapper);
  },
});

(wrapMozDocument as any).postcss = true;

export default wrapMozDocument;
