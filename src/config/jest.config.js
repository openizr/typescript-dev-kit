/**
 * Copyright (c) 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved */

const path = require('path');
const validateConfig = require('./validateConfig');
const packageJson = require('../../../package.json');

const userConfig = packageJson.tsDevKitConfig;
userConfig.srcPath = path.resolve(__dirname, '../../../', userConfig.srcPath);

try {
  validateConfig(userConfig);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit();
}

module.exports = {
  rootDir: path.resolve(__dirname, '../../../'),
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.{ts,tsx}',
  ],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$',
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|png|jpg|ico)$': '<rootDir>/node_modules/typescript-dev-kit/jest/fileMock.js',
  },
  moduleDirectories: [
    '<rootDir>/node_modules',
    userConfig.srcPath,
  ],
  roots: [
    userConfig.srcPath,
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
  ],
};
