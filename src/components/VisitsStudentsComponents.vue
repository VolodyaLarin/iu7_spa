<template>
  <div>
    <div class="text-h5 text-medium">Посещения</div>
    <div class="text-body2 q-py-sm">Присутствовало {{ studentsVisits.visited.length }} человек</div>

    <div class="q-py-xs row" v-for="s in studentsVisits.visited" :key="s.id">
      <q-btn
        v-if="canEdit"
        @click="deleteStudent(s.id)"
        class="q-mr-md"
        dense
        fab-mini
        color="secondary"
        icon="close"
      />
      <StudentVisitComponent
        :name="`${s.contingent?.surname} ${s.contingent?.name}`"
        :avatar="s.photo"
      />
    </div>

    <div class="text-body2 q-py-sm">
      Отсутствовало {{ studentsVisits.notVisited.length }} человек
    </div>
    <div class="q-py-xs row" v-for="s in studentsVisits.notVisited" :key="s.id">
      <q-btn
        v-if="canEdit"
        @click="addStudent(s.id)"
        class="q-mr-md"
        dense
        fab-mini
        color="secondary"
        icon="add"
      />
      <StudentVisitComponent
        :name="`${s.contingent?.surname} ${s.contingent?.name}`"
        :avatar="s.photo"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { IUser } from 'src/services/IAuthService';
import { defineComponent } from 'vue';
import StudentVisitComponent from './StudentVisitComponent.vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    students: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const visits = computed<string[]>({
      get: () => props.modelValue.map(String),
      set: (val) => {
        emit('update:modelValue', val);
      },
    });
    const studentsVisits = computed(() => {
      if (!props.students) {
        return {
          visited: [],
          notVisited: [],
        };
      }
      const visitedIds = new Set(visits.value);
      return {
        visited: (props.students as IUser[]).filter((s) => visitedIds.has(String(s.id))),
        notVisited: (props.students as IUser[]).filter((s) => !visitedIds.has(String(s.id))),
      };
    });
    const addStudent = (studentId: string) => {
      visits.value = [...visits.value, studentId];
    };
    const deleteStudent = (studentId: string) => {
      visits.value = visits.value.filter((r) => r !== studentId);
    };
    return {
      visits,
      studentsVisits,
      addStudent,
      deleteStudent,
    };
  },
  components: { StudentVisitComponent },
});
</script>
