<template>
  <div class="row justify-left items-center">
    <q-avatar size="40px">
      <q-img :src="avatar" v-if="avatar"></q-img>
      <q-img src="../assets/profile_image.svg" v-else></q-img>
    </q-avatar>
    <div class="text-body1 q-pl-sm">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    avatar: { type: String },
    name: { type: String },
  },
});
</script>
