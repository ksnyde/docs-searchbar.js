<script setup lang="ts">
defineProps({
  group: { type: String, required: true },
});
</script>

<template>
  <div class="group-icon">
    <vscode-icons:file-type-apib v-if="group.toLowerCase() === 'api'" />
    <mdi:file-document v-if="group.toLowerCase() === 'prose'" />
    <mdi:github v-if="group.toLowerCase() === 'repo'" />
    <ic:round-code v-if="group.toLowerCase() === 'code'" />
    <fluent:document-unknown-24-regular
      v-if="group.toLowerCase() === 'unknown'"
    />
    <fluent:document-unknown-24-regular
      v-if="group.toLowerCase() === 'undefined'"
    />
    <ep:document-copy v-if="group.toLowerCase() === 'documentation'" />
    <carbon:development v-if="group.toLowerCase() === 'development'" />
    <cib:rust v-if="group.toLowerCase() === 'rust'" />
    <file-icons:typescript v-if="group.toLowerCase() === 'typescript'" />
    <zondicons:plugin v-if="group.toLowerCase() === 'plugin'" />
    <bx:bx-link-alt v-if="group.toLowerCase() === 'tauri'" />
    <eos-icons:application-window-outlined
      v-if="group.toLowerCase() === 'window'"
    />
    <icon-park-outline:guide-board v-if="group.toLowerCase() === 'guides'" />
    <clarity:bundle-line v-if="group.toLowerCase() === 'bundler'" />
    <mdi:run v-if="group.toLowerCase() === 'get-started'" />
    <ic:baseline-security-update v-if="group.toLowerCase() === 'updater'" />
    <clarity:network-globe-line v-if="group.toLowerCase() === 'http'" />
    <ph:info-light v-if="group.toLowerCase() === 'about'" />
  </div>
</template>
