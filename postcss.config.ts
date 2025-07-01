import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import wrapMozDocument from './plugins/postcss/wrap-moz-document';

export default {
  plugins: [
    postcssPresetEnv({
      stage: 3,
    }),
    autoprefixer(),
    wrapMozDocument({
      domains: [
        { type: 'regexp', value: 'https?://app\\.coolify\\.io/.*' },
        { type: 'regexp', value: 'https?://coolify\\.local:8000/.*' },
      ],
    }),
  ],
};
