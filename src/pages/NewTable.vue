<template>
  <q-page>
    <q-table
      class="my-sticky-header-table"
      title="Группа"
      dense
      :rows="data"
      :columns="columns"
      row-key="id"
      flat
      separator="cell"
      v-model:pagination="pagination"
    >
      <template v-slot:top>
        <div class="col-12 flex">
          <q-btn @click="showFilters = true" push color="primary" label="Показать фильтры"></q-btn>
          <q-dialog full-height :breakpoint="600" v-model="showFilters">
            <div class="q-pa-lg bg-white">
              <p class="text-h5 text-center">Фильтры</p>
              <div class="row q-col-gutter-lg justify-around">
                <div class="col-auto" style="width: 350px">
                  <q-input
                    outlined
                    v-model="filters.date.$gt"
                    mask="##.##.####"
                    label="От"
                    fill-mask
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-date v-model="filters.date.$gt" mask="DD.MM.YYYY" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    v-model="filters.date.$lt"
                    mask="##.##.####"
                    label="До"
                    fill-mask
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-date v-model="filters.date.$lt" mask="DD.MM.YYYY" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-auto" style="width: 350px">
                  <p>
                    <q-select
                      multiple
                      v-model="filters.subject"
                      label="Предмет"
                      :options="options.name"
                      outlined
                    >
                    </q-select>
                    <q-select
                      multiple
                      outlined
                      v-model="filters.type"
                      label="Тип занятия"
                      :options="options.type"
                    >
                    </q-select>
                  </p>
                </div>
              </div>
            </div>
          </q-dialog>
          <q-space />

          <q-btn flat icon="sync" @click="update"></q-btn>
          <q-btn color="primary" icon-right="download" label="CSV" no-caps @click="exportTable" />
        </div>
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <span v-if="!props.col.is_visit">
            <q-btn
              icon="edit"
              color="primary"
              dense
              v-if="props.col.name === 'date'"
              name
              @click="openEvent(props.row.event.id)"
            >
            </q-btn>
            {{ props.value }}
          </span>
          <q-icon name="add" v-else-if="!!props.value" />
          <q-icon name="remove" v-else />
        </q-td>
      </template>
    </q-table>

    <q-table flat title="Пропуски" :rows="dataVisitsMissed" :columns="columnsVisitsTypes" />

    <q-dialog full-width v-model="isOpen" position="bottom" v-if="dialogEvent">
      <event-dialog-component @close="update" :event-id="dialogEvent" />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import {
  date, exportFile, Loading, Notify,
} from 'quasar';
import EventDialogComponent from 'src/components/EventDialogComponent.vue';
import { IEvent, IEventService } from 'src/services/IEventService';
import { IStudentService } from 'src/services/IStudentService';
import { useStudentStore } from 'src/stores/student-store';
import { inject, onMounted, ref } from 'vue';

const getUnique = (array: string[]) => [...new Set(array)];

const string2Date = (d?: string) => {
  if (!d || d.length !== 10) return null;
  return new Date(`${d.split('.').reverse().join('-')}T00:00:00`);
};

const wrapCsvValue = (val: string, formatFn?: (x: string) => string | null) => {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;
  formatted = formatted === void 0 || formatted === null ? '' : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
};

const isOpen = ref(false);
const dialogEvent = ref('');

const openEvent = (id: string) => {
  dialogEvent.value = id;
  isOpen.value = true;
};

const studentService = inject<IStudentService>('IStudentService');
if (!studentService) {
  throw new Error('IStudentService not provided');
}
const eventService = inject<IEventService>('IEventService');
if (!eventService) {
  throw new Error('IEventService not provided');
}
const events = ref<{
  data: IEvent[];
}>({
  data: [],
});

const studentStore = useStudentStore();
const students = computed(() => studentStore.students);
const showFilters = ref(false);
const filters = ref<{
  date: {
    $lt?: string;
    $gt?: string;
  };
  subject: string[];
  type: string[];
}>({
  date: {
    $lt: date.formatDate(new Date(), 'DD.MM.YYYY'),
  },
  subject: [],
  type: [],
});

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const options = computed(() => ({
  name: getUnique(events.value.data.map((a) => a.subject)),
  type: getUnique(events.value.data.map((a) => a.type)),
}));

const filteredEvents = computed(() => events.value.data.filter((d) => {
  let active = true;
  ['subject', 'type'].forEach((tt) => {
    if (filters.value[tt].length && !filters.value[tt].find((a) => a === d[tt])) {
      active = false;
    }
  });
  const dateGt = string2Date(filters.value.date.$gt);
  const dateLt = string2Date(filters.value.date.$lt);
  active = active && (!dateGt || new Date(d.date) > dateGt);
  active = active && (!dateLt || new Date(d.date) < dateLt);

  return active;
}));

const dataVisitsMissed = computed(() => {
  if (!students.value) return [];

  const types = options.value.type;
  const maxCount = types.map(
    (x) => filteredEvents.value.filter((event) => event.type === x).length,
  );
  return students.value.map((student) => {
    const mapped: Record<
      string,
      | {
          missing: number;
          count: number;
          all: number;
        }
      | string
    > & {
      id: string;
      name: string;
    } = {
      id: student.id,
      name: `${student.contingent?.surname || ''} ${student.contingent?.name || ''} ${
        student.contingent?.secname || ''
      }`,
    };

    types.forEach((type, i) => {
      let count = 0;
      filteredEvents.value
        .filter((event) => event.type === type)
        .forEach((event) => {
          if (event.visits.find((visit) => visit.userId === student.id)) count += 1;
        });
      mapped[type] = {
        missing: maxCount[i] - count,
        count,
        all: maxCount[i],
      };
    });

    return mapped;
  });
});

const columnsVisitsTypes = computed(() => [
  {
    name: 'name',
    align: 'left',
    label: 'ФИО',
    field: 'name',
    sortable: true,
  },
  ...options.value.type.map((type) => ({
    name: type,
    align: 'right',
    label: type,
    field: type,
    format: (t: { missing: number }) => t.missing,
  })),
]);

const update = async () => {
  Loading.show();
  events.value.data = await eventService.filter({});
  Loading.hide();
};

onMounted(() => {
  update();
  studentStore.loadStudents(studentService);
});

const columns = computed(() => [
  {
    name: 'date',
    align: 'left',
    label: 'Дата',
    field: 'date',
    sortable: true,
    format: (d: Date) => date.formatDate(d, 'DD.MM.YY HH:mm'),
  },
  {
    name: 'name',
    align: 'left',
    label: 'Предмет',
    field: 'subject',
    sortable: false,
    format: (subject: string) => {
      const x = subject.replace(/-/g, '').trim().split(' ');
      if (x.length === 1) {
        return x[0].substring(0, 3);
      }
      return x
        .map((r) => {
          const z = (r || '').toUpperCase();
          if (z === 'И') return 'и';
          return z[0];
        })
        .join('');
    },
  },

  {
    name: 'type',
    align: 'left',
    label: 'Тип',
    field: 'type',
    sortable: false,
    format: (type: string) => type.substring(0, 3),
  },
  ...[...(students.value || [])]
    .sort((a, b) => (!a.contingent?.surname || !b.contingent?.surname
      ? 0
      : a.contingent.surname < b.contingent.surname
        ? -1
        : 1))
    .map((u) => ({
      name: `user_${u.id}`,
      align: 'center',
      label: `${u.contingent?.surname || ''} ${(u.contingent?.name || ' ')[0]}.`,
      field: `user_${u.id}`,
      sortable: false,
      is_visit: true,
    })),
]);

const data = computed(() => filteredEvents.value.map((e) => {
  const event: {
      date: string;
      subject: string;
      type: string;
      event: IEvent;
      [key: `user_${string}`]: 1;
    } = {
      date: e.date,
      subject: e.subject,
      type: e.type,
      event: e,
    };

  e.visits.forEach((visit) => {
    event[`user_${visit.userId}`] = 1;
  });
  return event;
}));

const exportTable = () => {
  const content = [columns.value.map((col) => wrapCsvValue(col.label)).join(';')]
    .concat(
      data.value.map((row) => columns.value
        .map((col) => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
        ))
        .join(';')),
    )
    .join('\r\n');

  const status = exportFile('table-export.csv', content, 'text/csv;charset=windows-1251');

  if (status !== true) {
    Notify.create({
      message: 'Браузер отклонил загрузку файла...',
      color: 'negative',
      icon: 'warning',
    });
  }
};
</script>

<style>
.my-sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

thead tr:first-child th {
  top: 0;
}
</style>
