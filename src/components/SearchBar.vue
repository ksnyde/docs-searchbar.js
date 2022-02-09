<script setup lang="ts">
import { debouncedWatch, onStartTyping } from "@vueuse/core";
import { isEventWithTargetValue } from "~/utils/events";
import { PropType, ref } from "vue";
import { search } from "~/utils/request";
import type { Placement } from "floating-vue";
import SearchHit from "./SearchHit.vue";
import {
  IMeilisearchSearchResponse,
  SearchBarConfig,
  TransformerFunction,
} from "~/types";
const el = ref();
const tooltip = ref();
const searchText = ref("");

const props = defineProps({
  placeholder: { type: String, default: "Search", required: false },
  placement: {
    type: String as PropType<Placement>,
    default: "bottom-end",
    required: false,
  },
  autocomplete: { type: String, default: "off", required: false },
  kind: {
    type: String as PropType<"simple" | "column">,
    default: "simple",
    required: false,
  },
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

const results = ref<IMeilisearchSearchResponse | null>(null);
/** the total available search results (ignoring "limit") */
const totalHits = computed(() => {
  return results.value?.nbHits;
});
const limit = computed(() => {
  return results.value?.limit;
});
const offset = computed(() => {
  return results.value?.offset;
});

const searching = ref(false);
/**
 * when search results are explicitly closed
 * (e.g., ESC key, click outside, etc.)
 */
const closed = ref(false);

onKeyStroke("Escape", () => {
  closed.value = true;
  el.value.blur();
});

onClickOutside(tooltip, () => {
  closed.value = true;
});

debouncedWatch(
  searchText,
  async () => {
    if (searchText.value.trim().length > 0) {
      searching.value = true;
      closed.value = false;
      results.value = await search(props.config)(searchText.value);
      searching.value = false;
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

const display = computed(() => {
  if (closed.value) {
    return "hide";
  }

  if (results.value?.hits.length || 0 > 0) {
    return "results";
  } else if (searching.value) {
    return "searching";
  } else if (searchText.value.length > 0) {
    return "nothing";
  } else {
    return "hide";
  }
});

onStartTyping(() => {
  if (!el.value.active) {
    el.value.focus();
  }
});
</script>

<template>
  <div
    role="search"
    class="meili-searchbar searchbox__wrapper relative"
    :data-hits="totalHits"
    :data-limit="limit"
    :data-offset="offset"
  >
    <ic:round-search
      class="absolute flex w-6 h-full left-1.5 text-gray-500 inset-y-0"
    />
    <v-tooltip
      ref="tooltip"
      class="w-full transition-opacity duration-200 ease-in-out"
      :placement="placement"
      :triggers="[]"
      :shown="display !== 'hide'"
    >
      <input
        ref="el"
        id="${suggestionPrefix}"
        :value="searchText"
        type="string"
        class="flex w-full searchbox__input pl-8 pr-2 py-1 ring-1 ring-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 shadow focus:placeholder-gray-500/35"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        spellcheck="false"
        @focus="closed = false"
        @input="
        (event) =>
          (searchText = isEventWithTargetValue(event)
            ? event.target.value as string || ''
            : '')
      "
      />
      <template #popper>
        <div class="min-h-150px p-4 w-2xl flex flex-col space-y-2">
          <div
            v-show="display === 'results'"
            class="hits"
            v-for="hit in (results || {}).hits"
            :key="hit[config.primaryKey || 'id' as any]"
          >
            <search-hit :result="hit" />
          </div>
          <div v-show="display === 'searching'">searching ...</div>
          <div v-show="display === 'nothing'" class="no-results">
            nothing ...
          </div>
        </div>
      </template>
    </v-tooltip>
    <ic:round-cancel
      class="absolute flex h-full w-5 right-2 inset-y-0"
      :class="
        searchText.length > 0
          ? 'text-gray-500/25 hover:text-gray-500/50 cursor-pointer'
          : 'text-gray-500/0'
      "
      @click="searchText = ''"
    />
  </div>
</template>
