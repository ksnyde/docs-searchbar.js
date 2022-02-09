<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  result: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
    required: true,
  },
});
</script>

<template>
  <div class="hit flex rounded border-1 px-1.5 py-1 items-center">
    <!--  -->
    <span class="font-medium flex flex-shrink-0">{{
      result.hierarchy_lvl0
    }}</span>
    <span
      class="font-light ml-1 italic truncate text-sm text-gray-700 dark:text-gray-300"
      >{{ result.hierarchy_lvl1 || result.hierarchy_lvl2 }}
    </span>
  </div>
</template>
