/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const path = require('path');
const fs = require('fs-extra');

process.env.NODE_ENV = 'production';

const { log, error } = console;
const srcPath = path.resolve(__dirname, '../src');
const distPath = path.resolve(__dirname, '../dist');

// Removing existing `dist` directory...
fs.remove(distPath)
  .then(() => {
    log('Compiling...');
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
    log('Done.');
  })
  // If any error occurs...
  .catch((e) => {
    error(e);
  });
