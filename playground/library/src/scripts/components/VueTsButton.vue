<template>
  <button>{{ label }}</button>
</template>

<script>
import Vue from 'vue';

/**
 * Button.
 */
export default Vue.extend({
  name: 'VueJsButton',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
});
</script>
