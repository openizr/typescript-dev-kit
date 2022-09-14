interface Routes {
  [path: string]: () => Promise<unknown>;
}

export default {
  '/': () => import('scripts/pages/Home'),
  '/vue': () => import('scripts/pages/HomePage.vue'),
  '/svelte': () => import('scripts/pages/Home.svelte'),
  '/js': () => import('scripts/pages/HomeJS'),
} as Routes;
