<template>
  <div>
    <div class="flex items-center">
      <logo-component title="Карточки студентов"></logo-component>
      <q-btn class="q-mr-sm" @click="isEditingFields = true" label="Изменить поля"></q-btn>
      <q-btn class="q-mr-sm" label="Изменить отображение полей">
        <q-popup-proxy>
          <q-card>
            <q-card-section>
              <div v-for="(column, i) in columns" :key="i">
                <q-toggle
                  v-model="visibleColumns"
                  :val="column.name"
                  :label="column.label"
                  keep-color
                ></q-toggle>
              </div>
              <q-btn label="Включить все поля" @click="showAllColumns"></q-btn>
            </q-card-section>
          </q-card>
        </q-popup-proxy>
      </q-btn>
    </div>

    <q-table
      separator="cell"
      flat
      dense
      bordered
      :rows="students"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      :rows-per-page-options="[0, 5, 10, 20, 30]"
    >
      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ props.value }}
          <q-popup-edit
            :model-value="props.value"
            @update:model-value="(v) => saveStudent(props.row, String(props.col.name), v)"
            v-if="props.col.canEdit"
            auto-save
            v-slot="scope"
          >
            <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
          </q-popup-edit>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="isEditingFields" persistent position="bottom">
      <q-card class="full-width">
        <q-card-section class="flex justify-between items-center">
          <div class="text-h6">Редактирование полей</div>
          <q-btn fab-mini icon="close" flat v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-pb-lg" v-for="(field, i) in fields" :key="i">
            <q-select
              outlined
              label="Тип поля"
              v-model="field.fieldType"
              :options="[{ value: 'string', label: 'Строка' }]"
              map-options
              emit-value
            ></q-select>
            <q-input outlined label="Служебное имя" v-model="field.fieldName"></q-input>
            <q-input outlined label="Название поля" v-model="field.fieldLabel"></q-input>
            <q-btn
              dense
              label="Удалить поле"
              no-caps
              class="full-width"
              align="left"
              flat
              icon="delete"
              @click="fields.splice(i, 1)"
            ></q-btn>
          </div>
          <q-btn
            @click="
              fields.push({
                fieldType: 'string',
                fieldName: '',
                fieldLabel: '',
              })
            "
            flat
            color="primary"
            dense
            icon="add"
            label="Добавить поле"
          ></q-btn>
        </q-card-section>

        <q-card-actions align="left">
          <q-btn label="Сохранить" color="positive" @click="saveFields" />
          <q-btn label="Закрыть" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { date, Notify } from 'quasar';
import { IUser } from 'src/services/IAuthService';
import { IStudentService } from 'src/services/IStudentService';
import { inject, onMounted, ref } from 'vue';
import LogoComponent from 'src/components/LogoComponent.vue';
import { IField, IFieldService } from 'src/services/IFieldsService';

const isEditingFields = ref(false);
const students = ref<IUser[]>([]);
const fields = ref<IField[]>([]);

const visibleColumns = ref<string[]>([]);

const ss = inject<IStudentService>('IStudentService');
if (!ss) {
  throw new Error('IStudentService not provided');
}

const fs = inject<IFieldService>('IFieldService');
if (!fs) {
  throw new Error('IFieldService not provided');
}

const loadStudents = async () => {
  students.value = await ss.filter({});
  fields.value = await fs.getFields();
};

const saveStudent = async (user: IUser, col: string, value: string) => {
  try {
    const patch: Record<string, string> = {};
    patch[col] = value;
    await ss.update(user.id, patch);

    loadStudents();
  } catch {
    Notify.create({
      color: 'negative',
      message: 'Произошла ошибка сохранения пользователя',
    });
  }
};

const columns = computed(() => [
  {
    name: 'id',
    align: 'left',
    label: 'ID',
    field: 'id',
    sortable: true,
  },
  {
    name: 'fio',
    align: 'left',
    label: 'ФИО',
    field: (t: IUser) => {
      const c = t.contingent;
      if (!c) return '';
      return `${c.surname} ${c.name} ${c.secname}`;
    },
    sortable: true,
  },
  {
    name: 'login',
    align: 'left',
    label: 'СтудБилет',
    field: (t: IUser) => t.contingent?.login,
    sortable: true,
  },
  {
    name: 'birthday',
    align: 'left',
    label: 'Дата рождения',
    field: (t: IUser) => date.formatDate(t.contingent?.birthday, 'DD.MM.YYYY'),
    sortable: true,
  },
  {
    name: 'corp_email',
    align: 'left',
    label: 'Бауманская почта',
    field: (t: IUser) => `${t.login}@student.bmstu.ru`,
    sortable: true,
  },
  ...fields.value.map((f) => ({
    name: f.fieldName,
    align: 'left',
    label: f.fieldLabel,
    field: (t: IUser) => (t.student ? t.student[f.fieldName] : null),
    sortable: true,
    canEdit: true,
  })),
]);

const showAllColumns = () => {
  visibleColumns.value = columns.value.map((x) => x.name);
};

const saveFields = () => {
  fs.updateFields(fields.value).then(() => {
    isEditingFields.value = false;
    loadStudents();
    showAllColumns();
  });
};

onMounted(() => {
  loadStudents().then(() => {
    showAllColumns();
  });
});
</script>
