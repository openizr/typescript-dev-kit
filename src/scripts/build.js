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
const dtsGenerator = require('dts-generator');
const packageJson = require('../../../package.json');
const config = require('../config/webpack.config.prod');

const compiler = webpack(config);
const srcPath = config.context;
const distPath = config.output.path;
const readmePath = path.resolve(__dirname, '../../../README.md');
const licensePath = path.resolve(__dirname, '../../../LICENSE');

// Removing existing `dist` directory...
fs.remove(distPath)
  // Running webpack compiler...
  .then(() => new Promise((resolve, reject) => {
    console.log('Compiling...');
    compiler.run((error, stats) => (error ? reject(error) : resolve(stats)));
  }))
  // Displaying webpack compilation stats...
  .then((stats) => {
    if (stats.hasErrors()) throw new Error(stats.toJson().errors[0]);
    console.log(stats.toString({
      colors: true,
      cached: true,
      performance: true,
      modules: false,
      children: false,
    }));
  })
  .then(() => ((config.target === 'web')
    ? null
    // Writing distributable `package.json` file into `dist` directory...
    : fs.writeJson(path.join(distPath, 'package.json'), {
      name: packageJson.name,
      main: packageJson.main,
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
      // Generating typings into `dist` directory...
      .then(() => dtsGenerator.default({
        name: packageJson.name,
        main: `module/scripts/${Object.keys(config.entry)[0]}`,
        prefix: 'module',
        files: Object.values(config.entry),
        out: path.resolve(distPath, 'types.d.ts'),
        verbose: true,
        baseDir: srcPath,
      }))
  ))
  // All went well...
  .then(() => {
    console.log('Done.');
  })
  // If any error occurs...
  .catch((error) => {
    console.error(error);
  });
