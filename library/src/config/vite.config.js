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
import vuePlugin from '@vitejs/plugin-vue';
import reactPlugin from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import validateConfig from '../helpers/validateConfig.js';
import { createRequire as topLevelCreateRequire } from 'module';
import postCssSortMediaQueries from 'postcss-sort-media-queries';
import { svelte as sveltePlugin } from '@sveltejs/vite-plugin-svelte';

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

let useSveltePlugin = false;
try {
  require('svelte');
  useSveltePlugin = true;
} catch (e) {
  // No-op.
}

let useVuePlugin = false;
try {
  require('vue');
  useVuePlugin = true;
} catch (e) {
  // No-op.
}

let useReactPlugin = false;
try {
  require('react');
  useReactPlugin = true;
} catch (e) {
  // No-op.
}

const sveltePluginConfiguration = { experimental: { useVitePreprocess: true } };
const plugins = []
  .concat(useVuePlugin ? [vuePlugin()] : [])
  .concat(useReactPlugin ? [reactPlugin()] : [])
  .concat(useSveltePlugin ? [sveltePlugin(sveltePluginConfiguration)] : []);

if (process.env.ENV === 'production') {
  plugins.push(visualizer({
    filename: path.join(projectRootPath, 'report.html'),
  }));
}

const viteConfig = defineConfig({
  root: process.env.ENV === 'test' ? srcPath : projectRootPath,
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
    passWithNoTests: true,
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      all: true,
      src: srcPath,
      allowExternal: true,
      exclude: ['**/__mocks__', '**/__tests__', '**/*.d.ts'],
    },
  },
  // Statically replaces environment variables in JS code.
  define: Object.keys(tsDevKitConfig.env?.[process.env.ENV] ?? {}).reduce((envVars, key) => (
    Object.assign(envVars, { [`process.env.${key}`]: JSON.stringify(tsDevKitConfig.env[process.env.ENV][key]) })
  ), {}),
  plugins,
});

export default viteConfig;
