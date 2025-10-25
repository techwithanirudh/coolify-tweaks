import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

import pkg from "../../package.json";
import postcssBanner from "./plugins/postcss/banner";
import wrapMozDocument from "./plugins/postcss/wrap-moz-document";

const banner = `==UserStyle==
@name ${pkg.name}
@version ${pkg.version}
@namespace ${pkg.author.url}
@author ${pkg.author.name} <${pkg.author.email}> (${pkg.author.url})
@homepageURL ${pkg.homepage}
@updateURL https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.user.css
@description ${pkg.description}
@license ${pkg.license}
==/UserStyle==`;

export default {
  map: true,
  plugins: [
    postcssPresetEnv({
      stage: 3,
    }),
    autoprefixer(),
    // Note: @import placement is handled by the Vite plugin, not PostCSS
    wrapMozDocument({
      domains: [
        { type: "regexp", value: "https?://app\\.coolify\\.io/.*" },
        { type: "regexp", value: "https?://coolify\\.local:8000/.*" },
      ],
    }),
    postcssBanner({
      banner,
      inline: true,
      important: true,
    }),
  ],
};
