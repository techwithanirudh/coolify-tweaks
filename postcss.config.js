const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      features: {
        'color-mix-function': true
      }
    }),
    autoprefixer()
  ]
};