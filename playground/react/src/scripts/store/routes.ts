/* istanbul ignore file */

interface Routes {
  [path: string]: () => Promise<unknown>;
}

export default {
  '/': () => import('scripts/pages/Home'),
  '/js': () => import('scripts/pages/HomeJS'),
} as Routes;
