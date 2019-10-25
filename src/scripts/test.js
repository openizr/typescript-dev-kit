/**
 * Copyright (c) 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

process.env.NODE_ENV = 'test';

const jest = require('jest');
const path = require('path');

// We want to run Jest in watch mode and see the code coverage for faster testing.
jest.run(['--coverage', '--watchAll', `--config=${path.resolve(__dirname, '../config/jest.config.js')}`]);
