<script setup lang="ts">
import { PropType } from "vue";
import { ExtendedConfig } from "~/types";

const props = defineProps({
  result: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
    required: true,
  },
  config: { type: Object as PropType<ExtendedConfig>, required: true },
});

function navigate() {
  console.log(`navigate to: ${props.config.hostUrl}/${props.result.url}`);
}
</script>

<template>
  <div
    class="hit flex rounded ring-1 ring-gray-500 hover:ring-gray-400 px-1.5 py-1 items-center cursor-pointer hover:bg-gray-100/25"
    @click="navigate"
  >
    <!--  -->
    <span class="font-medium flex flex-shrink-0">{{
      result.hierarchy_lvl0
    }}</span>
    <span class="font-light ml-1 italic truncate text-sm text-gray-500"
      >{{ result.hierarchy_lvl1 || result.hierarchy_lvl2 }}
    </span>
  </div>
</template>
