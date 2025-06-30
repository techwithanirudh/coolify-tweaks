import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import wrapMozDocument from './plugins/postcss/wrap-moz-document';

export default {
  plugins: [
    postcssPresetEnv({
      stage: 3,
    }),
    autoprefixer(),
    wrapMozDocument(),
  ],
};
