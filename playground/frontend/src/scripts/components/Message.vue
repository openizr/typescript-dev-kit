<template>
  <p>
    <img
      alt="test"
      :src="testJpg"
    >
    <img
      alt="test"
      :src="testSvg"
    >
    {{ label }}
  </p>
</template>

<script lang="ts">
import testJpg from 'images/test.jpg';
import testSvg from 'images/test.svg';

/**
 * Simple message.
 */
export default {
  name: 'VueMessage',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      testJpg, testSvg,
    };
  },
};
</script>

<style scoped>
img {
  display: block;
  width: 50px;
  height: 50px;
}
</style>
