import autoprefixer from 'autoprefixer';
import wrapMozDocument from './plugins/postcss/wrap-moz-document';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    postcssPresetEnv({
      stage: 3,
    }),
    autoprefixer(),
    // Note: @import placement is handled by the Vite plugin, not PostCSS
    wrapMozDocument({
      domains: [
        { type: 'regexp', value: 'https?://app\\.coolify\\.io/.*' },
        { type: 'regexp', value: 'https?://coolify\\.local:8000/.*' },
      ],
    }),
  ],
};
