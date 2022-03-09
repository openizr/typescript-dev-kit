/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const path = require('path');
const fs = require('fs-extra');

/**
 * Fixes a few bugs in used NPM dependencies, not solved to date.
 *
 * @param {string} projectRootPath Absolute path to the project's root directory.
 *
 * @returns {void}
 */
module.exports = async function fixNpmPackages(projectRootPath) {
  // `svelter-jest` fix (see https://github.com/mihar-22/svelte-jester/issues/48).
  let filePath = path.join(projectRootPath, 'node_modules/svelte-jester/dist/transformer.cjs');
  let fileContent = await fs.readFile(filePath);
  await fs.writeFile(filePath, fileContent.toString().replace('url.pathToFileURL', ''));

  // `vue-jest` fix that allows us to use TS transformer instead of Babel for JS code in Vue files.
  filePath = path.join(projectRootPath, 'node_modules/@vue/vue3-jest/lib/process.js');
  fileContent = await fs.readFile(filePath);
  await fs.writeFile(filePath, fileContent.toString().replace('|| babelTransformer', '|| typescriptTransformer'));

  // `esbuild-jest` fix for types annotations with babel (see https://github.com/aelbore/esbuild-jest/pull/64/files#diff-df7446068188621a3fa66e02d4e5c9081902f1bb2cd9092e06c59271978257d3).
  filePath = path.join(projectRootPath, 'node_modules/esbuild-jest/transformer.js');
  fileContent = await fs.readFile(filePath);
  await fs.writeFile(filePath, fileContent.toString().replace('createTransformer({\n', 'createTransformer({\npresets: [ "@babel/preset-typescript" ],\n'));
};
