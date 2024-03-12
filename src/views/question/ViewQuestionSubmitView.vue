<template>
  <div id="ViewQuestionSubmitView">
    <a-form :model="pageRequest" layout="inline">
      <a-form-item field="questionId" label="问题id搜索">
        <a-input
          v-model="pageRequest.questionId"
          style="min-width: 180px"
          placeholder="请输入问题id"
        />
      </a-form-item>
      <a-form-item field="language" label="编程语言搜索">
        <a-select v-model="pageRequest.language" placeholder="请选择语言">
          <a-option value="">全部</a-option>
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>c</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <!--        <a-button type="primary" @click="handleSearch">搜索</a-button>-->
      </a-form-item>
    </a-form>
    <a-divider :size="0" />
    <a-table
      :columns="columns"
      :data="showData"
      :pagination="{
        total: showData.length,
        /**
         * 不要使用 current属性，因为这个属性会使当前分页一致处于指定的值，无法改变
         */
        defaultCurrent: pageRequest.current,
        pageSize: pageRequest.pageSize,
        showTotal: true,
      }"
    >
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmit,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import * as path from "path";

const router = useRouter();

const pageRequest = reactive({
  questionId: "",
  language: "",
  current: 1,
  pageSize: 7,
  total: 0,
});
const questionData = ref<QuestionSubmit[]>([]);
const showData = computed(() => {
  return questionData.value.filter((data) => {
    return (
      new String(data.questionId)?.includes(pageRequest.questionId) &&
      data.language?.includes(pageRequest.language)
    );
  });
});
/**
 * 获取分页数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitUsingGet();
  if (res.code === 0) {
    // total.value = res.data?.length;
    pageRequest.total = res.data?.length as number;
    questionData.value = res.data as any;
    questionData.value.sort((a, b) => {
      let aTime = Date.parse(a.createTime);
      let bTime = Date.parse(b.createTime);
      return bTime - aTime;
    });
  } else {
    message.error("加载错误" + res.message);
  }
};

onMounted(() => {
  loadData();
  window.setInterval(() => {
    loadData();
  }, 3000);
});

const columns = [
  {
    title: "id",
    dataIndex: "id",
    ellipsis: true,
    tooltip: true,
    width: 100,
  },
  {
    title: "问题id",
    dataIndex: "questionId",
    ellipsis: true,
    tooltip: true,
    width: 100,
  },
  {
    title: "用户id",
    dataIndex: "userId",
    ellipsis: true,
    tooltip: true,
    width: 100,
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "judgeInfo",
    dataIndex: "judgeInfo",
  },
  {
    title: "status",
    dataIndex: "status",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];
</script>

<style scoped>
#ViewQuestionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
