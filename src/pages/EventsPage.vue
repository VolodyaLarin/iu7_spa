<template>
  <q-layout>
    <div class="row">
      <logo-component title="Расписание"></logo-component>
    </div>
    <div class="row justify-center q-mb-md" style="margin-top: -60px">
      <q-btn-group rounded>
        <q-btn color="primary" rounded icon="navigate_before" @click="prevDay" />
        <q-btn color="primary" rounded no-caps class="full-width" :label="displayDay">
          <q-popup-proxy :breakpoint="100000000000" transition-show="scale" transition-hide="scale">
            <q-date v-model="day" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <q-btn color="primary" rounded icon="navigate_next" @click="nextDay" />
      </q-btn-group>
    </div>
    <q-page-sticky position="top-right" :offset="[18, 18]">
      <q-btn fab-mini color="primary" icon="more_vert">
        <q-popup-proxy>
          <q-card>
            <q-list>
              <q-item @click="addEventAction" clickable v-close-popup>
                <q-item-section> Добавить мероприятие </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-popup-proxy>
      </q-btn>
    </q-page-sticky>
    <div class="row column items-center">
      <event-card-component
        style="width: 700px; max-width: 100%"
        class="q-my-sm"
        v-for="event in events"
        :key="event.id"
        :title="event.subject"
        :theme="event.theme"
        :subtitle="event.theme"
        :speaker="event.speaker"
        :description="event.description"
        :place="event.place"
        :date="event.date"
        :type="event.type"
        :is-visited="!!event.visits.find((visit) => visit.userId == user?.id)"
        @headerClicked="openEventDialog(event)"
      >
      </event-card-component>
      <div v-if="!events.length" class="text-center">
        <q-img width="507px" style="max-width: 100vw" src="../assets/no_event_image.svg"></q-img>
        <div class="text-h4">Мероприятий не запланировано</div>
        <div class="text-body1 q-pt-sm q-pb-sm">
          В этот день Вы можете подготовиться к будущим мероприятиям
        </div>
        <div class="q-pt-md">
          <q-btn rounded color="positive" label="Синхронизировать расписание"></q-btn>
        </div>
      </div>
    </div>
    <q-dialog full-width v-model="isOpen" position="bottom" v-if="dialogEvent">
      <event-dialog @close="isOpen = false" :event-id="dialogEvent" />
    </q-dialog>
    <q-dialog full-width v-model="isAddingEvent" position="bottom" v-if="addEvent" persistent>
      <q-card>
        <q-card-section class="column items-center">
          <div class="text-h5 q-pb-md">Добавить мероприятие</div>
          <event-form
            v-model="addEvent"
            @exit="isAddingEvent = false"
            @save="createNewEvent"
          ></event-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script lang="ts" setup>
import EventCardComponent from 'src/components/EventCardComponent.vue';
import {
  inject, onMounted, ref, watch,
} from 'vue';
import LogoComponent from 'src/components/LogoComponent.vue';
import EventDialog from 'src/components/EventDialogComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { date, Loading, Notify } from 'quasar';
import { computed } from '@vue/reactivity';
import { IEvent, IEventService } from 'src/services/IEventService';
import { useUserStore } from 'src/stores/user-store';
import EventForm from 'src/components/EventForm.vue';
import { getDayFilter } from './helpers';

const isOpen = ref(false);
const route = useRoute();
const router = useRouter();

const day = computed({
  get: () => String(route.params.day),
  set: (v) => {
    router.push({
      name: String(route.name),
      params: {
        day: v,
      },
    });
  },
});

const displayDay = computed(() => date.formatDate(day.value, 'dddd DD.MM.YYYY').toUpperCase());

const events = ref<IEvent[]>([]);

const es = inject<IEventService>('IEventService');

const user = computed(() => useUserStore().getUser);

if (!es) {
  throw new Error('IEventService not provided');
}

const loadEvents = async () => {
  events.value = await es.filter(getDayFilter(day.value));
};

watch(
  route,
  () => {
    loadEvents();
  },
  {
    deep: true,
  },
);

onMounted(() => {
  loadEvents();
});

const nextDay = () => {
  day.value = date.formatDate(
    date.addToDate(day.value, {
      days: 1,
    }),
    'YYYY-MM-DD',
  );
};
const prevDay = () => {
  day.value = date.formatDate(
    date.addToDate(day.value, {
      days: -1,
    }),
    'YYYY-MM-DD',
  );
};

const dialogEvent = ref<null | string>(null);
const openEventDialog = (e: { id: string }) => {
  dialogEvent.value = e.id;
  isOpen.value = true;
};

const isAddingEvent = ref(false);
const addEvent = ref<IEvent | null>(null);

const store = useUserStore();
const addEventAction = () => {
  addEvent.value = {
    id: '',
    date: '',
    group: store.user?.contingent?.group || '',
    speaker: '',
    type: '',
    subject: '',
    place: '',
    theme: '',
    description: '',
    visits: [],
  };
  isAddingEvent.value = true;
};

const createNewEvent = async () => {
  if (!addEvent.value) return;

  Loading.show();
  try {
    const event = await es.insert(addEvent.value);
    isAddingEvent.value = false;
    openEventDialog(event);
  } catch {
    Notify.create({
      color: 'negative',
      message: 'Не удалось сохранить мероприятие',
    });
  }
  Loading.hide();
};
</script>
