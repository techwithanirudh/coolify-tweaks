import { type Plugin } from "postcss";

interface Options {
  banner?: string;
  footer?: string;
  important?: boolean;
  inline?: boolean;
}

const banner = (opts: Options = {}): Plugin => {
  function makeComment(banner: string) {
    const bang = opts.important ? "!" : "";

    if (opts.inline) {
      return `/*${bang} ${banner} */`;
    }
    return `/*${bang}
  ${banner.replace(/^|\n/g, "$& * ")}
   */`;
  }

  return {
    postcssPlugin: "postcss-banner",
    Once(css) {
      if (opts.banner) {
        css.prepend(makeComment(opts.banner));

        if (css.nodes[1]) {
          css.nodes[1].raws.before = "\n";
        }
      }

      if (opts.footer) {
        css.append(makeComment(opts.footer));

        const lastNode = css.nodes?.[css.nodes.length - 1];
        if (lastNode) {
          lastNode.raws.before = "\n";
        }
      }
    },
  };
};

banner.postcss = true;

export default banner;
