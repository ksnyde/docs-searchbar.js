<script setup lang="ts">
import { debouncedWatch, onStartTyping } from "@vueuse/core";
import { isEventWithTargetValue } from "~/utils/events";
import { PropType, ref } from "vue";
import { search } from "~/utils/request";
import type { Placement } from "floating-vue";
import SearchHit from "./SearchHit.vue";
import {
  ExtendedConfig,
  IMeilisearchSearchResponse,
  SearchBarConfig,
  TransformerFunction,
} from "~/types";
import { groupBy } from "native-dash";

const el = ref();
const tooltip = ref();
const searchText = ref("");

const props = defineProps({
  selected: { type: String, required: false },
  title: {
    type: [String, Array] as PropType<string | string[]>,
    default: "hierarchy_lvl0",
  },
  subHeading: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => ["hierarchy_lvl1", "hierarchy_lvl2"],
  },
  description: { type: [String, Array], default: undefined },
  descLength: { type: Number, default: undefined },
  placeholder: { type: String, default: "Search", required: false },
  placement: {
    type: String as PropType<Placement>,
    default: "bottom-end",
    required: false,
  },
  focusKey: {
    type: String as PropType<"CMD+P" | "CTRL+Space">,
    required: false,
  },
  blurKey: { type: String as PropType<"Esc">, required: false, default: "Esc" },
  autocomplete: { type: String, default: "off", required: false },
  separator: { type: String, default: "", required: false },
  groupBy: {
    type: String,
    default: undefined,
    required: false,
  },
  /** props on document to look for H2 anchor sections */
  sections: {
    type: [String, Array] as PropType<string | string[] | undefined>,
    required: false,
  },
  /** props on document to look for H3 anchor sections */
  subSections: {
    type: [String, Array] as PropType<string | string[] | undefined>,
    required: false,
  },
  skidding: { type: Number, required: false },
  distance: { type: Number, required: false },
  limit: { type: Number, default: 10, required: false },
  offset: { type: Number, required: false },
  /**
   * optionally pass in a function to transform results/hits prior to
   * having them rendered.
   */
  transformer: {
    type: Function as PropType<TransformerFunction>,
    required: false,
  },
  config: { type: Object as PropType<SearchBarConfig>, required: true },
});

const extendedConfig = computed(() => {
  return {
    ...props.config,
    title: props.title,
    subHeading: props.subHeading,
    separator: props.separator,
    description: props.description,
    descLength: props.descLength,
    sections: props.sections,
    limit: props.limit,
    offset: props.offset,
    groupBy: props.groupBy,
  } as ExtendedConfig;
});

/** search results */
const results = ref<IMeilisearchSearchResponse | null>(null);
/** grouped search results */
const grouped = computed(() => {
  return props.groupBy
    ? groupBy(props.groupBy as any, results.value?.hits || [])
    : {};
});

const hits = {
  /** the total available search results (ignoring "limit") */
  totalHits: computed(() => {
    return results.value?.nbHits || 0;
  }),
  showing: computed(() => {
    return (results.value?.hits || []).length || 0;
  }),

  limit: computed(() => {
    return results.value?.limit;
  }),
  offset: computed(() => {
    return results.value?.offset;
  }),
};

const state = reactive({
  /** actively searching */
  searching: ref(false),
  /**
   * whether a grouping property has been included for group layout
   */
  isGrouped: computed(() =>
    props.groupBy && props.groupBy.length > 0 ? true : false
  ),
  /** at least one result present */
  hasResults: computed(() =>
    results.value?.hits?.length || 0 > 0 ? true : false
  ),
  /** The input element has focus */
  inputFocused: useFocusWithin(el).focused,
  tooltipFocused: useFocusWithin(tooltip).focused,
  /**
   * when search results are explicitly closed
   * (e.g., ESC key, click outside, etc.)
   */
  explicitClose: ref(false),
});

const show = computed(() => {
  return (
    state.searching ||
    (state.hasResults && state.inputFocused) ||
    (state.hasResults && !state.explicitClose)
  );
});

onKeyStroke("Escape", () => {
  if (props.blurKey === "Esc") {
    state.explicitClose = true;
    el.value.blur();
  }
});

onKeyStroke("Down", () => {
  console.log("down");
});

const { ctrl, space, cmd, k, up, down } = useMagicKeys();

watchEffect(() => {
  if (ctrl.value && space.value) {
    console.log("naughty naughty");
  }

  if (up.value && state.hasResults && !state.explicitClose) {
    console.log("up");
  }
  if (down.value && state.hasResults && !state.explicitClose) {
    console.log("down");
  }

  if ((cmd.value || ctrl.value) && k.value) {
    console.log("hey Mac");
  }
});

onClickOutside(tooltip, () => {
  if (!state.inputFocused || state.tooltipFocused) {
    state.explicitClose = true;
  }
});

debouncedWatch(
  searchText,
  async () => {
    if (searchText.value.trim().length > 0) {
      state.searching = true;
      state.explicitClose = false;
      console.log({ hostUrl: props.config.hostUrl });

      results.value = await search(props.config)(searchText.value);
      state.searching = false;
      if (props.config.debug) {
        console.groupCollapsed(
          `Search results received [ ${results.value.hits.length} of ${results.value.nbHits} ]`
        );
        console.info(`total hits found in index was: `, results.value.nbHits);
        console.info(
          `the result set has a limit of results: `,
          results.value.limit
        );
        console.info(
          `the "offset" into the total results was: `,
          results.value.offset
        );
        console.info(`hits: `, [...results.value.hits]);
        console.groupEnd();
      }
    } else {
      results.value = null;
      if (props.config.debug) {
        console.log("search results cleared");
      }
    }
  },
  { debounce: 500 }
);

onStartTyping(() => {
  if (!el.value.active) {
    el.value.focus();
  }
});
</script>

<style lang="css">
.v-popper__wrapper {
  @apply rounded-lg overflow-hidden;
}
html.dar .v-popper__arrow-container {
  @apply border-gray-800 bg-gray-800;
}
html.dark .v-popper__wrapper,
html.dark .v-popper__inner {
  @apply bg-gray-800 text-gray-100 border-gray-900;
}
</style>

<template>
  <div
    role="search"
    class="meili-searchbar searchbox__wrapper relative flex flex-grow items-center"
    :data-hits="hits.totalHits"
    :data-limit="hits.limit"
    :data-offset="hits.offset"
  >
    <ic:round-search
      class="absolute flex w-6 h-full left-1.5 text-gray-500 inset-y-0"
    />
    <v-dropdown
      ref="tooltip"
      class="w-full transition-opacity duration-200 ease-in-out"
      :placement="placement"
      :triggers="[]"
      :auto-hide="false"
      :shown="show"
      :distance="distance"
      :skidding="skidding"
    >
      <input
        ref="el"
        id="${suggestionPrefix}"
        :value="searchText"
        type="string"
        class="flex w-full searchbox__input pl-8 pr-2 py-1 ring-1 ring-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 shadow focus:placeholder-gray-500/35 text-gray-900/50 focus:text-gray-900 dark:bg-gray-700 dark:text-gray-100/50 dark:focus:text-gray-100"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        spellcheck="false"
        @focus="state.explicitClose = false"
        @input="
        (event) =>
          (searchText = isEventWithTargetValue(event)
            ? event.target.value as string || ''
            : '')
        "
      />
      <template #popper>
        <div class="min-h-150px p-4 w-2xl flex flex-col space-y-2">
          <grouped-hits
            v-if="state.hasResults && state.isGrouped"
            v-for="group in Object.keys(grouped)"
            :key="group"
            :results="grouped[group]"
            :group="group"
            :config="extendedConfig"
          >
            <slot
              name="groupIcon"
              :group="group"
              :config="config"
              :results="results"
            ></slot>
          </grouped-hits>
          <div
            v-show="state.hasResults && !state.isGrouped"
            class="hits"
            v-for="hit in (results || {}).hits"
            :key="hit[config.primaryKey || 'id' as any]"
          >
            <search-hit :result="hit" :config="extendedConfig" />
          </div>
          <div v-show="state.searching">searching ...</div>
          <div
            v-show="!state.searching && !state.hasResults"
            class="no-results"
          >
            nothing found
          </div>
          <div
            v-if="state.hasResults"
            class="results-footer flex w-full justify-end"
          >
            <div
              v-if="Number(hits.showing.value) !== Number(hits.totalHits.value)"
              class="footer pt-6 self-end font-light italic text-sm"
            >
              showing {{ hits.showing }} of {{ hits.totalHits }} results
            </div>
            <div v-else class="footer pt-6 self-end font-light italic text-sm">
              showing all {{ hits.totalHits }} results
            </div>
          </div>
        </div>
      </template>
    </v-dropdown>
    <ic:round-cancel
      class="absolute flex h-full w-5 right-2 inset-y-0"
      :class="
        searchText.length > 0
          ? 'text-gray-500/25 dark:text-gray-400/25 hover:text-gray-500/50 dark:hover:text-gray-400/50 cursor-pointer'
          : 'text-gray-500/0'
      "
      @click="searchText = ''"
    />
  </div>
</template>
