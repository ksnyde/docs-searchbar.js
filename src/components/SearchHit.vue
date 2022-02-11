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

const p = computed(() => ({
  title: extractWithDefault(props.result, props.config.title),
  subHeading: extractWithDefault(props.result, props.config.subHeading),
  sections: extractWithDefault(props.result, props.config.sections),
  subSections: extractWithDefault(props.result, props.config.subSections),
  description: extractWithDefault(props.result, props.config.description),
}));

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
    <span class="font-medium flex flex-shrink-0">{{ p.title }}</span>
    <span class="font-light ml-1 italic truncate text-sm text-gray-500"
      >{{ p.subHeading }}
    </span>
  </div>
</template>
