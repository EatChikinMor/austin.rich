/* eslint-disable no-console,max-len,indent,object-property-newline */

const project = 'MVBoilerPlate';
const environment = (process.env.NODE_ENV || 'production').trim();
const production = environment === 'production';
const debug = !production;

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
// const SentryPlugin = require('webpack-sentry-plugin');
const childProcess = require('child_process');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');
const glob = require('glob');

const versionString = childProcess.execSync(`git describe --always${!production ? ' --dirty=+' : ''}`).toString().trim();
const gitRev = childProcess.execSync('git rev-parse HEAD').toString().trim();

if ((process.env.NODE_ENV || '').trim() === '') {
  const os = require("os"); // eslint-disable-line
  const isDevServer = process.argv.some(arg => arg.includes('webpack-dev-server'));

  // Don't delete any of the trailing spaces in the strings here. They're for making the box pretty.
  console.warn('\x1b[37;44;1m');
  console.warn('                                                                     ');
  console.warn(' No environment specified (NODE_ENV environment variable was empty). ');
  console.warn(' Defaulting to production!                                           ');
  console.warn(" \x1b[41mIf you don't want this, hit Ctrl+C now\x1b[44m, and run:                    ");
  switch (os.platform()) {
    case 'win32':
      if (!isDevServer) {
        console.warn('    \x1b[0m > set NODE_ENV=environment_name & webpack \x1b[37;44;1m                      ');
      } else {
        console.warn('    \x1b[0m > set NODE_ENV=environment_name & webpack-dev-server \x1b[37;44;1m           ');
      }
      break;
    default:
      if (!isDevServer) {
        console.warn('    \x1b[0m $ NODE_ENV=environment_name webpack \x1b[37;44;1m                            ');
      } else {
        console.warn('    \x1b[0m $ NODE_ENV=environment_name webpack-dev-server \x1b[37;44;1m                 ');
      }
      break;
  }
  console.warn('                                                                     ');
  console.warn('\x1b[0m');
}
console.warn(`********* ENVIRONMENT: ${environment.trim()}, DEBUG: ${debug} *********`);
if (production) {
  console.warn();
  console.warn('\x1b[1m Production build with full uglification and compression...  this will take a minute!\x1b[0m');
}
console.warn();

const devPlugins = debug
  ? [
    // new ExtractTextPlugin({filename: 'shared-component-styles/[name].[contenthash:8].css', allChunks: true}),
    new HtmlWebpackPlugin({ template: '!!ejs-loader!./src/index.html', inject: 'body', chunksSortMode: 'dependency' }),
    new DuplicatePackageCheckerPlugin(),
  ]
  : [];

const prodPlugins = production
  ? [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|es|fr/),
    new UglifyJsPlugin({sourceMap: true}),
    new ExtractTextPlugin({ filename: '[name].[contenthash:20].css', allChunks: true }),
    new HtmlWebpackPlugin({
      template: '!!ejs-loader!./src/index.html',
      inject: 'body',
      minify: { html5: true, useShortDoctype: true, collapseWhitespace: true, collapseInlineTagWhitespace: true },
      hash: false,
      chunksSortMode: 'dependency',
    }),
    // new SentryPlugin({npm
    //   apiKey: 'f317405e93fe492fa5c6ea94b18833194b588a9d01b545a299f8c1456b993c8e',
    //   organisation: 'mealviewer',
    //   project: project,
    //   release: gitRev,
    //   exclude: /\.(html|(jpe?|sv|pn)g|gif|woff2?|[ot]tf)$/,
    // }),
    new CopyWebpackPlugin([
      {
        from: 'src/Web.config',
      },
    ]),
  ]
  : [];

const alwaysPlugins = [
  //  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(environment) },
    __VERSION: JSON.stringify(versionString),
    __COMMITHASH: JSON.stringify(gitRev),
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'app',
    children: true,
    async: true,
  }),
  new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.includes('node_modules'),
}),
new webpack.optimize.CommonsChunkPlugin({ name: 'manifest' }),
  new WebpackCleanupPlugin({ quiet: production }),
];

const plugins = (debug ? devPlugins : prodPlugins).concat(alwaysPlugins);

module.exports = {
  bail: true,
  context: __dirname,
  devtool: production ? 'hidden-source-map' : 'source-map',
  entry: {
    app: ['babel-polyfill', './src/scripts.js', './src/components/Application.js'],
    // assets: glob.sync('./src/assets/**/*.js') // re-enable this if you have an assets folder
  },
  devServer: {
    contentBase: ['./src'],
    historyApiFallback: true,
    hot: false,
    overlay: { warnings: false, errors: true },
    host: '0.0.0.0',
    disableHostCheck: true,
    watchOptions: { poll: 1000 }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { babelrc: true, cacheDirectory: true },
      },
      {
        test: /\.css$/,
        loader: debug
          ? ['style-loader', { loader: 'css-loader', options: { modules: false, importLoaders: 0 } }]
          : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{ loader: 'css-loader', options: { modules: false, importLoaders: 1, minimize: production, allChunks: production } }],
          }),
      },
      {
        test: /\.pcss$/,
        loader: debug
          ? ['style-loader', { loader: 'css-loader', options: { modules: true, importLoaders: 1, localIdentName: '[name]--[hash:base64:5]' } }, 'postcss-loader']
          : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{ loader: 'css-loader', options: { modules: true, importLoaders: 1, minimize: production, allChunks: production, localIdentName: production ? '[hash:base64:7]' : '[name]--[hash:base64:5]' } }, 'postcss-loader'],
          }),
      },
      {
        test: /\.((jpe?|pn|sv)g|gif|woff2?|[to]tf|wav|mp3)$/,
        use: [{ loader: 'file-loader', options: { name: '[sha256:hash:hex:20].[ext]' } }],
      },
    ],
  },

  output: {
    path: path.join(__dirname, '/build'),
    publicPath: '/',
    hashFunction: 'sha256',
    filename: debug ? '[name].js' : '[name].[hash].js',
    chunkFilename: debug ? '[name].js' : '[name].[hash].js',
    sourceMapFilename: '[file].map',
  },

  plugins,
};
