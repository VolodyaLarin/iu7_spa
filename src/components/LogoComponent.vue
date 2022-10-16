<template>
  <div class="logo-component flex q-pa-md items-center">
    <q-btn to="/" dense flat class="q-pa-none" rounded>
      <q-img width="45px" src="../assets/logo.svg"></q-img>
    </q-btn>
    <div class="logo-component__title">
      {{ title }}
    </div>
  </div>
</template>

<style lang="scss">
.logo-component {
  &__title {
    font-size: 32px;
    padding-left: 14px;
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LogoComponent',
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
  },
});
</script>
