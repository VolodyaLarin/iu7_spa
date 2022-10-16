<template>
  <div class="hello-avatar-component flex items-center">
    <div class="hello-avatar-component__avatar">
      <q-avatar size="100px">
        <q-img :src="avatar" v-if="avatar"></q-img>
        <q-img src="../assets/profile_image.svg" v-else></q-img>
      </q-avatar>
    </div>
    <div class="hello-avatar-component__body q-pl-md">
      <div class="hello-avatar-component__body__user">{{ name }}</div>
      <div class="hello-avatar-component__body__group">{{ group }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hello-avatar-component {
  &__body {
    &__user {
      font-weight: 500;
      font-size: 24px;
      line-height: 24px;
      padding: 5px;
    }
    &__group {
      padding: 5px;
      font-weight: 300;
      font-size: 18px;
      letter-spacing: 0.15px;
    }
  }
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    avatar: { type: String },
    name: { type: String },
    group: { type: String },
  },
});
</script>
