<script setup lang="ts">
import { PropType, Ref } from "vue";
import { isEventWithValue } from "src/type-guards";

type Env = "local" | "staging" | "production";

defineProps({
  /** the properties which exist on the search index */
  indexProps: { type: Array as PropType<string[]>, required: true },
  /** the property on the "state" which is being mutated */
  stateProp: { type: String, required: true },
  /** the ENV which this API is operating in */
  env: { type: Object as PropType<Ref<Env>> },
});
</script>

<template>
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
      <option v-for="prop in indexProps" :key="prop" :value="prop">
        {{ prop }} prop
      </option>
    </select>
  </div>
</template>
