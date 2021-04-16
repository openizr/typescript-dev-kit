<template>
  <component
    :is="componentName"
    v-if="componentName !== undefined"
    :translate="translate"
  />
</template>

<script lang="ts">
import { i18n } from 'basx';
import store from 'scripts/store';
import routes from 'scripts/store/routes';
import connect from 'diox/connectors/vuejs';

interface Locale {
  [label: string]: string;
}

const lazyComponents = Object.keys(routes).reduce((mapping, route, index) => ({
  ...mapping,
  [route]: `Component${index}`,
}), {}) as { [name: string]: string; };

/**
 * App router.
 */
export default connect(store, { router: (newState) => ({ route: newState.route }) })(() => ({
  name: 'Router',
  components: Object.keys(routes).reduce((components, route) => ({
    ...components,
    [lazyComponents[route]]: routes[route],
  }), {}),
  props: {
    locale: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      route: '',
    };
  },
  computed: {
    translate(): (label: string) => string {
      return i18n((this as unknown as { locale: Locale; }).locale);
    },
    componentName(): string {
      return lazyComponents[(this as unknown as { route: string; }).route];
    },
  },
}));
</script>
