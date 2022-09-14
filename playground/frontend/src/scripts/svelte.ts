import 'styles/main.scss';
import Router from 'scripts/containers/Router.svelte';

if (process.env.NODE_ENV === 'production') {
  console.log('PRODUCTION MODE'); // eslint-disable-line no-console
}
if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT MODE'); // eslint-disable-line no-console
}

function main(): void {
  import('scripts/locale/en.json').then((locale) => new Router({
    target: document.getElementById('root') as HTMLElement,
    props: { locale: locale.default },
  }));
}

// Ensures DOM is fully loaded before running app's main logic.
// Loading hasn't finished yet...
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
  // `DOMContentLoaded` has already fired...
} else {
  main();
}
