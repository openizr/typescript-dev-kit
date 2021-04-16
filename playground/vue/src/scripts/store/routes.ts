/* istanbul ignore file */

interface Routes {
  [path: string]: () => Promise<unknown>;
}

export default {
  '/': () => import('scripts/pages/Home.vue'),
} as Routes;
