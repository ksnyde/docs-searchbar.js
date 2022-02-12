<script setup lang="ts">
defineProps({
  name: { type: String, required: true },
  desc: { type: String, required: true },
});
</script>

<template>
  <details :id="`prop-${name}`" class="property flex flex-row w-full">
    <summary
      class="flex flex-row w-full px-2 py-1 bg-gray-50/25 dark:bg-gray-800/45 cursor-pointer select-none hover:bg-gray-100/50 dark:hover:bg-gray-700/60"
    >
      <span class="flex font-bold flex-grow">{{ name }}</span>
      <span class="flex font-light flex-grow-0 text-sm italic">{{ desc }}</span>
    </summary>

    <div class="content p-4 text-sm">
      <slot name="default">add docs</slot>
    </div>
  </details>
</template>
