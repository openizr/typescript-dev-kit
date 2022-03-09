/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies, global-require */

process.env.ENV = 'development';

const path = require('path');
const fs = require('fs-extra');
const esbuild = require('esbuild');
const colors = require('picocolors');
const { spawn } = require('child_process');
const sveltePlugin = require('esbuild-svelte');
const { send } = require('vite/dist/node/index.js');
const vitePackageJson = require('vite/package.json');
const sveltePreprocess = require('svelte-preprocess');
const { createServer, createLogger } = require('vite');
const packageJson = require('../../../package.json');
const viteConfig = require('../config/vite.config');
const fixNpmPackages = require('../helpers/fixNpmPackages.js');

let nodeProcess = null;
const { log, error } = console;
const { tsDevKitConfig } = packageJson;
const projectRootPath = path.resolve(__dirname, '../../../');
const srcPath = path.join(projectRootPath, tsDevKitConfig.srcPath);
const distPath = path.join(projectRootPath, tsDevKitConfig.distPath);
const random = () => Math.floor(Math.random() * 10);

/**
 * Runs `dev` CLI command's script.
 */
async function run() {
  await fixNpmPackages(projectRootPath);

  if (tsDevKitConfig.target === 'web') {
    // Front-end projects: we use Vite as a dev server.
    // We manually create the dev server as we want to get control over its built-in
    // middlewares (404 and indexHtml).
    try {
      const server = await createServer(viteConfig);

      // We replace Vite's built-in indexHtml middleware to provide a wider catch-all routing logic,
      // and serve a pre-processed `index.html` located wherever we want.
      server.middlewares.stack.splice(server.middlewares.stack.length - 3, 1, {
        route: '',
        handle: async function customViteIndexHtmlMiddleware(request, response, next) {
          if (response.writableEnded) {
            return next();
          }

          try {
            // IF WE EVER NEED IT: special markup syntax regexp is
            // /<__TDK_PRODUCTION__>((?!__TDK_PRODUCTION__)(\n|.)*?)<\/__TDK_PRODUCTION__>/m
            // p1.trim().replace(/\n\s+/g, '');
            const indexHtmlPath = path.join(srcPath, tsDevKitConfig.html);
            let html = await fs.readFile(indexHtmlPath, 'utf-8');
            html = await server.transformIndexHtml(request.url, html, request.originalUrl);
            return send(request, response, html, 'html', { headers: server.config.server.headers });
          } catch (e) {
            return next(e);
          }
        },
      });

      if (!server.httpServer) {
        throw new Error('HTTP server not available');
      }

      await server.listen();

      const { info } = server.config.logger;

      info(
        colors.cyan(`\n  vite v${vitePackageJson.version}`)
         + colors.green(' dev server running at:\n'),
        { clear: !server.config.logger.hasWarned },
      );

      server.printUrls();
      info('');

      if (global.__vite_start_time) { // eslint-disable-line no-underscore-dangle
        // eslint-disable-next-line no-underscore-dangle
        const startupDuration = performance.now() - global.__vite_start_time;
        info(`\n  ${colors.cyan(`ready in ${Math.ceil(startupDuration)}ms.`)}\n`);
      }
    } catch (e) {
      createLogger(viteConfig.logLevel).error(
        colors.red(`error when starting dev server:\n${e.stack}`),
        { error: e },
      );
      process.exit(1);
    }
  } else {
    // Back-end/NPM package projects: we directly use esbuild in watch mode.
    let startTimestamp = 0;
    const tsDevKitPlugin = {
      name: 'tsDevKit',
      setup(build) {
        build.onStart(() => {
          process.stdout.write('\x1Bc');
          // Used to display build time.
          startTimestamp = Date.now();
        });
        build.onEnd((result) => {
          if (result.errors.length === 0) {
            // Writing distributable `package.json` file into `dist` directory...
            fs.writeJsonSync(path.join(distPath, 'package.json'), {
              name: packageJson.name,
              main: packageJson.main,
              types: packageJson.types,
              bugs: packageJson.bugs,
              author: packageJson.author,
              // This trick forces invalidating NPM cache and allows real-time package testing.
              version: [random(), random(), random()].join('.'),
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

            // Executing main entrypoint if necessary (this is especially useful when developing
            // a NodeJS server for instance)...
            if (tsDevKitConfig.runInDev === true) {
              if (nodeProcess !== null) {
                nodeProcess.kill('SIGKILL');
                nodeProcess = null;
              }
              nodeProcess = spawn('node', ['--enable-source-maps', path.join(distPath, packageJson.main)]);
              nodeProcess.stdout.on('data', (data) => {
                log(`${data.toString()}\n`);
              });
              nodeProcess.stderr.on('data', (data) => {
                error(colors.red(colors.bold('✖ Error occurred in main entry:\n')));
                error(`${data.toString().trim()}\n`);
              });
              nodeProcess.on('error', (...args) => {
                error(colors.red(colors.bold('✖ Could not run main entry:\n')));
                error(args[0]);
                error('');
              });
            }
          }
        });
      },
    };

    await fs.remove(distPath);
    const displayOutput = (e, result) => {
      if (e) {
        error(colors.red(colors.bold('✖ [esbuild] Build failed:\n')));
        error(error);
      } else {
        log(colors.green(`${colors.bold('[esbuild]: ')}Successfully built in ${Date.now() - startTimestamp}ms (${result.errors.length} errors, ${result.warnings.length} warnings).\n`));
      }
    };

    let vuePlugin = null;
    try {
      vuePlugin = require('esbuild-plugin-vue-next');
    } catch (e) {
      // No-op.
    }

    startTimestamp = Date.now();
    const result = await esbuild.build({
      entryPoints: Object.keys(tsDevKitConfig.entries).reduce((entrypoints, entrypoint) => ({
        ...entrypoints,
        [entrypoint]: path.join(srcPath, tsDevKitConfig.entries[entrypoint]),
      }), {}),
      loader: ['woff', 'woff2', 'eot', 'ttf', 'otf', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'mp4', 'webm', 'ogg', 'mp3', 'wav', 'flac', 'aac', 'scss', 'txt'].reduce((extensions, extension) => ({
        ...extensions, [`.${extension}`]: 'file',
      }), {}),
      bundle: true,
      target: 'es6',
      format: 'esm',
      minify: false,
      platform: 'node',
      outdir: distPath,
      external: Object.keys(packageJson.dependencies)
        .concat(Object.keys(packageJson.peerDependencies || [])),
      watch: {
        onRebuild: displayOutput,
      },
      sourcemap: true,
      plugins: [
        tsDevKitPlugin,
        sveltePlugin({ compilerOptions: { css: true }, preprocess: sveltePreprocess() }),
      ].concat(vuePlugin !== null ? [vuePlugin()] : []),
    });
    displayOutput(null, result);
  }
}

run();
