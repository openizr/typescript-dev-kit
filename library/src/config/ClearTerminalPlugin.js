/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Clears terminal before a webpack compilation.
 */
class ClearTerminalPlugin {}

ClearTerminalPlugin.prototype.apply = (compiler) => {
  compiler.hooks.emit.tapAsync('emit', (_, done) => {
    process.stdout.write('\033c');
    done();
  });
};

module.exports = ClearTerminalPlugin;
