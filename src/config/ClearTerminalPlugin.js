/**
 * Copyright 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 * All rights reserved.
 */


/* eslint-disable no-console */


/**
 * Clears terminal before a webpack compilation.
 */
class ClearTerminalPlugin {}


ClearTerminalPlugin.prototype.apply = (compiler) => {
  const clear = (_, done) => {
    // '\x1B[2J\x1B[3J\x1B[H' to reset scrolling as well.
    process.stdout.write('\x1B[2J\x1B[0f');
    console.log('Compiling...');
    done();
  };
  compiler.hooks.run.tapAsync('emit', clear);
  compiler.hooks.watchRun.tapAsync('emit', clear);
};


module.exports = ClearTerminalPlugin;

