/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * This function checks user config and throws an error if it is not valid, to prevent
 * running misconfigured webpack (which can lead to bad side effects,
 * like unexpected directories deletion).
 *
 * @param {string} userConfig User configuration for webpack.
 *
 * @returns {void}
 */
module.exports = (userConfig) => {
  const allowedTargets = ['web', 'node', 'electron'];

  // Checking if user configuration does even exist...
  if (typeof userConfig !== 'object') {
    throw new Error('User config validation - configuration is not a valid object.');
  }

  // Checking project target...
  if (allowedTargets.indexOf(userConfig.target) < 0) {
    throw new Error('User config validation - specified "target" is not a valid target.');
  }

  // Checking dev server IP adress and port...
  if (
    userConfig.target === 'web'
    && typeof userConfig.devServer !== 'object'
    && typeof userConfig.devServer.ip !== 'string'
    && typeof userConfig.devServer.port !== 'number'
  ) {
    throw new Error('User config validation - "devServer" params are not valid.');
  }

  // Checking source path...
  if (typeof userConfig.srcPath !== 'string') {
    throw new Error('User config validation - "srcPath" is not a valid path.');
  }

  // Checking entries...
  if (typeof userConfig.entry !== 'object') {
    throw new Error('User config validation - "entry" is not a valid entries object.');
  }

  // Checking dist path...
  if (typeof userConfig.distPath !== 'string') {
    throw new Error('User config validation - "distPath" is not a valid path.');
  }

  // Checking chunks splitting...
  if (userConfig.splitChunks !== undefined && typeof userConfig.splitChunks !== 'boolean') {
    throw new Error('User config validation - "splitChunks" is not a boolean.');
  }

  // Checking banner message...
  if (userConfig.banner !== undefined && typeof userConfig.banner !== 'string') {
    throw new Error('User config validation - "banner" is not a valid banner.');
  }

  // Checking env variables...
  if (userConfig.env === undefined) {
    throw new Error('User config validation - "env" is not a valid object.');
  }
  if (typeof userConfig.env !== 'object') {
    throw new Error('User config validation - "env" is not a valid object.');
  }
  if (userConfig.env.development === undefined || typeof userConfig.env.development !== 'object') {
    throw new Error('User config validation - "env.development" is not a valid object.');
  }
  if (userConfig.env.production === undefined || typeof userConfig.env.production !== 'object') {
    throw new Error('User config validation - "env.production" is not a valid object.');
  }
};
