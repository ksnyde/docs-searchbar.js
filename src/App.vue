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
  primaryIcon: {
    function: `<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12.42 5.29c-1.1-.1-2.07.71-2.17 1.82L10 10h2.82v2h-3l-.44 5.07A4.001 4.001 0 0 1 2 18.83l1.5-1.5c.33 1.05 1.46 1.64 2.5 1.3c.78-.24 1.33-.93 1.4-1.74L7.82 12h-3v-2H8l.27-3.07a4.01 4.01 0 0 1 4.33-3.65c1.26.11 2.4.81 3.06 1.89l-1.5 1.5c-.25-.77-.93-1.31-1.74-1.38M22 13.65l-1.41-1.41l-2.83 2.83l-2.83-2.83l-1.43 1.41l2.85 2.85l-2.85 2.81l1.43 1.41l2.83-2.83l2.83 2.83L22 19.31l-2.83-2.81L22 13.65Z"/></svg>`,
    interface: `<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-8 5H9v2c0 1.1-.9 2-2 2c1.1 0 2 .9 2 2v2h2v2H9c-1.1 0-2-.9-2-2v-1c0-1.1-.9-2-2-2v-2c1.1 0 2-.9 2-2V8c0-1.1.9-2 2-2h2v2m8 5c-1.1 0-2 .9-2 2v1c0 1.1-.9 2-2 2h-2v-2h2v-2c0-1.1.9-2 2-2c-1.1 0-2-.9-2-2V8h-2V6h2c1.1 0 2 .9 2 2v1c0 1.1.9 2 2 2v2Z"/></svg>`,
    document: `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 4v2h10V7H7zm0 4v2h10v-2H7zm0 4v2h7v-2H7z" fill="currentColor"/></svg>`,
    typescript: `<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h18v18H3V3m10.71 14.86c.5.98 1.51 1.73 3.09 1.73c1.6 0 2.8-.83 2.8-2.36c0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02c0-.41.31-.73.81-.73c.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33c-1.51 0-2.48.96-2.48 2.23c0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13c0 .48-.45.83-1.15.83c-.83 0-1.31-.43-1.67-1.03l-1.38.8M13 11.25H8v1.5h1.5V20h1.75v-7.25H13v-1.5Z"/></svg>`,
    rust: `<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m21.9 11.7l-.9-.5V11l.7-.7c.1-.1.1-.3 0-.4l-.1-.1l-.9-.3c0-.1 0-.2-.1-.2l.6-.8c.1-.1.1-.3-.1-.4c0 0-.1 0-.1-.1l-1-.2c0-.1-.1-.1-.1-.2l.4-.9v-.3c-.1-.1-.2-.1-.3-.1h-1s0-.1-.1-.1l.2-1c0-.2-.1-.3-.2-.3h-.1l-1 .2c0-.1-.1-.1-.2-.2v-1c0-.2-.1-.3-.3-.3h-.1l-.9.4h-.1L16 3c0-.2-.2-.3-.3-.2h-.1l-.8.6c-.1 0-.2 0-.2-.1l-.3-.9c-.1-.1-.2-.2-.4-.2c0 0-.1 0-.1.1L13 3h-.2l-.5-.8c-.1-.2-.3-.2-.5-.2l-.1.1l-.5.9H11l-.7-.7c-.1-.1-.3-.1-.4 0l-.1.1l-.3.9c-.1 0-.2 0-.2.1l-.8-.6c-.2-.1-.4-.1-.5.1V3l-.2 1s-.1 0-.2.1l-.9-.4c-.1-.1-.3 0-.4.1v1.1c0 .1-.1.1-.1.2l-1-.2c-.2-.1-.3 0-.3.2v.1l.2 1c-.1 0-.1.1-.2.1h-1c-.2 0-.3.1-.3.3v.1l.4.9v.2L3 8c-.2 0-.3.2-.3.3v.1l.6.8c0 .1 0 .2-.1.2l-.8.4c-.1.1-.2.2-.2.4c0 0 0 .1.1.1l.7.7v.2l-.8.5c-.2.1-.2.3-.2.4l.1.1l.9.6v.2l-.7.7c-.1.1-.1.3 0 .4l.1.1l.9.3c0 .1 0 .2.1.2l-.6.8c-.1.1-.1.3.1.4c0 0 .1 0 .1.1l1 .2c0 .1.1.1.1.2l-.4.9c-.1.1 0 .3.1.4h1.1c.1 0 .1.1.2.1l-.2 1c0 .2.1.3.2.3h.1l1-.2c0 .1.1.1.2.2v1c0 .2.1.3.3.3h.1l.9-.4h.1l.2 1c0 .2.2.3.3.2h.1l.8-.6c.1 0 .2 0 .2.1l.3.9c.1.1.2.2.4.2c0 0 .1 0 .1-.1l.8-.7h.2l.5.8c.1.1.3.2.4.1l.1-.1l.5-.8h.2l.7.7c.1.1.3.1.4 0l.1-.1l.3-.9c.1 0 .2 0 .2-.1l.8.6c.1.1.3.1.4-.1c0 0 0-.1.1-.1l.2-1c.1 0 .1-.1.2-.1l.9.4c.1.1.3 0 .4-.1v-1.1l.2-.2l1 .2c.2 0 .3-.1.3-.2v-.1l-.2-1l.2-.2h1c.2 0 .3-.1.3-.3v-.1l-.4-.9c0-.1.1-.1.1-.2l1-.2c.2 0 .3-.2.2-.3v-.1l-.6-.8l.1-.2l.9-.3c.1-.1.2-.2.2-.4c0 0 0-.1-.1-.1L21 13v-.2l.8-.5c.2-.1.2-.3.1-.6c0 .1 0 .1 0 0m-5.7 7c-.3-.1-.5-.4-.5-.7c.1-.3.4-.5.7-.5c.3.1.5.4.5.7c0 .4-.3.6-.7.5m-.2-1.9c-.3-.1-.6.1-.6.4l-.4 1.4c-.9.4-1.9.6-3 .6s-2.1-.2-3.1-.7l-.3-1.4c-.1-.3-.3-.5-.6-.4l-1.2.3c-.2-.2-.4-.5-.6-.7h6c.1 0 .1 0 .1-.1v-2.1c0-.1 0-.1-.1-.1h-1.7v-1.3h1.9c.2 0 .9 0 1.2 1c.1.3.2 1.3.4 1.6c.1.3.6 1 1.1 1h3.1c-.2.3-.4.5-.7.8l-1.5-.3m-8.3 1.9c-.3.1-.6-.1-.7-.5c-.1-.3.1-.6.5-.7s.6.1.7.5c0 .3-.2.6-.5.7M5.4 9.5c.1.3 0 .7-.3.8c-.3.1-.7 0-.8-.3c-.1-.3 0-.7.3-.8c.4-.1.7 0 .8.3m-.7 1.6l1.3-.5c.3-.1.4-.4.3-.7L6 9.3h1V14H5c-.3-1-.4-1.9-.3-2.9m5.6-.4V9.3h2.5c.1 0 .9.1.9.7c0 .5-.6.7-1.1.7h-2.3m9 1.2v.5h-.8c-.1 0-.1 0-.1.1v.3c0 .8-.5 1-.9 1s-.8-.2-.9-.4c-.2-1.3-.6-1.5-1.2-2c.7-.5 1.5-1.2 1.5-2.1c0-1-.7-1.6-1.1-1.9c-.7-.4-1.4-.5-1.6-.5H6.6c1.1-1.2 2.5-2 4.1-2.3l.9 1c.2.2.5.2.8 0l1-1c2.1.4 3.9 1.7 5 3.6l-.7 1.6c-.1.3 0 .6.3.7l1.3.6v.8m-7.7-8c.2-.2.6-.2.8 0c.2.2.2.6 0 .8c-.3.3-.6.3-.9 0c-.2-.2-.1-.5.1-.8m6.9 5.6c.1-.3.5-.4.8-.3c.3.1.4.5.3.8c-.1.3-.5.4-.8.3c-.3-.1-.4-.5-.3-.8Z"/></svg>`,
    location: `<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"/></svg>`,
    home: `<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5Z"/></svg>`,
  },
  secondaryIcon: {},
  subHeading: ["hierarchy_lvl1", "hierarchy_lvl2"] as string[],
  separator: "",
  description: [] as string[],
  descLength: undefined as undefined | number,
  sections: [] as string[],
  subSections: [] as string[],
  placement: "bottom-end" as Placement,
  limit: 10,
  config: computed(() => config[env.value]),

  groupIconsWithSlot: false,
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
          <search-bar class="flex-grow" v-bind="state">
            <template #groupIcon="{ group, config, results }">
              <group-icon
                v-if="state.groupIconsWithSlot"
                :group="group"
                :config="config"
                :results="results"
              />
            </template>
          </search-bar>
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
              <label for="groupBy">
                <span class="font-bold">groupBy</span>
                prop
              </label>
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

              <div class="flex flex-row mt-10 items-center">
                <input
                  type="checkbox"
                  class=""
                  :value="state.groupIconsWithSlot"
                  @change="
                    (e) => {
                      state.groupIconsWithSlot = isEventWithValue(e)
                        ? Boolean((e.target as any)?.checked )
                        : Boolean(state.groupIconsWithSlot);
                    }
                  "
                />
                <label for="groupIconsWithSlot" class="ml-4">
                  <span class="italic"
                    >add group icons using
                    <span class="font-bold">groupIcon</span> slot prop</span
                  >
                </label>
              </div>
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
