<script setup lang="ts">
import { SearchBarConfig } from "~/types";
import { isEventWithValue } from "~/type-guards";
import { isDark, toggleDark } from "~/composables/dark";

type Env = "local" | "staging" | "production";

const env = ref<Env>("local");
const groupBy = ref("");

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

const limit = ref(10);
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
            class="icon-btn !outline-none p-1"
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
          <search-bar
            :config="config[env]"
            :limit="limit"
            :group-by="groupBy"
            class="flex-grow"
          />
        </div>
      </div>

      <div
        class="flex border-1 border-dotted border-gray-500 rounded p-2 w-full place-items-center"
      >
        <details open class="w-full">
          <summary class="">Component Settings</summary>
          <div class="playground mt-2 p-4 grid grid-cols-3 gap-2">
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
                class=""
              >
                <option value="local">Local Docker</option>
                <option value="staging">Staging Search</option>
                <option value="production">Production Search</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label for="groupBy"
                ><span class="font-bold">groupBy</span> prop</label
              >
              <select
                name="groupBy"
                id="groupBy"
                :value="groupBy"
                class=""
                @change="
                  (e) => {
                    groupBy = isEventWithValue(e) ? e.target.value : env;
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
            </div>
          </div>
        </details>
      </div>

      <div
        class="flex border-1 border-dotted border-gray-500 rounded p-2 w-full place-items-center"
      >
        <details class="w-full" open>
          <summary class="hover:bg-gray-100/25 cursor-pointer w-full p-1">
            Documentation
          </summary>

          <div class="p-4 flex flex-col space-y-2">
            <details>
              <summary>Meilisearch Look and Feel</summary>
              <img
                src="meili.png"
                alt="image of what meilisearch's own search bar looks like"
                class="max-w-90%"
              />
            </details>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 w-full pt-4">
              <div>
                <h2>Properties</h2>
                <div class="content"></div>
              </div>
              <div>
                <h2>Slots</h2>
              </div>
              <div>
                <h2>Config</h2>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
h2 {
  @apply text-2xl text-center rounded bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-1 py-2;
}

summary {
  @apply hover:bg-gray-100/25 dark:hover:bg-gray-900 cursor-pointer w-full p-1;
}

select {
  @apply px-4 py-3 bg-gray-50 dark:bg-gray-900;
}
</style>
