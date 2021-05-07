<template>
  <component
    :is="componentName"
    v-if="componentName !== undefined"
    :translate="translate"
  />
</template>

<script>
import { i18n } from 'basx';
import store from 'scripts/store';
import routes from 'scripts/store/routes';
import useStore from 'diox/connectors/vue';

const [useCombiner] = useStore(store);
const lazyComponents = Object.keys(routes).reduce((mapping, route, index) => ({
  ...mapping,
  [route]: `Component${index}`,
}), {});

/**
 * App router.
 */
export default useCombiner('router', {
  name: 'RouterJS',
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
    translate() {
      return i18n(this.locale);
    },
    componentName() {
      return routes[this.route];
    },
  },
});
</script>
