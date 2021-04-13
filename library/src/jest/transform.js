/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Custom Jest transform implementation that wraps babel-jest and injects our
// babel presets, so we don't have to use `.babelrc`.
module.exports = require('babel-jest').createTransformer({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  // `dynamic-import-node` allows for dynamic import syntax.
  plugins: ['@babel/plugin-syntax-dynamic-import', 'dynamic-import-node'],
});
