/**
 * Copyright (c) 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */

process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const packageJson = require('../../../package.json');
const config = require('../config/webpack.config.dev');

const distPath = config.output.path;
const compiler = webpack(config);

// For front-end projects, we setup a dev server to leverage on HMR and Hot Reloading.
if (config.target === 'web') {
  const server = express();

  // Removing existing `dist` directory...
  fs.remove(distPath)
    // Running webpack compiler...
    .then(() => {
      // `webpack-dev-middleware` package enables Webpack to be run as a server in watch mode,
      // for a better development experience.
      // We use it instead of `webpack-dev-server` package because it offers more flexibility and
      // control over the server.
      server.use(webpackDevMiddleware(compiler, {
        stats: {
          colors: true,
          cached: true,
          performance: true,
          modules: false,
          children: false,
        },
        publicPath: '/assets',
        index: 'index.html',
      }));

      // `webpack-hot-middleware` package enables HMR, along with a dev server.
      server.use(webpackHotMiddleware(compiler, {
        path: '/assets/_hmr',
        heartbeat: 2000,
      }));

      server.use(express.static(path.resolve(config.output.path, '..')));
      server.listen(config.devServer.port, config.devServer.ip, () => {
        console.log(`Starting dev server at http://${config.devServer.ip}:${config.devServer.port}...`);
      });
    })
    // If any error occurs...
    .catch((error) => {
      console.error(error);
    });
} else {
  // Removing existing `dist` directory...
  fs.remove(distPath)
  // Running webpack compiler...
    .then(() => {
      compiler.watch({}, (error, stats) => {
        console.log(stats.toString({
          colors: true,
          cached: true,
          performance: true,
          modules: false,
          children: false,
        }));

        if (!stats.hasErrors()) {
          // Writing distributable `package.json` file into `dist` directory...
          try {
            // Writing distributable `package.json` file into `dist` directory...
            fs.writeJsonSync(path.join(distPath, 'package.json'), {
              name: packageJson.name,
              main: `./${packageJson.name}.js`,
              types: './types.d.ts',
              bugs: packageJson.bugs,
              author: packageJson.author,
              version: packageJson.version,
              engines: packageJson.engines,
              licence: packageJson.licence,
              keywords: packageJson.keywords,
              homepage: packageJson.homepage,
              repository: packageJson.repository,
              description: packageJson.description,
              contributors: packageJson.contributors,
              dependencies: packageJson.dependencies,
            }, { spaces: 2 });
          } catch (fsError) {
            console.error(fsError.message);
          }
        }
      });
    })
    // If any error occurs...
    .catch((error) => {
      console.error(error);
    });
}
