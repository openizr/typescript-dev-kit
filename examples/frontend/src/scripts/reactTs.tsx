/* istanbul ignore file */

import 'styles/main.scss';
import * as React from 'react';
import Router from 'scripts/containers/Router';
import { createRoot, Root } from 'react-dom/client';

if (process.env.NODE_ENV === 'production') {
  console.log('PRODUCTION MODE'); // eslint-disable-line no-console
}
if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT MODE'); // eslint-disable-line no-console
}

let app: Root;

function main(): void {
  import('scripts/locale/en.json').then((locale) => {
    const AnyRouter = Router as JSXElement;
    app = createRoot(document.querySelector('#root') as HTMLElement);
    app.render(<AnyRouter locale={locale.default} />);
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
  app.unmount();
});
