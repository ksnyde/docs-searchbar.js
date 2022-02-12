<script setup lang="ts">
import { SearchBarConfig } from "~/types";
import { isEventWithValue } from "~/type-guards";
import { isDark, toggleDark } from "~/composables/dark";
import { Placement } from "floating-vue";

type Env = "local" | "staging" | "production";

const env = ref<Env>("local");

const config: Record<Env, SearchBarConfig> = {
  local: {
    hostUrl: "local/",
    apiKey: undefined,
    index: "consolidated",
    primaryKey: "objectID",
    debug: true,
  },
  staging: {
    hostUrl: "staging/",
    apiKey:
      "XZEH8BS90ee09c45215a8421c06857bcbde5c1a6797bdf4859a57a3ac1228a2b81df0994",
    index: "consolidated",
    primaryKey: "objectID",
    debug: true,
  },
  production: {
    hostUrl: "production/",
    apiKey: "ea0105f56bb5a2111ed28c7a0c637fc0bed07273f571dc7cb1f73900e44f8e7f",
    index: "v1_0_0_beta_8",
    primaryKey: "objectID",
    debug: true,
  },
};

const state = reactive({
  groupBy: "",
  distance: 0,
  skidding: 0,
  title: ["hierarchy_lvl0"] as string[],
  subHeading: ["hierarchy_lvl1", "hierarchy_lvl2"] as string[],
  separator: "",
  description: [] as string[],
  descLength: undefined as undefined | number,
  sections: [] as string[],
  subSections: [] as string[],
  placement: "bottom-end" as Placement,
  limit: 10,
  config: computed(() => config[env.value]),
});
</script>

<template>
  <div
    class="flex flex-col items-center w-full text-gray-900 dark:text-gray-50"
  >
    <div
      class="flex flex-col mt-8 flex-grow space-y-4 max-w-6xl flex-grow place-items-center"
    >
      <div class="grid grid-cols-8 w-full px-2">
        <div
          class="hidden md:block md:col-span-2 flex items-center place-items-center"
        >
          <button
            class="h-full icon-btn !outline-none"
            title="toggle light/dark mode"
            @click="toggleDark()"
          >
            <carbon-moon v-if="isDark" />
            <carbon-sun v-else />
          </button>
        </div>
        <h1 class="text-2xl md:text-3xl col-span-3 md:col-span-4 text-center">
          <div class="flex flex-row items-center">
            <span class="px-2 py-1 bg-blue-600 rounded text-gray-50">
              meili-searchbar
            </span>
            <span class="hidden md:flex">&nbsp;Component</span>
          </div>
        </h1>
        <div class="right col-span-5 flex flex-row md:col-span-2">
          <button
            class="md:hidden icon-btn !outline-none p-1 mx-2"
            title="toggle light/dark mode"
            @click="toggleDark()"
          >
            <carbon-moon v-if="isDark" />
            <carbon-sun v-else />
          </button>
          <search-bar class="flex-grow" v-bind="state" />
        </div>
      </div>

      <div
        class="flex border-1 border-dotted border-gray-500 rounded p-2 w-full place-items-center"
      >
        <details open class="w-full">
          <summary class="">Component Settings</summary>
          <div class="playground mt-2 p-4 grid grid-cols-3 gap-4">
            <div class="flex flex-col">
              <label for="env">Server Env</label>
              <select
                name="env"
                id="env"
                :value="env"
                @change="
                  (e) => {
                    env = isEventWithValue(e) ? e.target.value : env;
                  }
                "
              >
                <option value="local">Local Docker</option>
                <option value="staging">Staging Search</option>
                <option value="production">Production Search</option>
              </select>

              <label for="title" class="mt-4">
                <span class="font-bold">title</span> prop
              </label>
              <input
                type="text"
                :value="state.title.join(', ')"
                @change="
                  (e) => {
                    state.title = isEventWithValue(e) ? (e.target.value as string).split(/[,\s]+/) : state.title;
                  }
                "
              />

              <label for="subHeading" class="mt-4">
                <span class="font-bold">subHeading</span> prop
              </label>
              <input
                type="text"
                :value="state.subHeading.join(', ')"
                @change="
                  (e) => {
                    state.subHeading = isEventWithValue(e) ? (e.target.value as string).split(/[,\s]+/) : state.subHeading;
                  }
                "
              />

              <label for="separator" class="mt-4">
                <span class="font-bold">separator</span> prop
              </label>
              <select
                name="separator"
                id="separator"
                :value="state.separator"
                class=""
                @change="
                  (e) => {
                    state.separator = isEventWithValue(e)
                      ? e.target.value
                      : env;
                  }
                "
              >
                <option value="" class="italic font-light">none</option>
                <option value="|">| (aka, vertical bar)</option>
                <option value=":">: (aka, colon)</option>
              </select>

              <label for="description" class="mt-4">
                <span class="font-bold">description</span> prop
              </label>
              <div class="flex flex-row w-full space-x-1">
                <input
                  type="text"
                  class="flex-grow"
                  :value="state.description.join(', ')"
                  @change="
                    (e) => {
                      state.description = isEventWithValue(e) ? (e.target.value as string).split(/[,\s]+/) : state.description;
                    }
                  "
                />
                <select
                  id="descLength"
                  name="descLength"
                  class="w-24"
                  @change="
                    (e) => {
                      state.descLength = isEventWithValue(e)
                        ? e.target.value
                          ? Number(e.target.value)
                          : undefined
                        : state.descLength;
                    }
                  "
                >
                  <option :value="undefined">-</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                  <option :value="200">200</option>
                  <option :value="200">500</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col">
              <label for="groupBy"
                ><span class="font-bold">groupBy</span> prop</label
              >
              <select
                name="groupBy"
                id="groupBy"
                :value="state.groupBy"
                class=""
                @change="
                  (e) => {
                    state.groupBy = isEventWithValue(e) ? e.target.value : env;
                  }
                "
              >
                <option value="" class="italic font-light">none</option>
                <option value="from">from prop</option>
                <option value="kind">kind prop</option>
                <option value="category">category prop</option>
                <option value="area">area prop</option>
                <option value="section">section prop</option>
                <option value="hierarchy_lvl2">hierarchy_lvl2 prop</option>
                <option value="hierarchy_lvl3">hierarchy_lvl3 prop</option>
                <option value="hierarchy_lvl4">hierarchy_lvl4 prop</option>
              </select>

              <label
                for="sections"
                class="mt-4"
                v-tooltip="{
                  content:
                    'properties to look for an array of anchor based sections in a document',
                }"
              >
                <span class="font-bold">sections</span> prop
              </label>
              <input
                type="text"
                :value="state.sections.join(', ')"
                @change="
                  (e) => {
                    state.sections = isEventWithValue(e) ? (e.target.value as string).split(/[,\s]+/) : state.sections;
                  }
                "
              />

              <label for="subSections" class="mt-4">
                <span class="font-bold">subSections</span> prop
              </label>
              <input
                type="text"
                :value="state.subSections.join(', ')"
                @change="
                  (e) => {
                    state.subSections = isEventWithValue(e) ? (e.target.value as string).split(/[,\s]+/) : state.subSections;
                  }
                "
              />
            </div>

            <div class="flex flex-col space-y-4">
              <div class="flex flex-col w-full">
                <label for="distance">
                  <span class="font-bold">distance</span> prop
                </label>

                <div class="flex flex-row w-full items-center">
                  <input
                    type="range"
                    class="flex-grow"
                    :value="state.distance"
                    :min="-30"
                    :max="30"
                    @dblclick="
                      () => {
                        state.distance = 0;
                      }
                    "
                    @change="
                      (e) => {
                        state.distance = isEventWithValue(e)
                          ? Number(e.target.value)
                          : state.distance;
                      }
                    "
                  />
                  <div class="flex ml-2 h-auto">{{ state.distance }}</div>
                </div>
              </div>

              <div class="flex flex-col w-full">
                <label for="skidding">
                  <span class="font-bold">skidding</span> prop
                </label>

                <div class="flex flex-row w-full items-center">
                  <input
                    type="range"
                    class="flex-grow"
                    :value="state.skidding"
                    :min="-30"
                    :max="30"
                    @dblclick="
                      () => {
                        state.skidding = 0;
                      }
                    "
                    @change="
                      (e) => {
                        state.skidding = isEventWithValue(e)
                          ? Number(e.target.value)
                          : state.skidding;
                      }
                    "
                  />
                  <div class="flex ml-2 h-auto">{{ state.distance }}</div>
                </div>
              </div>

              <div class="flex flex-col w-full">
                <label for="placement">
                  <span class="font-bold">placement</span> prop
                </label>
                <select
                  name="placement"
                  id="placement"
                  :value="state.placement"
                  class=""
                  @change="
                    (e) => {
                      state.placement = isEventWithValue(e)
                        ? e.target.value
                        : state.placement;
                    }
                  "
                >
                  <option value="auto">auto</option>
                  <option value="bottom-end">bottom-end</option>
                  <option value="bottom-start">bottom-start</option>
                  <option value="bottom">bottom</option>
                  <option value="top">top</option>
                  <option value="top-start">top-start</option>
                  <option value="top-end">top-end</option>
                  <option value="left">left</option>
                  <option value="right">right</option>
                </select>
              </div>
            </div>
          </div>
        </details>
      </div>

      <documentation />
    </div>
  </div>
</template>

<style lang="css" scoped>
summary {
  @apply hover:bg-gray-100/25 dark:hover:bg-gray-900 cursor-pointer w-full p-1;
}

select,
input {
  @apply px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded ring-gray-300 focus:ring-indigo-500 ring-1 border-none h-50px;
}

input[type="range"] {
  @apply ring-0;
}

select {
  @apply py-3.5 max-h-50px;
}

label {
  @apply mb-0.5;
}
</style>
