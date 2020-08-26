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
const VueLoaderPlugin = require('vue-loader/lib/plugin');
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

// Contains all the context-specific (front-end / back-end) config for development.
const contextSpecificConfig = {
  target: userConfig.target,
  entry: (userConfig.target === 'web')
    ? Object.keys(userConfig.entry).reduce((entries, entry) => {
      // eslint-disable-next-line no-param-reassign
      entries[entry] = [
        userConfig.entry[entry],
        // This entry is required to correctly enable HMR.
        'webpack-hot-middleware/client?dynamicPublicPath=true&timeout=4000&reload=true&path=_hmr',
      ];
      return entries;
    }, {})
    : userConfig.entry,
  externals: (userConfig.target === 'web')
    ? undefined
    : Object.keys(packageJson.dependencies).reduce(
      (externals, dependency) => Object.assign(externals, { [dependency]: dependency }),
      {},
    ),
  output: {
    path: (userConfig.target === 'web') ? `${userConfig.distPath}/assets` : userConfig.distPath,
    filename: (userConfig.target === 'web') ? 'scripts/[name].js' : '[name].js',
    library: (userConfig.target === 'web') ? undefined : packageJson.name,
    libraryTarget: (userConfig.target === 'web') ? undefined : 'commonjs2',
  },
  resolve: {
    // We include the Vue compiler along with the builder to allow for `template` syntax.
    alias: (userConfig.target === 'web') ? { vue: 'vue/dist/vue.runtime.js' } : {},
    // Allows importing files as modules (with absolute path).
    modules: [userConfig.srcPath, 'node_modules'],
  },
  plugins: (userConfig.target === 'web')
    ? [
      // Enables HMR with webpack-dev-middleware.
      new webpack.HotModuleReplacementPlugin(),
      // Allows .vue files parsing.
      new VueLoaderPlugin(),
    ]
    : [],
  optimization: (userConfig.target === 'web' && userConfig.splitChunks === true)
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
      // Prevents webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // Prevents webpack from injecting mocks to Node native modules
      // that does not make sense for the client.
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    }
    : {},
  devServer: (userConfig.target === 'web') ? userConfig.devServer : undefined,
};

// webpack's development configuration.
const developmentConfig = {
  target: contextSpecificConfig.target,
  bail: false,
  cache: true,
  mode: 'development',
  context: userConfig.srcPath,
  devtool: 'cheap-module-source-map',
  entry: contextSpecificConfig.entry,
  externals: contextSpecificConfig.externals,
  output: {
    filename: contextSpecificConfig.output.filename,
    publicPath: (userConfig.target === 'web') ? '/assets/' : undefined,
    path: contextSpecificConfig.output.path,
    pathinfo: true,
    library: contextSpecificConfig.output.library,
    libraryTarget: contextSpecificConfig.output.libraryTarget,
  },
  resolve: {
    extensions: ['.json', '.js', '.ts', '.jsx', '.tsx', '.vue', '*'],
    alias: contextSpecificConfig.resolve.alias,
    modules: contextSpecificConfig.resolve.modules,
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
              cacheDirectory: true,
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
          // We disable CSS extraction in dev mode to enable CSS HMR.
          extractCSS: false,
          loaders: {
            css: [
              // `vue-style-loader` turns CSS into JS modules.
              'vue-style-loader',
              // `css-loader` resolves paths in CSS and adds assets as dependencies.
              { loader: 'css-loader', options: { sourceMap: true } },
              // `postcss-loader` is used to autoprefix CSS to ensure compatibility with browsers.
              {
                loader: 'postcss-loader',
                options: {
                  config: { path: path.resolve(__dirname, 'postcss.config.js') },
                  sourceMap: true,
                },
              },
            ],
          },
        },
      },
      {
        // `eslint-loader` is used first, to lint the code.
        test: /\.(vue|jsx?|tsx?)$/,
        include: [userConfig.srcPath],
        use: [
          {
            loader: 'eslint-loader',
            options: { cache: true },
          },
        ],
      },
      // Stylesheets.
      {
        test: /\.s?css$/,
        use: [
          // `vue-style-loader` turns CSS into JS modules.
          {
            loader: 'vue-style-loader',
            options: {},
          },
          // `css-loader` resolves paths in CSS and adds assets as dependencies.
          {
            loader: 'css-loader',
            options: { sourceMap: true, import: false },
          },
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
          name: 'media/[name].[ext]',
        },
      },
      // Images files.
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          name: 'images/[name].[ext]',
        },
      },
      // Fonts files.
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    // Makes some environment variables available to the JS code.
    new webpack.DefinePlugin(Object.keys(userConfig.env.development).reduce((envVars, key) => (
      Object.assign(envVars, { [`process.env.${key}`]: userConfig.env.development[key] })
    ), {})),
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
  devServer: contextSpecificConfig.devServer,
};

module.exports = developmentConfig;
