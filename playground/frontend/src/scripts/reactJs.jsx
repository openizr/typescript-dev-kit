/* istanbul ignore file */

import 'styles/main.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RouterJS from 'scripts/containers/RouterJS';

if (process.env.NODE_ENV === 'production') {
  console.log('PRODUCTION MODE'); // eslint-disable-line no-console
}
if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT MODE'); // eslint-disable-line no-console
}

function main() {
  import('scripts/locale/en.json').then((locale) => {
    ReactDOM.render(<RouterJS locale={locale.default} />, document.querySelector('#root'));
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

// Ensures subscriptions to Store are correctly cleared when page is left, to prevent "ghost"
// processing, by manually unmounting React components tree.
window.addEventListener('beforeunload', () => {
  ReactDOM.unmountComponentAtNode(document.querySelector('#root'));
});
