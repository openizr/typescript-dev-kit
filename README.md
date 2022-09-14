# typescript-dev-kit

Build any JavaScript or TypeScript project in minutes, without worrying about the configuration.

[![npm](https://img.shields.io/npm/v/typescript-dev-kit.svg)](https://www.npmjs.com/package/typescript-dev-kit)
[![node](https://img.shields.io/node/v/typescript-dev-kit.svg)](https://nodejs.org)
[![downloads](https://img.shields.io/npm/dm/typescript-dev-kit.svg?style=flat-square)](https://www.npmjs.com/package/typescript-dev-kit)


## Table of Contents

1. [Philosophy](#Philosophy)
2. [Features](#Features)
3. [Installation](#Installation)
4. [Configuration](#Configuration)
    1. [The Easy Way](#Theeasyway)
    2. [The (less) Easy Way](#The-less-easy-way)
5. [Usage](#Usage)
6. [Contributing](#Contributing)
7. [Sponsor](#Sponsor)
8. [Maintainers](#Maintainers)
9. [License](#License)


## Philosophy

Most JS/TS development environments out there are often completely opinionated (i.e. meant to build exclusively React, Vue, or Svelte apps). It can be very frustrating when developing cross-frameworks solutions, or dealing with multiple stacks.

Also, managing and maintaining dozens of similar configuration (`.eslintrc`, `.babelrc`, `webpack.config.dev.js`, `tsconfig.json`, `.npmrc`, the list is endless) files over your projects is an unecessary, time-consuming task. Most of the time, configuration are exactly the same, they bloat your repositories, and impacts projects structuration/legibility.

That's precisely why `typescript-dev-kit` is here. It aims to provide:
- A nice, simple, performant development experience
- A 0-configuration (but still flexible) flow, with no setup headaches
- A framework-agnostic setup, allowing you to develop either for front or back ends, or even libraries to publish over NPM
- An all-included environment, with shipped-in unit-testing solution, linter, bundler, optimizations, transpiler, ...


## Features

This toolbox includes:

- **Unit testing solution**: with [Jest](https://jestjs.io/) (which is by far the best JS/TS testing framework on the market)
- **Optimized bundling**: with [esbuild](https://esbuild.github.io/) and [vite](https://vitejs.dev/) (the most complete and performant bundlers to date)
- **Bundle analyser**: with [Rollup Plugin Visualizer](https://github.com/btd/rollup-plugin-visualizer)
- **Coverage reporting**: with [Istanbul](https://github.com/gotwarlost/istanbul)
- **Automated documentation generation**: with [TypeDoc](http://typedoc.org/)
- **TypeScript support**
- **SASS support**
- **Dynamic imports support**
- **Sourcemaps generation**
- **index.html generation from template**
- **React / Svelte / Vue support**: with Svelte / Vue Single File Components
- **Code Linting**: based on [Airbnb Style Guide](https://github.com/airbnb/javascript)
- **Hot Module Reloading** when developing front-end solutions
- **Automatic package bundling**: if you are writing a NPM package
- **Node 14+ / Evergreen browsers support**: with ES7 features and [Autoprefixer](https://github.com/postcss/autoprefixer)
- **Environment initialization command**


## Installation

```bash
yarn add --dev typescript-dev-kit
```


## Configuration

### The easy way

You can pick-up one of the boilerplates that are available on [project-boilerplate](https://github.com/openizr/project-boilerplate), depending on your needs (based on Docker). No configuration required, you're aleady good to go!

### The (less) easy way

If you prefer setting up your project from scratch without using an existing boilerplate, here are the files you need to change in order to unleash the full power of `typescript-dev-kit`.

Add the following to your `package.json`:

```javascript
...
"tsDevKitConfig": {
  "target": "node",     // Can be "node" (back-end projects or libraries) or "web" (front-end projects).
  "devServer": {        // Your dev server configuration (front-end projects).
    "host": "0.0.0.0",
    "port": 3000
  },
  "html": "./html/index.html" // Your index.html template configuration (front-end projects).
  "runInDev": true,           // Whether to launch main entrypoint with node after each compilation in dev mode (back-end projects).
  "splitChunks": true,        // Whether to split JS chunks, or bundle everything in 1 file in build mode (front-end projects).
  "entries": {                // Here you can list all your entrypoints (relative paths from your "srcPath").
    "main": "main.ts",
    "other": "otherScript.js",
    ...
  },
  "srcPath": "src",     // Source path, containing your codebase.
  "distPath": "public", // Distribution path, in which all assets will be compiled.
  "publicPath": "https://assets.dev", // URL from which assets will be fetched (front-end projects).
  "banner": "/*! Copyright John Doe. */", // This banner will be put at the top of all your bundled assets.
  "env": {              // Set your environment variables, they will be automatically inserted in the code at build time (front-end projects).
    "development": {
      "NODE_ENV": "development",
      "API": "http://dev.api.com",
      ...
    },
    "production": {
      "NODE_ENV": "production",
      "API": "http://api.com",
      ...
    }
  },
  ...
  "scripts": {
    "init": "node_modules/typescript-dev-kit/scripts/init",
    "test": "cd node_modules/typescript-dev-kit && scripts/test",
    "dev": "cd node_modules/typescript-dev-kit && node scripts/dev",
    "build": "cd node_modules/typescript-dev-kit && node scripts/build",
    "check": "cd node_modules/typescript-dev-kit && node scripts/check -f",
    "doc": "typedoc --out ./doc/ --exclude \"**/*.js\" --exclude \"**/__+(tests|mocks)__/**\" src/",
    "postinstall": "rm -f node_modules/.eslintcache"
  }
},
...
"eslintConfig": {       // Includes the shipped-in Eslint config (you can also override some rules if you want).
  "extends": [
    "./node_modules/typescript-dev-kit/main.cjs"
  ]
},
```

If you wish to develop in TypeScript, you need to create the following `tsconfig.json` file:

```javascript
{
  "extends": "./node_modules/typescript-dev-kit/tsconfig.json",
  "compilerOptions": {
    "baseUrl": "src"    // Must be the same as your `package.json`'s "srcPath".
  }
}
```

/!\ Depending on the type of project you're developing, you might also want to add the `"type": "module"` directive in your `package.json`.

## Usage

### Project initialization

```bash
yarn run init
```

This script will initialize your project, populating metadata where they belong (authors/contributors, project name, git repository, ...).

### Development mode

```bash
yarn run dev
```

Starts the development mode. In this mode, you benefit of the HMR on your pages (front-end projects) and automatic restart of your scripts (back-end project). This allows you to see your changes in real time. Final bundle isn't optimized to provide maximum responsiveness of the environment.

**Note:** _when developing a library (`"target": "node"`), a random semver-compliant number is set in place of your `package.json`'s version in the distributable directory. It allows you to test your package in real time by forcing cache invalidation._

**Note:** _when developing a web app (`"target": "web"`), the `index.html` served by the development web server will be generated from the template you specified in your configuration, and will be kept in memory (not written on disk) for performance purpose._

### Testing mode

```bash
yarn run test [-w]
```

Starts the testing mode. All your tests written in `*.test.js(x)` / `*.test.ts(x)` files are run, and code coverage report is generated at the end of the whole testing suite, in a `coverage` directory. The `-w` option allows you to run Jest in watch mode.

### Build mode

```bash
yarn run build
```

Starts the build mode. You can pass the `--force` option to prevent pipe from failing in case of linting / typechecking issues. This mode bundles and optimizes your codebase and related assets for distribution. Sourcemaps are also generated (use `--enable-source-maps` to leverage on sourcemaps in Node), as well as the bundle analysis report in a `report.html` file. When building a NPM package, any relevant file (`README.md`, `LICENSE`, ...) is also included in your distributable directory.

### Checking

```bash
yarn run check
```

Runs linter and type-checkers on your codebase. You can pass the `-w` option to enable watch mode, and `-f` to automatically fix issues when possible.

### Documentation

```bash
yarn run doc
```

Generates an automatic technical documentation based on the comments and typings present in your code. The result is available in the `doc` directory.


## Contributing

You're free to contribute to this project by submitting [issues](https://github.com/openizr/typescript-dev-kit/issues) and/or [pull requests](https://github.com/openizr/typescript-dev-kit/pulls). For more information, please read the [Contribution guide](https://github.com/openizr/typescript-dev-kit/blob/master/CONTRIBUTING.md).


## Sponsor

Love this project and want to support it? You can [buy me a coffee](https://www.buymeacoffee.com/matthieujabbour) :)

Or just sending me a quick message saying "Thanks" is also very gratifying, and keeps me motivated to maintain open-source projects I work on!


## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150" src="https://avatars.githubusercontent.com/u/29428247?v=4&s=150">
        </br>
        <a href="https://github.com/matthieujabbour">Matthieu Jabbour</a>
      </td>
    </tr>
  <tbody>
</table>


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) Openizr. All Rights Reserved.
