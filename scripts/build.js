/**
 * Copyright 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 * All rights reserved.
 */


/* eslint-disable no-console */
/* eslint-disable import/first */
/* eslint-disable import/no-extraneous-dependencies */


process.env.NODE_ENV = 'production';


import * as path from 'path';
import * as fs from 'fs-extra';


const srcPath = path.resolve(__dirname, '../src');
const distPath = path.resolve(__dirname, '../dist');


// Removing existing `dist` directory...
fs.remove(distPath)
  .then(() => {
    console.log('Compiling...');
  })
  // Copying the whole `src` directory into `dist`...
  .then(() => fs.copy(srcPath, distPath))
  // Copying `package.json` into `dist`...
  .then(() => fs.copy(path.join(__dirname, '../package.json'), path.join(distPath, 'package.json')))
  // All went well...
  .then(() => {
    console.log('Done.');
  })
  // If any error occurs...
  .catch((error) => {
    console.error(error);
  });
