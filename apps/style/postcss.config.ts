import root from "../../package.json";
import { version } from "./package.json";
import postcssBanner from "./plugins/postcss/banner";
import wrapMozDocument from "./plugins/postcss/wrap-moz-document";
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

const banner = `==UserStyle==
@name ${root.name}
@version ${version}
@namespace ${root.author.url}
@author ${root.author.name} <${root.author.email}> (${root.author.url})
@homepageURL ${root.homepage}
@updateURL https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.user.css
@description ${root.description}
@license ${root.license}
==/UserStyle==`;

export default {
  map: true,
  plugins: [
    postcssPresetEnv({
      stage: 3,
    }),
    autoprefixer(),
    wrapMozDocument({
      domains: [
        { type: "url-prefix", value: "https://app.coolify.io/" },
        { type: "url-prefix", value: "http://app.coolify.io/" },
        { type: "url-prefix", value: "https://coolify.local:8000/" },
        { type: "url-prefix", value: "http://coolify.local:8000/" },
      ],
    }),
    postcssBanner({
      banner,
      inline: true,
    }),
  ],
};
