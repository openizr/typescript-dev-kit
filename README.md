# typescript-dev-kit

This package contains all the configurations and libraries that can be useful when developing
front-end and back-end JavaScript or TypeScript projects.

## Philosophy

Contrary to most development environments out there that provide support and tools for one specific
ecosystem (i.e. choose your side: React, VueJS ? ExpressJS, Apollo ? ...), the `typescript-dev-kit`
package is completely unopinionated, meaning you can build front/back ends or libraries using the
frameworks of your choice, and seamlessly switch over time while keeping the same environment.

There are still a few basic rules however:
- Testing must be performed with [Jest](https://jestjs.io/) (which is by far the best testing framework on the market)
- Bundling is handled by [Webpack](https://webpack.js.org/) (the most complete bundler)
- Eslint uses [Airbnb style guide](https://github.com/airbnb/javascript), although you can override the config to provide your own rules
- SASS is the official CSS preprocessor (and it's good enough)

## Other info
- VueJS and React are the 2 front-end frameworks currently supported
- Webpack is already configured to provide 100% optimized bundles, even for building npm packages
- You can develop either in JavaScript (ES6 is supported), or TypeScript depending on your needs
- Shipped-in HMR, source maps generation, CSS autoprefixer, environment variables definition, ...

## Installation

The [TypeScript boilerplate](https://github.com/openizr/typescript-boilerplate) is made for you, nothing special to do!
But if you prefer the hard way, just `yarn add --dev typescript-dev-kit`, configure your `package.json` and you're good to go.

## Configuration

In your `package.json`:

```javascript
...
"tsDevKitConfig": {
  "target": "node", // Can be "node" or "web".
  "entry": { // Here you can list all your entrypoints.
    "main": "main.ts",
    ...
  },
  "srcPath": "src", // Source path, containing your codebase.
  "distPath": "public", // Distribution path, in which all assets will be compiled.
  "banner": "/** Copyright Douglas, Inc */", // This banner will be put at the top of all your compiled assets.
  "env": {  // Here you can specify all your environment variables, they will be automatically replaced in the code at build time.
    "development": {
      "NODE_ENV": "\"development\""
    },
    "production": {
      "NODE_ENV": "\"production\""
    }
  }
},
...
"eslintConfig": { // Tells your IDE and Webpack to inherit the shipped-in Eslint config (you can also define your own rules).
  "extends": [
    "./node_modules/typescript-dev-kit/main.js"
  ]
},
```

In your `tsconfig.json`:

```javascript
{
  "extends": "./node_modules/typescript-dev-kit/tsconfig.json", // Tells your IDE and Webpack to inherit the shipped-in TypeScript config.
  "compilerOptions": {
    "baseUrl": "src"  // Path to your codebase directory.
  }
}
```

## Contributing

See the [Contribution guide](https://github.com/openizr/typescript-dev-kit/blob/master/CONTRIBUTING.md)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) Matthieu Jabbour. All Rights Reserved.