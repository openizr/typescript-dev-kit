/**
 * Copyright (c) 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable no-console */

import * as path from 'path';
import * as fs from 'fs-extra';

process.env.NODE_ENV = 'production';

const srcPath = path.resolve(__dirname, '../src');
const distPath = path.resolve(__dirname, '../dist');

// Removing existing `dist` directory...
fs.remove(distPath)
  .then(() => {
    console.log('Compiling...');
  })
  // Copying the whole `src` directory into `dist`...
  .then(() => fs.copy(srcPath, distPath))
  // Copying `package.json` into `dist`...
  .then(() => fs.copy(path.join(__dirname, '../package.json'), path.join(distPath, 'package.json')))
  // Copying `README.md` into `dist`...
  .then(() => fs.copy(path.join(__dirname, '../README.md'), path.join(distPath, 'README.md')))
  // Copying `LICENSE` into `dist`...
  .then(() => fs.copy(path.join(__dirname, '../LICENSE'), path.join(distPath, 'LICENSE')))
  // All went well...
  .then(() => {
    console.log('Done.');
  })
  // If any error occurs...
  .catch((error) => {
    console.error(error);
  });
