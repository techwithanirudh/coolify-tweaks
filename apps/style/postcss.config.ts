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
