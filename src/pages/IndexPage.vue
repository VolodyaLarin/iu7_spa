<template>
  <q-page style="max-width: 1100px; margin: auto" class="q-pa-sm">
    <div class="row items-center">
      <q-img class="col-md-5 col-0" src="../assets/landing_image.png"></q-img>
      <div class="col-md-7 col-12">
        <div class="text-h4 q-pb-sm q-pt-md">ИУ7.РФ - пространство твоей группы</div>
        <q-btn color="positive" label="Войти через МГТУ" @click="openAuth"></q-btn>
        <div class="text-body2 q-pt-sm">
          Нажимая кнопку войти, вы соглашаетесь с политикой конфедициальности и правилами
          использования сервиса ИУ7.РФ
        </div>
        <div class="text-h5 q-pt-xl q-pb-sm">Что такое ИУ7.РФ?</div>
        <div class="text-body1">
          Данный проект призван помочь старосте с рутинными задачами, такими как заполнение журнала
          или сбор данных для деканата.
        </div>
      </div>
    </div>

    <div class="q-pt-lg">
      <div class="text-h5">Преимущества платформы</div>

      <div class="row">
        <event-header-component
          v-for="(p, i) in preferences"
          :key="i"
          size="90px"
          class="col-md-6 col-12 q-pt-md"
          :title="p.title"
          :subtitle="p.description"
          state="visited"
        />
      </div>
    </div>

    <div class="q-pt-lg">
      <div class="text-h5">Как подключить свою группу?</div>
      <div class="text-body2 q-py-md">
        Подключение максимально простое:<br />
        <br />
        1) необходимо быть старостой группы <br />
        2) необходимо заполнить форму<br />
        3) необходимо пригласить на платформу одногруппников<br />
      </div>
      <q-btn color="positive" label="Оставить заявку на подключение"></q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import EventHeaderComponent from 'src/components/EventHeaderComponent.vue';
import preferences from 'src/preferences.js';
import { IAuthService } from 'src/services/IAuthService';

export default defineComponent({
  name: 'IndexPage',
  components: {
    EventHeaderComponent,
  },
  setup() {
    const authService = inject<IAuthService>('IAuthService');
    if (!authService) {
      throw new Error('IAuthService not provided');
    }

    const openAuth = () => {
      const authServiceUrl = authService.getAuthEndpoint();
      window.open(authServiceUrl, '_blank', 'popup=yes');

      // window.location.href = authServiceUrl;
    };
    return { preferences, openAuth };
  },
});
</script>
