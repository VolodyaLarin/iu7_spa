<template>
  <q-page>
    <div class="row" v-if="userStore.user" style="width: 900px; margin: auto; max-width: 100%">
      <div class="col-md-2 col-12">
        <q-avatar size="100px">
          <q-img :src="userStore.user?.photo" v-if="userStore.user?.photo"></q-img>
          <q-img src="../assets/profile_image.svg" v-else></q-img>
        </q-avatar>

        <q-btn
          @click="userStore.logout"
          style="width: 100px"
          class="q-mt-md"
          color="negative"
          label="Выйти"
        ></q-btn>
      </div>
      <div class="col-md-10 col-12">
        <div class="text-h4">
          {{ userStore.user?.contingent?.name }}
          {{ userStore.user?.contingent?.surname }}
        </div>

        <div class="row">
          <div class="col-md-6 col-12 q-pt-md q-pr-md" v-if="userStore.user.contingent">
            <div class="text-body1">Данные из ЭУ</div>
            <q-input
              class="q-my-sm"
              readonly
              outlined
              label="Фамилия"
              :model-value="userStore.user.contingent.surname"
            ></q-input>
            <q-input
              class="q-my-sm"
              readonly
              outlined
              label="Имя"
              :model-value="userStore.user.contingent.name"
            ></q-input>
            <q-input
              class="q-my-sm"
              readonly
              outlined
              label="Отчество"
              :model-value="userStore.user.contingent.secname"
            ></q-input>
            <q-input
              class="q-my-sm"
              readonly
              outlined
              label="Дата рождения"
              :model-value="date.formatDate(userStore.user.contingent.birthday, 'DD.MM.YYYY')"
            ></q-input>
            <q-input
              class="q-my-sm"
              readonly
              outlined
              label="Группа"
              :model-value="userStore.user.contingent.group"
            ></q-input>
            <q-input
              class="q-my-sm"
              readonly
              outlined
              label="Номер студбилета"
              :model-value="userStore.user.contingent.login"
            ></q-input>
            <q-input
              class="q-my-sm"
              readonly
              outlined
              label="Почта МГТУ"
              :model-value="`${userStore.user.login}@student.bmstu.ru`"
            ></q-input>
          </div>
          <div class="col-md-6 col-12 q-pt-md q-pl-md">
            <div class="text-body1">Карточка студента</div>
            <q-input
              v-for="field in fields"
              :key="field.fieldName"
              class="q-my-sm"
              outlined
              :label="field.fieldLabel"
              v-model="student[field.fieldName]"
              @update:model-value="startEditing = true"
            ></q-input>
            <div v-if="startEditing" class="q-pt-md">
              <q-btn label="Сохранить" @click="saveStudent" class="q-mr-sm" color="positive" />
              <q-btn label="Отмена" @click="resetStudent" color="primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { IField, IFieldService } from 'src/services/IFieldsService';
import { useUserStore } from 'src/stores/user-store';
import { inject, ref, watch } from 'vue';

import { date, Loading, Notify } from 'quasar';
import { IAuthService } from 'src/services/IAuthService';
import { IStudentService } from 'src/services/IStudentService';

const userStore = useUserStore();

const fields = ref<IField[]>();

const fieldService = inject<IFieldService>('IFieldService');
if (!fieldService) {
  throw new Error('IFieldService not provided');
}

const authService = inject<IAuthService>('IAuthService');
if (!authService) {
  throw new Error('IAuthService not provided');
}

const studentService = inject<IStudentService>('IStudentService');
if (!studentService) {
  throw new Error('IStudentService not provided');
}

const loadFields = async () => {
  fields.value = await fieldService.getFields();
};
loadFields();
const student = ref<Record<string, string>>({});

const startEditing = ref(false);

const resetStudent = () => {
  student.value = { ...userStore.user?.student };
  startEditing.value = false;
};
watch(userStore, resetStudent);
resetStudent();

const saveStudent = async () => {
  if (!userStore.user) return;
  Loading.show();
  try {
    await studentService.update(userStore.user.id, student.value);
    await userStore.loadUser(authService);
    Notify.create({
      color: 'positive',
      message: 'Изменения сохранены',
    });
  } catch {
    Notify.create({
      color: 'negative',
      message: 'Не удалось сохранить карточку студента',
    });
  }
  Loading.hide();
};
</script>
