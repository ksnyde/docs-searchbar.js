<script setup lang="ts">
import { PropType } from "vue";
import { ExtendedConfig } from "~/types";

const props = defineProps({
  results: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => {},
    required: true,
  },
  config: { type: Object as PropType<ExtendedConfig>, required: true },
  group: { type: String, required: true },
});

const pk = computed(() => props.config.primaryKey as string);
</script>

<template>
  <div class="group">
    <div class="heading border-b-1 border-gray-900 dark:border-gray-100 mb-4">
      {{ group }}
    </div>
    <div class="flex flex-col w-full pl-8 space-y-2">
      <search-hit
        v-for="result in results"
        :key="result[pk]"
        :config="config"
        :result="result"
      />
    </div>
  </div>
</template>
