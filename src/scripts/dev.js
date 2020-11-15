/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
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
const { spawn } = require('child_process');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const packageJson = require('../../../package.json');
const config = require('../config/webpack.config.dev');

const distPath = config.output.path;
const compiler = webpack(config);
let nodeProcess = null;

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
          excludeAssets: [/\.d\.ts$/i],
        },
        publicPath: '/assets',
        index: 'index.html',
      }));

      // `webpack-hot-middleware` package enables HMR, along with a dev server.
      server.use(webpackHotMiddleware(compiler, {
        path: '/assets/_hmr',
        heartbeat: 2000,
      }));

      // Serves all static assets.
      server.use(express.static(path.resolve(config.output.path, '..')));

      // Catch-all to redirect any request to the main entry point (index.html).
      server.get('*', (_request, response) => {
        response.sendFile(path.resolve(config.output.path, '../index.html'));
      });

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
        // Removing temporary .d.ts generated files...
        Object.keys(stats.compilation.assets).forEach((assetPath) => (
          (assetPath.slice(-5) === '.d.ts')
            ? fs.removeSync(path.resolve(__dirname, `../${(config.target === 'web') ? '' : '../'}${assetPath}`))
            : null
        ));
        console.log(stats.toString({
          colors: true,
          cached: true,
          performance: true,
          modules: false,
          children: false,
          excludeAssets: [/\.d\.ts$/i],
        }));

        if (!stats.hasErrors()) {
          // Writing distributable `package.json` file into `dist` directory...
          try {
            // Writing distributable `package.json` file into `dist` directory...
            fs.writeJsonSync(path.join(distPath, 'package.json'), {
              name: packageJson.name,
              main: packageJson.main,
              types: './types.d.ts',
              bugs: packageJson.bugs,
              author: packageJson.author,
              version: packageJson.version,
              engines: packageJson.engines,
              license: packageJson.license,
              keywords: packageJson.keywords,
              homepage: packageJson.homepage,
              repository: packageJson.repository,
              description: packageJson.description,
              contributors: packageJson.contributors,
              dependencies: packageJson.dependencies,
              peerDependencies: packageJson.peerDependencies,
            }, { spaces: 2 });
            // For back-end projects, the final bundle can be executed after each compilation.
            // This is especially useful when developing a NodeJS server for instance.
            if (packageJson.tsDevKitConfig.runInDev === true) {
              if (nodeProcess !== null) {
                nodeProcess.kill('SIGKILL');
                nodeProcess = null;
              }
              nodeProcess = spawn('node', [path.join(distPath, packageJson.main)]);
              nodeProcess.stdout.on('data', (data) => {
                console.log(data.toString());
              });
              nodeProcess.on('error', (...args) => {
                console.log(args);
              });
            }
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
