<template>
  <div id="codeEditor">
    <!--    <a-button @click="test">test</a-button>-->
    <div id="code-editor" ref="codeEditorRef" style="height: 70vh" />
  </div>
</template>
<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";

//通过ref获取被标记的DOM元素
const codeEditorRef = ref();
//codeEditor用来存储创建出来的代码编辑器
const codeEditor = ref();
// const test = () => {
//   console.log(props.language);
// };

interface Props {
  value: string;
  handleChange: (value: string) => void;
  language?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  handleChange: () => {
    console.log("代码编辑器");
  },
  language: () => "java",
});
watch(
  () => props.language,
  () => {
    // console.log(props.language);
    monaco.editor.setModelLanguage(
      toRaw(codeEditor.value).getModel(),
      props.language
    );
  }
);
//设置代码编辑器当中的值
// const test = () => {
//   if (!codeEditor.value) {
//     return;
//   }
//   //这个可以不放在onMounted中，因为这个是绑定的事件
//   toRaw(codeEditor.value).setValue("HHHH");
// };
onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  // Hover on each property to see its docs!
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: "",
    language: "java",
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    // lineNumbers: "on",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
    readOnly: false,
    theme: "vs-dark",
  });
  //获取代码编辑器当中的值（这个只能够放在onMounted中才能获取到，为什么？因为代码编辑器还没有创建完成）
  codeEditor.value.onDidChangeModelContent(() => {
    // console.log("Content:", toRaw(codeEditor.value).getValue());
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<style scoped>
#code-editor {
  min-height: 300px;
}
</style>
