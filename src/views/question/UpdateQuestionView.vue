<template>
  <div id="updateQuestionView">
    <h2>更新题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEdit :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEdit :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 640px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例-${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入测试输入用例"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].output`"
              :label="`输出用例-${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入测试输出用例"
              />
            </a-form-item>
            <a-button status="danger" @click="handleDelete(index)">
              删除
            </a-button>
          </a-space>
        </a-form-item>
        <div style="margin-top: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button
          html-type="submit"
          type="primary"
          style="min-width: 200px"
          @click="handleSubmit"
          >更新题目
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import MdEdit from "@/components/MdEdit.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
// const questionData = ref();

const loadData = async (id: number) => {
  const res = await QuestionControllerService.getQuestionByIdUsingGet(id);
  if (res.code === 0) {
    //相当于Spring当中的BeanUtils.copyProperties(target,resource)
    //为了保持响应式
    Object.assign(form, res.data);
    form.tags = JSON.parse(res.data?.tags as any);
    form.judgeCase = JSON.parse(res.data?.judgeCase as any);
    form.judgeConfig = JSON.parse(res.data?.judgeConfig as any);
    // console.log(JSON.parse(res.data?.tags));
    console.log(form);
  } else {
    message.error("加载失败" + res.message);
  }
};

onMounted(() => {
  // console.log(route.query?.id);
  // let id = Number.parseInt(route?.query?.id);
  // console.log(id);
  loadData(route?.query?.id as any);
});

const form = reactive({
  //需要提交的数据
  answer: "",
  content: "",
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 0,
    stackLimit: 0,
    timeLimit: 0,
  },
  tags: [],
  title: "",
});

const handleSubmit = async () => {
  const res = await QuestionControllerService.updateQuestionUsingPost(form);
  //更新成功后，返回管理题目页面
  if (res.code === 0) {
    message.success("更新成功");
    router.push({
      path: "/manage/question",
    });
  } else {
    message.error("更新失败" + res.message);
  }
};
const handleAdd = () => {
  form.judgeCase.push({
    input: "",
    output: "",
  });
};
const onAnswerChange = (val: string) => {
  form.answer = val;
};
const onContentChange = (val: string) => {
  form.content = val;
};
const handleDelete = (index: number) => {
  form.judgeCase.splice(index, 1);
};
</script>

<style scoped>
#addQuestionView {
}
</style>
