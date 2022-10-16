<template>
  <div
    class="brand-circle-component"
    :style="{
      width: size,
      minWidth: size,
      height: size,
      minHeight: size,
    }"
  >
    <div
      class="brand-circle-component__sub-circle"
      :style="{
        background: color,
      }"
    ></div>
    <div
      class="brand-circle-component__main-circle"
      :style="{
        background: color,
      }"
    ></div>
  </div>
</template>

<style lang="scss">
.brand-circle-component {
  position: relative;

  &__main-circle,
  &__sub-circle {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 100%;
  }
  &__main-circle {
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }
  &__sub-circle {
    width: 50%;
    height: 50%;
    top: 25%;
    left: 25%;
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BrandCircleComponent',
  props: {
    color: {
      type: String,
      required: false,
      default: '#0056cc',
    },
    size: {
      type: String,
      required: false,
      default: '60px',
    },
  },
});
</script>
