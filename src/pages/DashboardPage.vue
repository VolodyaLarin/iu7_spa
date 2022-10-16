<template>
  <q-page style="max-width: 1200px; margin: auto">
    <div class="q-pa-md">
      <hello-avatar-component
        v-if="user?.contingent"
        :avatar="user.photo"
        :name="`Привет ${user.contingent.name}!`"
        :group="user.contingent.group"
      ></hello-avatar-component>
    </div>

    <div class="row">
      <div class="col-12 col-md-6 q-pa-md">
        <div class="text-h5">Мероприятия сегодня</div>
        <event-card-component
          class="q-my-sm"
          v-for="event in events"
          @headerClicked="openEvent(event.id)"
          :key="event.id"
          :title="event.subject"
          :subtitle="event.theme"
          :speaker="event.speaker"
          :description="event.description"
          :place="event.place"
          :type="event.type"
          :date="event.date"
        ></event-card-component>
        <q-btn
          color="primary"
          label="Посмотреть другие дни"
          :to="{
            name: 'calendar.day.view.redirect',
          }"
        ></q-btn>
      </div>
      <div class="col-12 col-md-6 q-pa-md">
        <event-header-component size="90px" title="У Вас отличная посещаемость!" class="q-pb-md">
          <div class="q-pb-sm">
            Вы посетили 90% мероприятий <br />
            Вы посетили 9 из 10 мероприятий
          </div>
          <div style="font-family: 'Roboto'; font-weight: 300; font-size: 10px; line-height: 11px">
            * Данные представлены за последний месяц
          </div>
        </event-header-component>
        <event-header-component
          size="90px"
          title="Карточка студента не заполнена"
          subtitle="Помогите старосте заполнить Ваши данные"
          class="q-pb-md"
        >
          <q-btn color="positive" class="q-mt-sm" label="Заполнить"></q-btn>
        </event-header-component>

        <div class="text-h5 q-pt-md">Сервисы</div>
        <div class="flex">
          <q-btn
            :to="{
              name: 'profile.view',
            }"
            class="q-ma-sm"
            color="primary"
            label="Профиль"
          ></q-btn>
          <q-btn
            class="q-ma-sm"
            color="primary"
            v-if="role == 'leader'"
            :to="{
              name: 'table.view',
            }"
            label="Посещаемость"
          ></q-btn>
          <q-btn
            class="q-ma-sm"
            color="primary"
            v-if="role == 'leader'"
            :to="{
              name: 'students.view',
            }"
            label="Карточки студентов"
          ></q-btn>
        </div>
      </div>
    </div>

    <q-dialog full-width v-model="isOpen" position="bottom" v-if="dialogEvent">
      <event-dialog-component :event-id="dialogEvent" />
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import EventHeaderComponent from 'src/components/EventHeaderComponent.vue';
import EventCardComponent from 'src/components/EventCardComponent.vue';
import HelloAvatarComponent from 'src/components/HelloAvatarComponent.vue';
import { useUserStore } from 'src/stores/user-store';
import { computed } from '@vue/reactivity';
import { IEvent, IEventService } from 'src/services/IEventService';
import EventDialogComponent from 'src/components/EventDialogComponent.vue';
import { getDayFilter } from './helpers';

const isOpen = ref(false);
const dialogEvent = ref('');

const openEvent = (id: string) => {
  dialogEvent.value = id;
  isOpen.value = true;
};

const store = useUserStore();

const user = computed(() => store.getUser);
const role = computed(() => store.getRole);
const events = ref<IEvent[]>([]);

const es = inject<IEventService>('IEventService');

if (!es) {
  throw new Error('IEventService not provided');
}

const loadEvents = async () => {
  events.value = await es.filter(getDayFilter(new Date()));
};
loadEvents();
</script>
