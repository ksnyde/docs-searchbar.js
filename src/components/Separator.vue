<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  /** width as a percentage of available */
  width: {
    type: String as PropType<`${number}${number | ""}${number | ""}`>,
    default: "75",
  },
  dotted: { type: Boolean, default: false },
});
</script>

<template>
  <!-- w-50 w-75 w-90 -->
  <div class="separator my-4 h-1 items-center w-full flex justify-center">
    <div
      :class="`block w-${width} border-t-1 border-gray-200 ${
        dotted ? 'border-dotted' : ''
      }`"
    ></div>
  </div>
</template>
