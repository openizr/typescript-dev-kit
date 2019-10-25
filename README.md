# typescript-dev-kit

This package contains all the configurations and frameworks that can be useful when developing front-end and back-end TypeScript projects.
For front-end projects, React is the supported framework.
Everything is already shipped-in : testing (with Jest), bundling (with webpack), development server and HMR, building script, ...

# Installation

`git clone https://github.com/matthieujabbour/typescript-dev-kit.git`

`yarn install`

# Build and deploy for production

`yarn run build`

`npm publish ./dist`

# Maintenance

In order to keep this package up-to-date, dependencies updates should be checked and updated regularily, using the `yarn outdated` and `yarn upgrade-interactive --latest` commands. Here is the list of repositories changelogs to watch for updates:

- [@babel/core](https://github.com/babel/babel/releases)
- [@babel/node](https://github.com/babel/babel/releases)
- [@babel/preset-env](https://github.com/babel/babel/releases)
- [@babel/plugin-syntax-dynamic-import](https://github.com/babel/babel/releases)
- [@types/jest](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- [@types/source-map-support](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/releases)
- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/releases)
- [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader/releases)
- [autoprefixer](https://github.com/postcss/autoprefixer/releases)
- [css-loader](https://github.com/webpack-contrib/css-loader/releases)
- [dts-generator](https://github.com/SitePen/dts-generator/releases)
- [eslint](https://github.com/eslint/eslint/releases)
- [eslint-config-airbnb-base](https://github.com/airbnb/javascript/releases)
- [eslint-loader](https://github.com/webpack-contrib/eslint-loader/releases)
- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import/releases)
- [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y/releases)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react/releases)
- [eslint-plugin-react-hooks](https://github.com/facebook/react/releases)
- [express](https://github.com/expressjs/express/releases)
- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin/releases)
- [file-loader](https://github.com/webpack-contrib/file-loader/releases)
- [fs-extra](https://github.com/jprichardson/node-fs-extra/releases)
- [jest](https://github.com/facebook/jest/releases)
- [node-sass](https://github.com/sass/node-sass/releases)
- [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin/releases)
- [postcss-loader](https://github.com/postcss/postcss-loader/releases)
- [sass-loader](https://github.com/webpack-contrib/sass-loader/releases)
- [ts-jest](https://github.com/kulshekhar/ts-jest/releases)
- [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin/releases)
- [typedoc](https://github.com/TypeStrong/typedoc/releases)
- [typescript](https://github.com/microsoft/TypeScript/releases)
- [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin/releases)
- [url-loader](https://github.com/webpack-contrib/url-loader/releases)
- [webpack](https://github.com/webpack/webpack/releases)
- [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware/releases)
- [webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware/releases)

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright 2016 - present, Matthieu Jabbour.
