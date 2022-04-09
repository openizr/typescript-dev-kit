/* istanbul ignore file */

import { defineAsyncComponent } from 'vue';

interface Routes {
  [path: string]: () => Promise<unknown>;
}

export default {
  '/': () => import('scripts/pages/Home'),
  '/vue': defineAsyncComponent(() => import('scripts/pages/Home.vue')),
  '/svelte': () => import('scripts/pages/Home.svelte'),
  '/js': () => import('scripts/pages/HomeJS'),
} as Routes;
