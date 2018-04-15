/**
 * Copyright 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 * All rights reserved.
 */


/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */


process.env.NODE_ENV = 'development';


const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const packageJson = require('../../../package.json');
const config = require('../config/webpack.config.dev');


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
        // Writing distributable `package.json` and `types.d.ts` files into `dist` directory...
        try {
          fs.writeFileSync(path.join(distPath, 'package.json'), distPackageJson);
          fs.copySync(path.join(srcPath, types), path.join(distPath, types));
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
