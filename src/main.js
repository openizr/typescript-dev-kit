/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved */

const path = require('path');
const packageJson = require('../../package.json');

module.exports = {
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended', 'plugin:vue/recommended'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    // See https://github.com/typescript-eslint/typescript-eslint/issues/2540.
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 2,
    // See https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md.
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.tsx', '.jsx'],
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        ts: 'never',
        jsx: 'never',
        tsx: 'never',
        vue: 'always',
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
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn'],
        '@typescript-eslint/explicit-module-boundary-types': ['warn'],
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json'],
        paths: [path.resolve(__dirname, '../../', packageJson.tsDevKitConfig.srcPath)],
      },
      'import/extensions': ['.js', '.ts', '.jsx', '.tsx', '.vue'],
    },
  },
  env: {
    browser: true,
    jest: true,
  },
};
