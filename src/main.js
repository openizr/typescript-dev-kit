/**
 * Copyright (c) 2018 - present, Matthieu Jabbour <mjabbour@inbenta.com>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved */

const path = require('path');
const packageJson = require('../../package.json');

module.exports = {
  plugins: ['@typescript-eslint'],
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.tsx', '.jsx'],
      },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['./*', '../*'],
      },
    ],
    'arrow-parens': ['error', 'always'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', 'js', 'jsx', '.json'],
        paths: [path.resolve(__dirname, '../../', packageJson.tsDevKitConfig.srcPath)],
      },
    },
  },
  env: {
    browser: true,
    jest: true,
  },
};
