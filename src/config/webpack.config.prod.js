/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved */

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
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
    libraryTarget: (userConfig.target === 'web') ? undefined : 'commonjs2',
  },
  externals: (userConfig.target === 'web')
    ? undefined
    : Object.assign(
      Object.keys(packageJson.dependencies || {}).reduce(
        (externals, dependency) => Object.assign(externals, { [dependency]: dependency }),
        {},
      ),
      Object.keys(packageJson.peerDependencies || {}).reduce(
        (externals, dependency) => Object.assign(externals, { [dependency]: dependency }),
        {},
      ),
    ),
  resolve: {
    // We include the Vue compiler along with the builder to allow for `template` syntax.
    alias: (userConfig.target === 'web') ? { vue: 'vue/dist/vue.runtime.min.js' } : {},
    // Allows importing files as modules (with absolute path).
    modules: [userConfig.srcPath, 'node_modules'],
  },
  plugins: [
    // Allows .vue files parsing.
    new VueLoaderPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(__dirname, '../../../report.html'),
    }),
  ],
  optimization: (userConfig.target === 'web' && userConfig.splitChunks === true)
    ? {
      // Splits code in several chunks to leverage on long-term vendor-caching.
      // To understand the following configuration, check
      // https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312.
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          default: false,
          defaultVendors: false,
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
      minimize: true,
      minimizer: [
        // Minifies CSS.
        '...',
        new CssMinimizerPlugin(),
      ],
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
    libraryTarget: contextSpecificConfig.output.libraryTarget,
  },
  resolve: {
    extensions: ['.json', '.js', '.ts', '.jsx', '.tsx', '.vue', '*'],
    alias: contextSpecificConfig.resolve.alias,
    modules: contextSpecificConfig.resolve.modules,
    fallback: {
      fs: false,
      crypto: false,
      buffer: false,
    },
  },
  stats: {
    colors: true,
    cached: true,
    modules: false,
    children: false,
    performance: true,
    errorDetails: true,
    excludeAssets: [/\.d\.ts$/i],
  },
  module: {
    rules: [
      // `babel-loader` is used to provide polyfills for latest ECMAScript syntax.
      {
        test: /\.jsx?$/,
        include: [userConfig.srcPath],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: false,
              // We don't use the `.babelrc` since it is already used to compile
              // development environment's scripts, with another configuration than this one.
              babelrc: false,
              presets: ['@babel/preset-env', '@babel/react'],
              plugins: ['@babel/plugin-syntax-dynamic-import'],
            },
          },
        ],
      },
      // `ts-loader` is used to transpile *.ts(x) Typescript files into Javascript.
      {
        test: /\.tsx?$/,
        include: [userConfig.srcPath],
        use: [
          {
            loader: 'ts-loader',
            options: {
              // This option allows to write TypeScript code inside *.vue files.
              appendTsSuffixTo: [/\.vue$/],
              configFile: path.resolve(__dirname, '../../../tsconfig.json'),
            },
          },
        ],
      },
      // `vue-loader` is used to compile *.vue components files.
      {
        test: /\.vue$/,
        include: [userConfig.srcPath],
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          hotReload: false, // Disable Hot Reloading.
          // Setting this option to `true` generates issues when developing components libraries.
          optimizeSSR: false,
        },
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
              postcssOptions: {
                plugins: [['postcss-sort-media-queries'], ['autoprefixer']],
                sourceMap: true,
              },
            },
          },
          // `sass-loader` converts SASS syntax into CSS.
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      // Audio and video files.
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'media/[name].[hash:7].[ext]',
        },
      },
      // Images files.
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'images/[name].[hash:7].[ext]',
        },
      },
      // Fonts files.
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  plugins: [
    // Lints the code.
    new ESLintPlugin({
      extensions: ['vue', 'js', 'jsx', 'ts', 'tsx'],
    }),
    // Extracts all the CSS into a specific file.
    new MiniCssExtractPlugin({ filename: 'styles/[name].[chunkhash].css' }),
    // Makes some environment variables available to the JS code.
    new webpack.DefinePlugin(Object.keys(userConfig.env.production).reduce((envVars, key) => (
      Object.assign(envVars, { [`process.env.${key}`]: userConfig.env.production[key] })
    ), {})),
    new TerserPlugin({
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
    emitOnErrors: false,
  }),
  // Prevents webpack from injecting mocks to Node native modules
  // that do not make sense for the client.
  node: false,
};

module.exports = productionConfig;
