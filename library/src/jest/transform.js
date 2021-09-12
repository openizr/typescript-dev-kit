/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const babelJest = require('babel-jest'); // eslint-disable-line import/no-extraneous-dependencies

// Custom Jest transform implementation that wraps babel-jest and injects our
// babel presets, so we don't have to use `.babelrc`.
module.exports = babelJest.default.createTransformer({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  // `dynamic-import-node` allows for dynamic import syntax.
  plugins: ['@babel/plugin-syntax-dynamic-import', 'dynamic-import-node'],
});
