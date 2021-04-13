/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
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
    '**/*.{js,ts,jsx,tsx,vue}',
    '!**/*.d.{ts,tsx}',
  ],
  globals: {
    'vue-jest': {
      transform: {
        js: path.resolve(__dirname, '../jest/transform.js'),
      },
      babelConfig: {
        presets: ['@babel/preset-env'],
        // `dynamic-import-node` allows for dynamic import syntax.
        plugins: ['@babel/plugin-syntax-dynamic-import', 'dynamic-import-node'],
      },
    },
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))([^.]d|[^.][^d])\\.(js|ts|jsx|tsx|vue)$',
  transform: {
    '\\.(js|jsx)$': path.resolve(__dirname, '../jest/transform.js'),
    '\\.(ts|tsx)$': 'ts-jest',
    '\\.(vue)$': '<rootDir>/node_modules/vue-jest',
  },
  moduleNameMapper: {
    '\\.(?!js|ts|jsx|tsx|vue)([a-z0-9]+)$': '<rootDir>/node_modules/typescript-dev-kit/jest/fileMock.js',
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
    'vue',
    'json',
  ],
};
