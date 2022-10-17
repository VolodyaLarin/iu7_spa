<template>
  <div class="event-card-component">
    <div class="event-card-component__body">
      <EventHeaderComponent
        @click="$emit('headerClicked')"
        :state="eventState"
        :title="title"
        :subtitle="theme"
      ></EventHeaderComponent>

      <div class="event-card-component__desc q-py-md">
        <md-editor previewTheme="github" :modelValue="description" previewOnly />
      </div>
      <EventChipsComponent
        class="event-card-component__tags"
        :date="date"
        :place="place"
        :speaker="speaker"
        :type="type"
      />
    </div>
    <q-btn
      color="positive"
      label="Посетить мероприятие"
      class="event-card-component__action full-width q-py-md"
      v-if="canVisit"
      @click="$emit('visit')"
    >
    </q-btn>
  </div>
</template>

<style lang="scss" scoped>
.event-card-component {
  border: 2px solid #f6f6f6;
  border-radius: 20px 20px;

  &__body {
    padding: 20px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
  }

  &__action {
    border-radius: 0px 0px 20px 20px;
  }
}
</style>

<script lang="ts">
import MdEditor from 'src/components/MDEditor';

import { computed, defineComponent } from 'vue';
import { date } from 'quasar';
import EventHeaderComponent from './EventHeaderComponent.vue';
import EventChipsComponent from './EventChipsComponent.vue';

export default defineComponent({
  props: {
    title: {
      type: String,
    },
    theme: {
      type: String,
    },
    description: {
      type: String,
    },
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
      type: [Date, String],
      required: true,
    },
    isVisited: {
      type: Boolean,
    },
  },
  components: { EventHeaderComponent, MdEditor, EventChipsComponent },

  setup(params) {
    const eventState = computed(() => {
      if (params.isVisited) return 'visited';

      if (new Date() > new Date(params.date)) return 'missed';

      return 'notStarted';
    });

    const canVisit = computed(
      () => Math.abs(date.getDateDiff(new Date(), params.date, 'minutes')) < 10
        && eventState.value === 'missed',
    );

    return { eventState, canVisit };
  },
});
</script>
