<template>
  <div>
    <q-chip :ripple="false" icon="schedule">{{ displayTime }}</q-chip>
    <q-chip :ripple="false" icon="location_on" v-if="place">{{ place }}</q-chip>
    <q-chip :ripple="false" icon="person" v-if="speaker">{{ speaker }}</q-chip>
    <q-chip :ripple="false" icon="pets" v-if="type">{{ type }}</q-chip>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { date } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    place: {
      type: String,
    },
    speaker: {
      type: String,
    },
    type: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  setup(params) {
    const displayTime = computed(() => {
      if (!params.date) return '';

      const d = new Date(params.date);
      const begin = date.formatDate(d, 'HH:mm');
      const end = date.formatDate(
        date.addToDate(d, {
          minutes: 95,
        }),
        'HH:mm',
      );
      return `${begin} - ${end}`;
    });

    return { displayTime };
  },
});
</script>
