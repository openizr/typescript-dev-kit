/**
 * Copyright 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 * All rights reserved.
 */


/**
 * Clears terminal before a webpack compilation.
 */
class ClearTerminalPlugin {}


ClearTerminalPlugin.prototype.apply = (compiler) => {
  compiler.plugin('emit', (_, done) => {
    // '\x1B[2J\x1B[3J\x1B[H' to reset scrolling as well.
    process.stdout.write('\x1B[2J\x1B[0f');
    done();
  });
};


module.exports = ClearTerminalPlugin;

