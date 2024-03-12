<template>
  <div id="doQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" title="题目">
            <a-card :title="questionData?.title">
              <ViewEdit :value="questionData?.content" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of questionData?.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="2" title="题解">
            <h1>暂无题解</h1>
          </a-tab-pane>
          <a-tab-pane key="3" title="评论" disabled></a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-select
          :style="{ width: '320px', marginBottom: '16px' }"
          v-model="form.language"
          placeholder="请选择语言"
        >
          <a-option>java</a-option>
          <!--          <a-option>cpp</a-option>-->
          <!--          <a-option>go</a-option>-->
        </a-select>
        <CodeEditor
          :value="form.code"
          :language="form.language"
          :handle-change="onCodeChange"
        />
        <a-button
          @click="handleSubmitCode"
          style="min-width: 180px"
          type="primary"
          >提交代码
        </a-button>
      </a-col>
    </a-row>
    <!--    <a-button @click="test">test</a-button>-->
  </div>
</template>

<script setup lang="ts">
import { onMounted, withDefaults, defineProps, ref } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import ViewEdit from "@/components/ViewEdit.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const questionData = ref<QuestionVO>();
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  questionId: props.id as any,
  code: "",
});
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    questionData.value = res.data;
    console.log(questionData.value);
  } else {
    message.error("加载失败" + res.message);
  }
};
const onCodeChange = (val: string) => {
  form.value.code = val;
};
const handleSubmitCode = async () => {
  const res = await QuestionControllerService.doQuestionSubmitUsingPost(
    form.value
  );
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败" + res.message);
  }
};
// const test = () => {
//   console.log(form.value.language);
// };
onMounted(() => {
  loadData();
});
</script>

<style>
#doQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#doQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
