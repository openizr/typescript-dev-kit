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
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    : new RegExp(`^(${Object.keys(packageJson.dependencies || {}).concat(Object.keys(packageJson.peerDependencies || {})).join('|')})(.*)$`),
  output: {
    path: (userConfig.target === 'web') ? `${userConfig.distPath}/assets` : userConfig.distPath,
    filename: (userConfig.target === 'web') ? 'scripts/[name].js' : '[name].js',
    libraryTarget: (userConfig.target === 'web') ? undefined : 'commonjs2',
  },
  resolve: {
    // We include the Vue compiler along with the builder to allow for `template` syntax.
    alias: (userConfig.target === 'web') ? { vue: 'vue/dist/vue.runtime.js' } : {},
    // Allows importing files as modules (with absolute path).
    modules: [userConfig.srcPath, 'node_modules'],
  },
  plugins: [
    // Allows .vue files parsing.
    new VueLoaderPlugin(),
  ].concat((userConfig.target === 'web')
    ? [
      // Enables HMR with webpack-dev-middleware.
      new webpack.HotModuleReplacementPlugin(),
      // Generates final `index.html` from template.
      new HtmlWebpackPlugin({
        inject: false,
        environment: 'development',
        chunks: userConfig.html.entries,
        filename: path.resolve(userConfig.distPath, 'index.html'),
        template: path.resolve(userConfig.srcPath, userConfig.html.template),
      }),
    ]
    : []),
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
    publicPath: (userConfig.target === 'web') ? `http://${userConfig.devServer.ip}:${userConfig.devServer.port}/assets/` : undefined,
    path: contextSpecificConfig.output.path,
    pathinfo: true,
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
              // Needed as we use `fork-ts-checker-webpack-plugin` for typechecking.
              transpileOnly: true,
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
          // Setting this option to `true` generates issues when developing components libraries.
          optimizeSSR: false,
        },
      },
      // Stylesheets.
      {
        test: /\.s?css$/,
        use: [
          // `style-loader` turns CSS into JS modules.
          {
            loader: 'style-loader',
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
          filename: 'media/[name][ext]',
        },
      },
      // Images files.
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      // Fonts files.
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    // Performs type checking and linting in parallel threads to improve compilation performance.
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        extensions: {
          vue: true,
        },
        configOverwrite: {
          exclude: [userConfig.distPath],
        },
        configFile: path.resolve(__dirname, '../../../', 'tsconfig.json'),
      },
      eslint: {
        enabled: true,
        files: [userConfig.srcPath],
        options: {
          cache: true,
          cacheLocation: path.resolve(__dirname, '../../../node_modules/.eslintcache'),
        },
      },
    }),
    // Makes some environment variables available to the JS code.
    new webpack.DefinePlugin(Object.keys(userConfig.env.development).reduce((envVars, key) => (
      Object.assign(envVars, { [`process.env.${key}`]: JSON.stringify(userConfig.env.development[key]) })
    ), {})),
    // Includes copyright comment on top of each generated file.
    new webpack.BannerPlugin({ banner: userConfig.banner, raw: true }),
    // Clears terminal between each compilation.
    new ClearTerminalPlugin(),
  ].concat(contextSpecificConfig.plugins),
  // Removes heavy chunks splitting process to improve compilation performance.
  optimization: {
    runtimeChunk: (userConfig.target === 'web') ? 'single' : false,
    splitChunks: false,
    emitOnErrors: false,
    removeEmptyChunks: false,
    removeAvailableModules: false,
  },
  // Prevents webpack from injecting mocks to Node native modules
  // that do not make sense for the client.
  node: false,
  devServer: contextSpecificConfig.devServer,
};

module.exports = developmentConfig;
