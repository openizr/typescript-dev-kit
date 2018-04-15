/**
 * Copyright 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 * All rights reserved.
 */


/* eslint-disable import/no-unresolved */


const webpack = require('webpack');
const userConfig = require('../../../config.ts');
const packageJson = require('../../../package.json');
const ClearTerminalPlugin = require('./ClearTerminalPlugin');


// webpack's development configuration.
const developmentConfig = {
  target: 'node',
  bail: false,
  cache: true,
  context: userConfig.srcPath,
  devtool: 'cheap-module-source-map',
  entry: { [packageJson.name]: './main.ts' },
  output: {
    filename: '[name].js',
    path: userConfig.distPath,
    pathinfo: true,
    library: packageJson.name,
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.json', '.ts', '.tsx', '.js', '*'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [userConfig.srcPath],
        use: [
          // `awesome-typescript-loader` is then used, to compile Typescript into Javascript.
          {
            loader: 'awesome-typescript-loader',
            options: {
              useCache: true,
            },
          },
          // `tslint-loader` is first used, to lint the code.
          {
            loader: 'tslint-loader',
            options: {
              emitErrors: true,
              failOnHint: true,
              typeCheck: true,
            },
          },
        ],
      },
      {
        test: /\.json$/,
        include: [userConfig.srcPath],
        use: [{ loader: 'json-loader' }],
      },
    ],
  },
  plugins: [
    // Handles errors more cleanly and prevents Webpack from outputting anything into a bundle.
    new webpack.NoEmitOnErrorsPlugin(),
    // Makes some environment variables available to the JS code.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
    // Clears terminal between each compilation.
    new ClearTerminalPlugin(),
  ],
};


module.exports = developmentConfig;
