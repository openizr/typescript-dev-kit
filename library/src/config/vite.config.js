/**
 * Copyright (c) Openizr. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import { visualizer } from 'rollup-plugin-visualizer';
import postCssSortMediaQueries from 'postcss-sort-media-queries';
import { createRequire as topLevelCreateRequire } from 'module';
import validateConfig from '../helpers/validateConfig.js';

const require = topLevelCreateRequire(import.meta.url);
const projectRootPath = path.resolve(path.dirname('../../../'));
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRootPath, 'package.json')));
const { tsDevKitConfig } = packageJson;
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

let sveltePlugin = null;
try {
  require('svelte');
  sveltePlugin = require('@sveltejs/vite-plugin-svelte').svelte;
} catch (e) {
  // No-op.
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

const sveltePluginConfiguration = { experimental: { useVitePreprocess: true } };
const plugins = []
  .concat(vuePlugin !== null ? [vuePlugin()] : [])
  .concat(reactPlugin !== null ? [reactPlugin()] : [])
  .concat(sveltePlugin !== null ? [sveltePlugin(sveltePluginConfiguration)] : []);

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
  css: {
    postcss: {
      plugins: [autoprefixer].concat((process.env.ENV === 'production') ? [postCssSortMediaQueries] : []),
    },
  },
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
  test: {
    globals: true,
    root: srcPath,
    passWithNoTests: true,
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      all: true,
      root: srcPath,
      allowExternal: true,
      exclude: ['**/__mocks__', '**/__tests__'],
    },
  },
  // Statically replaces environment variables in JS code.
  define: Object.keys(tsDevKitConfig.env[process.env.ENV]).reduce((envVars, key) => (
    Object.assign(envVars, { [`process.env.${key}`]: JSON.stringify(tsDevKitConfig.env[process.env.ENV][key]) })
  ), {}),
  plugins,
});

export default viteConfig;
