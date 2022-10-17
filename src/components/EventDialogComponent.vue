<template>
  <q-card @scroll="onScroll" v-if="event">
    <q-card-section
      class="row justify-evenly"
      :style="{
        maxHeight: isFullOpened ? '100vh' : '400px',
        transition: 'max-height .5s ease',
      }"
    >
      <event-form
        @save="saveEditEvent"
        @exit="discardEditEvent"
        v-model="event"
        v-if="isEditEvent"
      ></event-form>
      <template v-else>
        <div class="col-md-5 col-12 q-pb-md">
          <event-header-component
            :title="event.subject"
            :subtitle="event.theme"
            :state="event.visits.find((u)=>u.userId === userStore.user?.id) ? 'visited': ''"
          ></event-header-component>

          <event-chips-component
            :date="new Date(event.date)"
            :place="event.place"
            :speaker="event.speaker"
            :type="event.type"
            class="q-py-sm"
          >
          </event-chips-component>

          <md-editor preview-theme="github" :modelValue="event.description" previewOnly />
          <div class="q-mt-md" v-if="!canEditVisits && userStore.user?.role === 'leader'">
            <q-btn
              @click="editEvent"
              class="q-mr-sm"
              rounded
              label="Редактировать"
              color="positive"
            ></q-btn>
            <q-btn class="q-mr-sm" rounded label="Удалить" color="negative">
              <q-popup-proxy>
                <q-card>
                  <q-card-section class="q-pa-lg" style="max-width: 320px">
                    <div class="row no-wrap items-center q-pb-md">
                      <q-icon name="error" color="negative" size="50px"></q-icon>
                      <div class="q-pl-md text-medium">
                        Вы действительно хотите удалить данное мероприятие?
                      </div>
                    </div>

                    <q-btn
                      color="negative"
                      class="full-width"
                      no-caps
                      label="Да, я хочу удалить"
                      @click="deleteEvent"
                    ></q-btn>
                  </q-card-section>
                </q-card>
              </q-popup-proxy>
            </q-btn>
          </div>
        </div>
        <div class="col-md-5 col-12">
          <visits-students-components
            v-model="visitedIds"
            :students="students"
            :canEdit="canEditVisits"
          />

          <q-btn
            v-if="!canEditVisits && userStore.user?.role === 'leader'"
            @click="canEditVisits = true"
            class="q-mt-md"
            rounded
            label="Редактировать посещения"
            color="primary"
          />

          <q-btn
            v-if="canEditVisits"
            @click="saveVisits"
            class="q-mt-md"
            rounded
            label="Сохранить"
            color="positive"
          />
          <q-btn
            v-if="canEditVisits"
            @click="cancelVisits"
            class="q-mt-md"
            rounded
            label="Отмена"
            color="negative"
          />
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { IEvent, IEventService } from 'src/services/IEventService';
import { inject, defineProps, onMounted } from 'vue';

import MdEditor from 'src/components/MDEditor';
import { useStudentStore } from 'src/stores/student-store';
import { useUserStore } from 'src/stores/user-store';
import { computed, ref } from '@vue/reactivity';
import { Loading, Notify, scroll } from 'quasar';
import EventHeaderComponent from './EventHeaderComponent.vue';
import EventChipsComponent from './EventChipsComponent.vue';
import VisitsStudentsComponents from './VisitsStudentsComponents.vue';
import EventForm from './EventForm.vue';

const props = defineProps<{
  eventId: string;
}>();

const emit = defineEmits<{(e: 'close'): void; (e: 'updated'): void }>();

const eventService = inject<IEventService>('IEventService');
if (!eventService) {
  throw new Error('IEventService not provided');
}

const visitedIds = ref<string[]>([]);
const event = ref<IEvent | null>(null);

const resetVisits = () => {
  if (!event.value) return;
  visitedIds.value = event.value.visits.map((v) => String(v?.userId));
};

const loadEvent = async () => {
  try {
    event.value = await eventService.read(props.eventId);
    resetVisits();
  } catch {
    Notify.create({
      color: 'negative',
      message: 'Не удалось загрузить данные мероприятия',
    });
  }
};

loadEvent();

const store = useStudentStore();

const students = computed(() => store.students || []);

const canEditVisits = ref(false);

const saveVisits = async () => {
  Loading.show();
  try {
    await eventService.syncVisits(props.eventId, visitedIds.value);
    canEditVisits.value = false;
    emit('updated');
  } catch {
    Notify.create({
      color: 'negative',
      message: 'Не удалось сохранить посещения',
    });
  }
  Loading.hide();
  loadEvent();
};

const cancelVisits = () => {
  canEditVisits.value = false;
  resetVisits();
};

const isFullOpened = ref(false);
const isEditEvent = ref(false);

const onScroll = (e: Event & { target: HTMLDivElement }) => {
  if (isEditEvent.value) return;

  const { target } = e;
  if (isFullOpened.value && target.scrollTop < 1) {
    isFullOpened.value = false;
    scroll.animVerticalScrollTo(target, 0, 200);
    target.scrollTop = 0;
    setTimeout(() => {
      target.scrollTop = 0;
    }, 100);
  }
  if (!isFullOpened.value && target.scrollTop > 1) {
    isFullOpened.value = true;
    target.style.overflow = 'hidden';
    scroll.animVerticalScrollTo(target, 1, 300);
    setTimeout(() => {
      target.style.overflow = 'auto';
    }, 500);
  }
};

const editEvent = () => {
  isEditEvent.value = true;
  isFullOpened.value = true;
};

const saveEditEvent = async () => {
  if (!event.value) return;

  Loading.show();
  try {
    await eventService.update(props.eventId, event.value);
    isFullOpened.value = false;
    setTimeout(() => {
      isEditEvent.value = false;
      loadEvent();
    }, 300);
    emit('updated');
  } catch {
    Notify.create({
      color: 'negative',
      message: 'Не удалось изменить мероприятие',
    });
  }
  Loading.hide();
};
const discardEditEvent = async () => {
  Loading.show();
  isFullOpened.value = false;
  setTimeout(() => {
    isEditEvent.value = false;
    loadEvent();
  }, 100);

  Loading.hide();
};

const deleteEvent = async () => {
  Loading.show();
  try {
    await eventService.delete(props.eventId);
    emit('updated');
    emit('close');
    event.value = null;
    Notify.create({
      message: 'Мероприятие удалено',
    });
  } catch {
    Notify.create({
      color: 'negative',
      message: 'Произошла ошибка удаления',
    });
  }
  Loading.hide();
};

const userStore = useUserStore();
</script>
