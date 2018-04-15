/**
 * Copyright 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 * All rights reserved.
 */


/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */


process.env.NODE_ENV = 'production';


const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const packageJson = require('../../../package.json');
const config = require('../config/webpack.config.prod');


const types = 'types.d.ts';
const compiler = webpack(config);
const distPath = config.output.path;
const srcPath = config.context;

// `package.json` content used for distribution.
const distPackageJson = JSON.stringify({
  main: `./${packageJson.name}.js`,
  types: `./${types}`,
  name: packageJson.name,
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
});


// Removing existing `dist` directory...
fs.remove(distPath)
  // Running webpack compiler...
  .then(() => new Promise((resolve, reject) => {
    console.log('Compiling...');
    compiler.run((error, stats) => (error ? reject(error) : resolve(stats)));
  }))
  // Displaying webpack compilation stats...
  .then((stats) => {
    const message = stats.toString({
      colors: true,
      cached: true,
      performance: true,
      modules: false,
      children: false,
    });
    if (stats.hasErrors()) throw new Error(message);
    console.log(message);
  })
  // Writing distributable `package.json` and `types.d.ts` files into `dist` directory...
  .then(() => fs.writeFile(path.join(distPath, 'package.json'), distPackageJson))
  .then(() => fs.copy(path.join(srcPath, types), path.join(distPath, types)))
  // All went well...
  .then(() => {
    console.log('Done.');
  })
  // If any error occurs...
  .catch((error) => {
    console.error(error.message);
  });
