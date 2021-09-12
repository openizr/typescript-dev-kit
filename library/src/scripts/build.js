/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */

process.env.NODE_ENV = 'production';

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const packageJson = require('../../../package.json');
const config = require('../config/webpack.config.prod');

const compiler = webpack(config);
const distPath = config.output.path;
const readmePath = path.resolve(__dirname, '../../../README.md');
const licensePath = path.resolve(__dirname, '../../../LICENSE');

// Removing existing `dist` directory...
fs.remove(distPath)
  // Running webpack compiler...
  .then(() => new Promise((resolve, reject) => {
    console.log('\n\x1B[0m\x1B[34m\x1B[1m > Compiling...\x1B[0m\n');
    compiler.run((error, stats) => (error ? reject(error) : resolve(stats)));
  }))
  // Displaying webpack compilation stats...
  .then((stats) => {
    if (stats.hasErrors()) throw stats.toJson().errors;
    console.log(stats.toString({
      colors: true,
      cached: true,
      performance: true,
      modules: false,
      children: false,
      excludeAssets: [/\.d\.ts$/i],
    }));
  })
  .then(() => ((config.target === 'web')
    ? null
    // Writing distributable `package.json` file into `dist` directory...
    : fs.writeJson(path.join(distPath, 'package.json'), {
      name: packageJson.name,
      main: packageJson.main,
      types: packageJson.types,
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
    }, { spaces: 2 })
      // Writing distributable `README.md` file into `dist` directory...
      .then(() => fs.pathExists(readmePath))
      .then((readmeExists) => ((readmeExists)
        ? fs.copy(readmePath, path.resolve(distPath, 'README.md'))
        : null))
      // Writing distributable `LICENSE` file into `dist` directory...
      .then(() => fs.pathExists(licensePath))
      .then((licenseExists) => ((licenseExists)
        ? fs.copy(licensePath, path.resolve(distPath, 'LICENSE'))
        : null))
  ))
  // All went well...
  .then(() => {
    console.log('\n\x1B[0m\x1B[32m\x1B[1m ✔️ Compiled successfully! \x1B[0m\n');
  })
  // If any error occurs...
  .catch((errors) => {
    console.error('\x1B[0m\x1B[31m\x1B[1m ✖ Compilation failed: \x1B[0m\n');
    const formattedErrors = Array.isArray(errors) ? errors : [errors];
    formattedErrors.forEach((error) => {
      console.error(error.message);
    });
    console.error('');
  });
