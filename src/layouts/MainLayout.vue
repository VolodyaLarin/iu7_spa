<template>
  <q-layout view="lHh Lpr lFf">
    <LogoComponent :title="$route.meta.title"></LogoComponent>

    <q-page-container>
      <router-view v-if="store.status == 'loaded'" />
      <IndexPage v-else />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LogoComponent from 'src/components/LogoComponent.vue';
import { useUserStore } from 'src/stores/user-store';
import IndexPage from 'src/pages/IndexPage.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    LogoComponent,
    IndexPage,
  },

  setup() {
    const store = useUserStore();

    return {
      store,
    };
  },
});
</script>
