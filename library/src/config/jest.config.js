/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved */

const path = require('path');
const packageJson = require('../../../package.json');
const validateConfig = require('../helpers/validateConfig.js');

const { tsDevKitConfig } = packageJson;
const projectRootPath = path.resolve(__dirname, '../../../');
const srcPath = path.join(projectRootPath, tsDevKitConfig.srcPath);

try {
  validateConfig(tsDevKitConfig);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
}

const transform = {
  '\\.(tsx?|jsx?)$': 'ts-jest',
  '^.+\\.svelte$': [
    'svelte-jester',
    {
      preprocess: path.resolve(__dirname, 'svelte.config.js'),
    },
  ],
};

try {
  require('@vue/compiler-sfc'); // eslint-disable-line global-require
  transform['\\.(vue)$'] = '@vue/vue3-jest';
} catch (e) {
  // No-op.
}

module.exports = {
  rootDir: projectRootPath,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '**/*.{js,ts,jsx,tsx,vue,svelte}',
    '!**/*.d.{ts,tsx}',
  ],
  testRegex: '(/__tests__/.*|\\.(test|spec))([^.]d|[^.][^d])\\.(js|ts|jsx|tsx)$',
  transform,
  moduleNameMapper: {
    '\\.(?!js|ts|jsx|tsx|vue|svelte)([a-z0-9]+)$': '<rootDir>/node_modules/typescript-dev-kit/helpers/fileMock.js',
  },
  moduleDirectories: [
    '<rootDir>/node_modules',
    srcPath,
  ],
  roots: [
    srcPath,
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'vue',
    'svelte',
    'json',
  ],
};
