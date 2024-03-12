<template>
  <div id="helloView">
    <MdEdit :value="mdValue" :handle-change="onMdChange" />
    <CodeEditor :value-="codeValue" :handle-change="onCodeChange" />
    <h1>HelloView</h1>
  </div>
</template>

<script setup lang="ts">
import MdEdit from "@/components/MdEdit.vue";
import { ref } from "vue";
import CodeEditor from "@/components/CodeEditor.vue";

const mdValue = ref("");
const onMdChange = (val: string) => {
  mdValue.value = val;
};
const codeValue = ref("");
const onCodeChange = (val: string) => {
  codeValue.value = val;
};
</script>

<style scoped></style>
