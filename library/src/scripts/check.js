/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved */

process.env.NODE_ENV = 'production';

const path = require('path');
const packageJson = require('../../../package.json');
const checkFiles = require('../helpers/checkFiles.js');
const fixNpmPackages = require('../helpers/fixNpmPackages.js');

const { tsDevKitConfig } = packageJson;
const watchMode = process.argv.indexOf('-w') >= 0;
const projectRootPath = path.resolve(__dirname, '../../../');
const srcPath = path.join(projectRootPath, tsDevKitConfig.srcPath);

/**
 * Runs `check` CLI command's script.
 */
async function run() {
  await fixNpmPackages(projectRootPath);
  await checkFiles(projectRootPath, srcPath, watchMode);
}

run();
