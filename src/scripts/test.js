/**
 * Copyright 2016 - present, Matthieu Jabbour <matthieu.jabbour@gmail.com>.
 * All rights reserved.
 */


process.env.NODE_ENV = 'test';


const jest = require('jest');
const path = require('path');


// We want to run Jest in watch mode and see the code coverage for faster testing.
jest.run(['--coverage', '--watchAll', `--config=${path.resolve(__dirname, '../package.json')}`]);
