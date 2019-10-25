/**
 * Copyright (c) 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved */

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const validateConfig = require('./validateConfig');
const packageJson = require('../../../package.json');
const ClearTerminalPlugin = require('./ClearTerminalPlugin');

const userConfig = packageJson.tsDevKitConfig;
userConfig.srcPath = path.resolve(__dirname, '../../../', userConfig.srcPath);
userConfig.distPath = path.resolve(__dirname, '../../../', userConfig.distPath);

try {
  validateConfig(userConfig);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit();
}

// Contains all the context-specific (front-end / back-end) config for production.
const contextSpecificConfig = {
  target: userConfig.target,
  output: {
    path: (userConfig.target === 'web') ? `${userConfig.distPath}/assets` : userConfig.distPath,
    filename: (userConfig.target === 'web') ? 'scripts/[name].[chunkhash].js' : '[name].js',
    library: (userConfig.target === 'web') ? undefined : packageJson.name,
    libraryTarget: (userConfig.target === 'web') ? undefined : 'commonjs2',
  },
  externals: (userConfig.target === 'web')
    ? undefined
    : Object.keys(packageJson.dependencies).reduce(
      (externals, dependency) => Object.assign(externals, { [dependency]: dependency }),
      {},
    ),
  resolve: {
    alias: {},
    // Allows importing files as modules (with absolute path).
    modules: [userConfig.srcPath, 'node_modules'],
  },
  plugins: [],
  optimization: (userConfig.target === 'web')
    ? {
      // Splits code in several chunks to leverage on long-term vendor-caching.
      // To understand the following configuration, check
      // https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312.
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          // All common sync chunks will be grouped inside the `common.js`file.
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'initial',
            priority: 40,
            reuseExistingChunk: true,
            enforce: true,
          },
          // All vendor sync chunks will be grouped inside the `vendor.js` file.
          vendor: {
            name: 'vendor',
            chunks: 'initial',
            test: /node_modules/,
            priority: 30,
          },
          // All common async chunks will be grouped inside the `common-async.js` file.
          commonAsync: {
            name: 'common-async',
            minChunks: 2,
            chunks: 'async',
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
          },
          // All vendor async chunks will be grouped inside the `vendor-async.js` file.
          vendorAsync: {
            name: 'vendor-async',
            chunks: 'async',
            test: /node_modules/,
            priority: 10,
          },
        },
      },
    }
    : {},
  node: (userConfig.target === 'web')
    ? {
      // Prevents webpack from injecting mocks to Node native modules
      // that does not make sense for the client.
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    }
    : {},
};

// webpack's production configuration.
const productionConfig = {
  target: contextSpecificConfig.target,
  bail: true,
  cache: false,
  mode: 'production',
  context: userConfig.srcPath,
  devtool: 'source-map',
  performance: {
    hints: 'warning',
  },
  entry: userConfig.entry,
  externals: contextSpecificConfig.externals,
  output: {
    filename: contextSpecificConfig.output.filename,
    path: contextSpecificConfig.output.path,
    publicPath: (userConfig.target === 'web') ? '/assets/' : undefined,
    library: contextSpecificConfig.output.library,
    libraryTarget: contextSpecificConfig.output.libraryTarget,
  },
  resolve: {
    extensions: ['.json', '.ts', '.tsx', '.js', 'jsx', '*'],
    alias: contextSpecificConfig.resolve.alias,
    modules: contextSpecificConfig.resolve.modules,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        include: [userConfig.srcPath],
        use: [
          // `awesome-typescript-loader` is then used, to compile Typescript into Javascript.
          {
            loader: 'awesome-typescript-loader',
            options: {
              useCache: false,
              configFileName: path.resolve(__dirname, '../../../tsconfig.json'),
            },
          },
          // `eslint-loader` is used first, to lint the code.
          {
            loader: 'eslint-loader',
            options: { cache: false },
          },
        ],
      },
      // Stylesheets.
      {
        test: /\.s?css$/,
        use: [
          // `mini-css-extract-plugin` extracts CSS into a separate file.
          { loader: MiniCssExtractPlugin.loader },
          // `css-loader` resolves paths in CSS and adds assets as dependencies.
          { loader: 'css-loader', options: { sourceMap: true } },
          // `postcss-loader` is used to autoprefix CSS to ensure compatibility with all browsers.
          {
            loader: 'postcss-loader',
            options: {
              config: { path: path.resolve(__dirname, 'postcss.config.js') },
              sourceMap: true,
            },
          },
          // `sass-loader` converts SASS syntax into CSS.
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      // Audio and video files.
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          name: 'media/[name].[hash:7].[ext]',
        },
      },
      // Images files.
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          name: 'images/[name].[hash:7].[ext]',
        },
      },
      // Fonts files.
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          name: 'fonts/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  plugins: [
    // Extracts all the CSS into a specific file.
    new MiniCssExtractPlugin({ filename: 'styles/[name].[chunkhash].css' }),
    // Minifies CSS.
    new OptimizeCSSAssetsPlugin({}),
    // Makes some environment variables available to the JS code.
    new webpack.DefinePlugin(Object.keys(userConfig.env.production).reduce((envVars, key) => (
      Object.assign(envVars, { [`process.env.${key}`]: userConfig.env.production[key] })
    ), {})),
    new TerserPlugin({
      sourceMap: true,
      terserOptions: {
        ecma: 6,
        mangle: true,
      },
    }),
    // Includes copyright comment on top of each generated file.
    new webpack.BannerPlugin({
      banner: userConfig.banner,
      raw: true,
    }),
    // Clears terminal between each compilation.
    new ClearTerminalPlugin(),
  ].concat(contextSpecificConfig.plugins),
  optimization: Object.assign(contextSpecificConfig.optimization, {
    noEmitOnErrors: true,
  }),
  node: contextSpecificConfig.node,
};

module.exports = productionConfig;
