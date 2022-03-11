/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies, global-require */

process.env.ENV = 'production';

const path = require('path');
const fs = require('fs-extra');
const { build } = require('vite');
const esbuild = require('esbuild');
const colors = require('picocolors');
const sveltePlugin = require('esbuild-svelte');
const sveltePreprocess = require('svelte-preprocess');
const packageJson = require('../../../package.json');
const viteConfig = require('../config/vite.config');
const checkFiles = require('../helpers/checkFiles.js');
const fixNpmPackages = require('../helpers/fixNpmPackages.js');

const { log, error } = console;
const { tsDevKitConfig } = packageJson;
const projectRootPath = path.resolve(__dirname, '../../../');
const srcPath = path.join(projectRootPath, tsDevKitConfig.srcPath);
const distPath = path.join(projectRootPath, tsDevKitConfig.distPath);
const readmePath = path.join(projectRootPath, 'README.md');
const licensePath = path.join(projectRootPath, 'LICENSE');

/**
 * Runs `build` CLI command's script.
 */
async function run() {
  process.stdout.write('\x1Bc');

  await fixNpmPackages(projectRootPath);

  // Checking files...
  log(colors.magenta(colors.bold('Checking files...\n')));
  const runSvelteChecker = !!packageJson.dependencies?.svelte || !!packageJson.peerDependencies?.svelte;
  await checkFiles(projectRootPath, srcPath, runSvelteChecker, false);

  log(colors.magenta(colors.bold('Building...\n')));
  try {
    if (tsDevKitConfig.target === 'web') {
      // Front-end projects: we use Vite as a bundler.
      const publicAssetsPath = path.join(distPath, 'assets');
      const publicIndexHtmlPath = path.join(distPath, 'index.html');
      await fs.copy(path.resolve(srcPath, tsDevKitConfig.html), path.join(projectRootPath, 'index.html'));
      await fs.remove(publicIndexHtmlPath);
      await fs.remove(publicAssetsPath);
      await build(viteConfig);
      await fs.remove(distPath);
      await fs.remove(path.join(projectRootPath, 'index.html'));
      await fs.rename(path.join(projectRootPath, '__dist__'), distPath);
    } else {
      // Back-end/NPM package projects: we directly use esbuild.

      let vuePlugin = null;
      try {
        vuePlugin = require('esbuild-plugin-vue-next');
      } catch (e) {
        // No-op.
      }

      let startTimestamp = 0;
      await fs.remove(distPath);
      startTimestamp = Date.now();
      try {
        const result = await esbuild.build({
          entryPoints: Object.keys(tsDevKitConfig.entries).reduce((entrypoints, entrypoint) => ({
            ...entrypoints,
            [entrypoint]: path.join(srcPath, tsDevKitConfig.entries[entrypoint]),
          }), {}),
          loader: ['woff', 'woff2', 'eot', 'ttf', 'otf', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'mp4', 'webm', 'ogg', 'mp3', 'wav', 'flac', 'aac', 'scss', 'txt'].reduce((extensions, extension) => ({
            ...extensions, [`.${extension}`]: 'file',
          }), {}),
          banner: {
            js: tsDevKitConfig.banner,
            css: tsDevKitConfig.banner,
          },
          bundle: true,
          target: 'es6',
          minify: true,
          format: 'esm',
          platform: 'node',
          outdir: distPath,
          metafile: true,
          external: Object.keys(packageJson.dependencies)
            .concat(Object.keys(packageJson.peerDependencies || [])),
          sourcemap: true,
          plugins: [
            sveltePlugin({ compilerOptions: { css: true }, preprocess: sveltePreprocess() }),
          ].concat(vuePlugin !== null ? [vuePlugin()] : []),
        });
        const analysis = await esbuild.analyzeMetafile(result.metafile);
        log(analysis);
        // Writing distributable `package.json` file into `dist` directory...
        await fs.writeJson(path.join(distPath, 'package.json'), {
          name: packageJson.name,
          main: packageJson.main,
          type: packageJson.type,
          types: packageJson.types,
          bugs: packageJson.bugs,
          author: packageJson.author,
          version: packageJson.version,
          engines: packageJson.engines,
          license: packageJson.license,
          keywords: packageJson.keywords,
          homepage: packageJson.homepage,
          repository: packageJson.repository,
          description: packageJson.description,
          contributors: packageJson.contributors,
          dependencies: packageJson.dependencies,
          peerDependencies: packageJson.peerDependencies,
        }, { spaces: 2 });
        // Writing distributable `README.md` file into `dist` directory...
        const readmeExists = await fs.pathExists(readmePath);
        if (readmeExists) {
          await fs.copy(readmePath, path.resolve(distPath, 'README.md'));
        }
        // Writing distributable `LICENSE` file into `dist` directory...
        const licenseExists = await fs.pathExists(licensePath);
        if (licenseExists) {
          await fs.copy(licensePath, path.resolve(distPath, 'LICENSE'));
        }
        log(colors.green(`${colors.bold('\n[esbuild]: ')}Successfully built in ${Date.now() - startTimestamp}ms (${result.errors.length} errors, ${result.warnings.length} warnings).\n`));
      } catch (e) {
        error(colors.red(colors.bold('\n✖ [esbuild] Bundling failed:\n')));
        error(e);
      }
    }
  } catch (e) {
    error(colors.red(colors.bold('\n✖ Build failed:\n')));
    error(e);
  }
}

run();
