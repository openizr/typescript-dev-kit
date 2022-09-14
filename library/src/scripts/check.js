/**
 * Copyright (c) Openizr. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import '../config/env.js';
import path from 'path';
import fs from 'fs-extra';
import checkFiles from '../helpers/checkFiles.js';

const fixMode = process.argv.indexOf('-f') >= 0;
const watchMode = process.argv.indexOf('-w') >= 0;
const projectRootPath = path.resolve(path.dirname('../../../'));
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRootPath, 'package.json')));
const { tsDevKitConfig } = packageJson;
const srcPath = path.join(projectRootPath, tsDevKitConfig.srcPath);

/**
 * Runs `check` CLI command's script.
 */
async function run() {
  const runSvelteChecker = !!packageJson.dependencies?.svelte || !!packageJson.peerDependencies?.svelte;
  await checkFiles(projectRootPath, srcPath, runSvelteChecker, watchMode, fixMode);
}

run();
