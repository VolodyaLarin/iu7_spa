<template>
  <div style="width: 800px; max-width: 100%">
    <q-form @submit="emit('save')">
      <q-input
        :rules="[required]"
        class="q-pb-sm"
        outlined
        v-model="form.speaker"
        label="Преподаватель"
      ></q-input>
      <q-select
        :rules="[required]"
        class="q-pb-sm"
        outlined
        v-model="form.type"
        :options="typeOptions"
        label="Тип мероприятия"
      />
      <q-input
        :rules="[required]"
        class="q-pb-sm"
        outlined
        v-model="formDate"
        mask="##.##.#### ##:##"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="formDate" mask="DD.MM.YYYY HH:mm" />
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="formDate" mask="DD.MM.YYYY HH:mm" format24h />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        class="q-pb-sm"
        :rules="[required]"
        outlined
        v-model="form.subject"
        label="Название"
      ></q-input>
      <q-input class="q-pb-sm" outlined v-model="form.theme" label="Тема"></q-input>
      <q-input
        class="q-pb-sm"
        :rules="[required]"
        outlined
        v-model="form.place"
        label="Место"
      ></q-input>

      <q-btn
        class="q-pb-sm"
        color="positive"
        dense
        flat
        icon="add"
        v-if="!form.description && !addForceDesc"
        label="Добавить описание"
        @click="addForceDesc = true"
      ></q-btn>
      <MdEditor class="q-pb-sm" v-else language="en-US" v-model="form.description"></MdEditor>

      <div class="q-pt-md">
        <q-btn class="q-mr-sm" color="positive" type="submit" label="Сохранить изменения" />
        <q-btn class="q-mr-sm" color="primary" label="Отмена" @click="emit('exit')" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { IEvent } from 'src/services/IEventService';
import 'md-editor-v3/lib/style.css';

import MdEditor from 'md-editor-v3';
import { date } from 'quasar';

const props = defineProps<{
  modelValue: IEvent;
}>();

const emit = defineEmits<{(e: 'update:modelValue', value: IEvent): void;
  (e: 'save'): void;
  (e: 'exit'): void;
}>();

const form = computed<IEvent>({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const formDate = computed<string>({
  get: () => date.formatDate(form.value.date, 'DD.MM.YYYY HH:mm'),
  set: (value: string) => {
    form.value.date = date.extractDate(value, 'DD.MM.YYYY HH:mm').toUTCString();
  },
});

const typeOptions = ['Семинар', 'Лабораторная работа', 'Лекция', 'Консультация', 'Экзамен'];

const addForceDesc = ref(false);

const required = (val: string) => !!val || '';
</script>
