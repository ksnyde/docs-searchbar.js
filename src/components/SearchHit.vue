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

function extractWithDefault(
  result: Record<string, any>,
  suggest: string | string[] | undefined
) {
  const suggestedProp = (Array.isArray(suggest) ? suggest : [suggest]).find(
    (i) => props.result[i as string] && props.result[i as string].length > 0
  );

  return suggestedProp ? result[suggestedProp as string] : "";
}

const description = extractWithDefault(
  props.result,
  props.config.description
) as undefined | string;

/** mapped properties */
const p = computed(() => ({
  /** the content for title after mapping */
  title: extractWithDefault(props.result, props.config.title),
  /** the content for subHeading after mapping */
  subHeading: extractWithDefault(props.result, props.config.subHeading),
  /** the content for sections after mapping */
  sections: extractWithDefault(props.result, props.config.sections) || [],
  /** the content for sub-sections after mapping */
  subSections: extractWithDefault(props.result, props.config.subSections),
  /** the content for description after mapping */
  description:
    (props.config.descLength && description?.length) ||
    0 > (props.config.descLength as number)
      ? `${extractWithDefault(props.result, props.config.description).slice(
          0,
          props.config.descLength as number
        )} ...`
      : extractWithDefault(props.result, props.config.description),

  url: props.result.url,
}));

function navigate() {
  console.log(`navigate to: ${props.config.hostUrl}/${props.result.url}`);
}
</script>

<template>
  <div
    class="hit flex flex-col space-y-2 rounded ring-1 ring-gray-500 hover:ring-gray-400 px-1.5 py-1 items-center cursor-pointer hover:bg-gray-100/25"
    @click="navigate"
  >
    <div class="flex flex-row w-full items-center">
      <span class="font-medium flex flex-shrink-0">{{ p.title }}</span>
      <span
        v-if="config.separator && p.subHeading"
        class="separator"
        :class="config.separator.startsWith(':') ? 'mr-2 ml-0.5' : 'mx-2'"
      >
        {{ config.separator }}
      </span>
      <span
        class="font-light ml-1 italic truncate text-sm text-gray-600 dark:text-gray-400"
        >{{ p.subHeading }}
      </span>
    </div>
    <div
      v-show="p.description || p.sections.length > 0 || p.subSections"
      class="optional-content flex flex-col w-full"
    >
      <div v-show="p.description" class="description block text-xs self-start">
        {{ p.description }}
      </div>
      <div
        v-show="p.sections && p.sections.length > 0"
        class="sections text-sm flex flex-row items-start"
      >
        <div class="ml-8 mr-4 mt-1 italic text-gray-500">sections:</div>
        <div class="flex flex-row space-x-2 items-start">
          <a
            v-for="section in p.sections"
            :key="section"
            :href="`${p.url}/#${section}`"
            class="flex hover:underline hover:bg-darker-100/50 p-1 rounded"
            >{{ section }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.hit .separator {
  @apply text-gray-600 dark:text-gray-400;
}
</style>
