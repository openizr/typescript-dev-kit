/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

process.env.NODE_ENV = 'test';

const jest = require('jest');
const path = require('path');

const watch = (process.argv.indexOf('-w') >= 0)
  ? '--watchAll'
  : '';

// We want to run Jest in watch mode and see the code coverage for faster testing.
jest.run(['--coverage', watch, `--config=${path.resolve(__dirname, '../config/jest.config.js')}`]);
