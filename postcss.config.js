/* eslint-disable global-require,import/no-extraneous-dependencies,no-unused-vars,no-console */

const environment = (process.env.NODE_ENV || 'production').trim();
const production = environment === 'production';
const debug = !production;

module.exports = {
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('precss')({}),
    require('autoprefixer')({ browsers: ['> 5% in US'] }),
    require('postcss-color-function')({}),
    production && require('postcss-ordered-values')(),
    production && require('postcss-discard-comments')({}),
    production && require('postcss-colormin')({ legacy: true }),
    production && require('postcss-merge-rules')(),
    production && require('postcss-minify-gradients')(),
    production && require('postcss-minify-selectors')(),
    production && require('postcss-reduce-transforms')(),
    production && require('postcss-reduce-idents')(),
    production && require('postcss-convert-values')(),
  ].filter(p => p),
};
