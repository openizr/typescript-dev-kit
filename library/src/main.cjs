/**
 * Copyright (c) Openizr. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const path = require('path');
const packageJson = require('../../package.json');

const projectRootPath = path.resolve(__dirname, '../../');

module.exports = {
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint', 'svelte3'],
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-recommended', 'plugin:react-hooks/recommended', 'plugin:vitest-globals/recommended'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.svelte', '.vue'],
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
    'no-underscore-dangle': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.tsx', '.jsx'],
      },
    ],
    'react/require-default-props': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 10,
        multiline: 1,
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
        svelte: 'always',
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
    {
      files: ['*.vue'],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
      },
    },
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'no-labels': 'off',
        'import/first': 'off',
        'import/no-mutable-exports': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'import/prefer-default-export': 'off',
        'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 2, maxEOF: 0 }],
        'no-restricted-syntax': ['error', 'ForInStatement', 'ForOfStatement', 'WithStatement'],
      },
    },
  ],
  settings: {
    'svelte3/typescript': true,
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte', '.json'],
        paths: [path.join(projectRootPath, packageJson.tsDevKitConfig.srcPath)],
      },
      'import/extensions': ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte'],
    },
  },
  env: {
    browser: true,
    'vitest-globals/env': true,
    'vue/setup-compiler-macros': true,
  },
};
