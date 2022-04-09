/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved, global-require */

const fs = require('fs');
const path = require('path');
const { defineConfig } = require('vite');
const autoprefixer = require('autoprefixer');
const { visualizer } = require('rollup-plugin-visualizer');
const postCssSortMediaQueries = require('postcss-sort-media-queries');
const { svelte: sveltePlugin } = require('@sveltejs/vite-plugin-svelte');
const validateConfig = require('../helpers/validateConfig.js');
const packageJson = require('../../../package.json');

const { tsDevKitConfig } = packageJson;
const projectRootPath = path.resolve(__dirname, '../../../');
const srcPath = path.join(projectRootPath, tsDevKitConfig.srcPath);

const srcSubDirectories = fs.readdirSync(srcPath, { withFileTypes: true })
  .filter((fileOrDirectory) => fileOrDirectory.isDirectory())
  .map((directory) => directory.name);

try {
  validateConfig(tsDevKitConfig);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
}

let vuePlugin = null;
try {
  require('vue');
  vuePlugin = require('@vitejs/plugin-vue');
} catch (e) {
  // No-op.
}

let reactPlugin = null;
try {
  require('react');
  reactPlugin = require('@vitejs/plugin-react');
} catch (e) {
  // No-op.
}

const plugins = [sveltePlugin({ experimental: { useVitePreprocess: true } })]
  .concat(vuePlugin !== null ? [vuePlugin()] : [])
  .concat(reactPlugin !== null ? [reactPlugin()] : []);

if (process.env.ENV === 'production') {
  plugins.push(visualizer({
    filename: path.join(projectRootPath, 'report.html'),
  }));
}

const viteConfig = defineConfig({
  root: projectRootPath,
  base: tsDevKitConfig.publicPath || '/',
  resolve: {
    // Allows absolute imports resolution (e.g. `import 'styles/index.scss'`).
    alias: srcSubDirectories.reduce((aliases, directory) => ({
      ...aliases, [directory]: path.join(srcPath, directory),
    }), {}),
  },
  server: tsDevKitConfig.devServer,
  css: (process.env.ENV === 'production') ? {
    postcss: {
      plugins: [autoprefixer, postCssSortMediaQueries],
    },
  } : {},
  build: {
    target: 'es6',
    outDir: '__dist__',
    sourcemap: true,
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        banner: tsDevKitConfig.banner,
        format: (tsDevKitConfig.splitChunks === false) ? 'iife' : 'esm',
        inlineDynamicImports: tsDevKitConfig.splitChunks === false,
        assetFileNames: 'assets/[ext]/[name].[hash][extname]',
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
      },
    },
  },
  // Statically replaces environment variables in JS code.
  define: Object.keys(tsDevKitConfig.env[process.env.ENV]).reduce((envVars, key) => (
    Object.assign(envVars, { [`process.env.${key}`]: JSON.stringify(tsDevKitConfig.env[process.env.ENV][key]) })
  ), {}),
  plugins,
});

module.exports = viteConfig;
