/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const vueJest = require('vue-jest');

// Custom Jest transform implementation that wraps vue-jest to fix an incompatibility in v3.
module.exports = {
  process(src, filePath, jestConfig) {
    return vueJest.process(src, filePath, jestConfig.config);
  },
};
