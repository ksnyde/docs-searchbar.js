<script setup lang="ts">
import { SearchBarConfig } from "./types";

const config: SearchBarConfig = {
  hostUrl: "https://search2.tauri.studio",
  apiKey:
    "XZEH8BS90ee09c45215a8421c06857bcbde5c1a6797bdf4859a57a3ac1228a2b81df0994",
  index: "consolidated",
  primaryKey: "objectID",
  debug: true,
};

const limit = ref(10);
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div
      class="flex flex-col mt-8 flex-grow space-y-4 max-w-6xl flex-grow place-items-center"
    >
      <div class="grid grid-cols-8 w-full">
        <div class="col-span-2">&nbsp;</div>
        <h1 class="text-3xl col-span-4 text-center">
          <div class="">
            <span class="px-1 py-0.5 bg-blue-600 rounded text-gray-50"
              >meili-searchbar</span
            >
            Component
          </div>
        </h1>
        <div class="right col-span-2">
          <search-bar :config="config" :limit="limit" />
        </div>
      </div>

      <div
        class="flex border-1 border-dotted border-gray-500 rounded p-2 w-6xl place-items-center"
      >
        <details open class="w-full">
          <summary class="hover:bg-gray-100/25 cursor-pointer w-full p-1">
            Component Settings
          </summary>
          <div class="playground min-h-lg mt-2 p-4">
            <!--  -->
            config
          </div>
        </details>
      </div>

      <div
        class="flex border-1 border-dotted border-gray-500 rounded p-2 w-6xl place-items-center"
      >
        <details class="w-full">
          <summary class="hover:bg-gray-100/25 cursor-pointer w-full p-1">
            Documentation
          </summary>

          <div class="p-4">
            <details>
              <summary>Meilisearch Look and Feel</summary>
              <img
                src="meili.png"
                alt="image of what meilisearch's own search bar looks like"
                class="max-w-50rem"
              />
            </details>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>
