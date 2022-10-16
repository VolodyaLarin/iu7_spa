<template>
  <div class="event-header-component">
    <brand-circle-component :size="size" :color="color"></brand-circle-component>
    <div class="event-header-component__body">
      <div class="event-header-component__body__title">
        {{ title }}
      </div>

      <div class="event-header-component__body__subtitle">
        {{ subtitle }}
        <slot></slot>
      </div>

    </div>
  </div>
</template>

<style lang="scss">
.event-header-component {
  display: flex;
  align-items: center;
  &__body {
    padding-left: 20px;
    &__title {
      font-weight: 400;
      font-size: 24px;
      line-height: 20px;
      padding: 5px 0;
    }
    &__subtitle {
      font-weight: 300;
      font-size: 18px;
      padding: 5px 0;
    }
  }
}
</style>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import BrandCircleComponent from './BrandCircleComponent.vue';

export default defineComponent({
  components: { BrandCircleComponent },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: 'notStarted',
    },
    size: {
      type: String,
    },
  },

  setup(params) {
    const color = computed(() => {
      const values: Record<string, string> = {
        visited: 'var(--q-positive)',
        missed: 'var(--q-negative)',
        notStarted: 'var(--q-secondary)',
      };
      return values[params.state] || 'grey';
    });

    return { color };
  },
});
</script>
