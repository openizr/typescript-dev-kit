<template>
  <message :label="translate('LABEL_TEST')" />
</template>

<script lang="ts">
import Message from 'scripts/components/Message.vue';

/**
 * Home page.
 */
export default {
  name: 'HomePage',
  components: {
    Message,
  },
  props: {
    translate: {
      type: Function,
      required: true,
    },
  },
};
</script>
