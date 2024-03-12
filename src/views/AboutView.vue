<template>
  <div id="aboutView">
    <CodeEditor :value-="value" :handle-change="onChange" />
    <MdEdit />
    <button @click="test">Test</button>
  </div>
</template>

<script setup lang="ts">
import CodeEditor from "@/components/CodeEditor.vue";
import { ref } from "vue";
import MdEdit from "@/components/MdEdit.vue";

const value = ref();
const onChange = (val: string) => {
  value.value = val;
  console.log(val);
};

const test = () => {
  console.log(value.value);
};
</script>

<style scoped></style>
