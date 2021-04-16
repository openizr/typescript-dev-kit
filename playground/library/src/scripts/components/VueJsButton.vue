<template>
  <button>{{ label }}</button>
</template>

<script lang="ts">
import Vue from 'vue';

/**
 * Button.
 */
export default Vue.extend({
  name: 'VueTsButton',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
});
</script>
