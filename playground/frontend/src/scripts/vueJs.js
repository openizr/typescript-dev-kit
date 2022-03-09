/* istanbul ignore file */

import 'styles/main.scss';
import { createApp } from 'vue';
import Router from 'scripts/containers/Router.vue';

if (process.env.NODE_ENV === 'production') {
  console.log('PRODUCTION MODE'); // eslint-disable-line no-console
}
if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT MODE'); // eslint-disable-line no-console
}

function main() {
  import('scripts/locale/en.json').then((locale) => {
    createApp(Router, { locale: locale.default }).mount('#root');
  });
}

// Ensures DOM is fully loaded before running app's main logic.
// Loading hasn't finished yet...
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
  // `DOMContentLoaded` has already fired...
} else {
  main();
}
