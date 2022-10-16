<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    <div>
      <q-img src="../assets/not-found.svg"></q-img>

      <div style="font-size: 15vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Страница не найдена
      </div>

      <q-btn
        class="q-mt-xl"
        color="primary"
        unelevated
        to="/"
        label="На главную"
        no-caps
        size="lg"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorNotFound',
});
</script>
