const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      // Removed explicit color-mix-function feature as it should be handled by browserslist
    }),
    autoprefixer()
  ]
};