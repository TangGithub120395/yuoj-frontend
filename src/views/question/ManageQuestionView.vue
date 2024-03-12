<template>
  <div id="manageQuestionView">
    <a-table
      :columns="columns"
      :data="questionData"
      :pagination="{
        total: total,
        /**
         * 不要使用 current属性，因为这个属性会使当前分页一致处于指定的值，无法改变
         */
        defaultCurrent: pageRequest.current,
        pageSize: pageRequest.pageSize,
        showTotal: true,
      }"
    >
      <template #tags="{ record }">
        <a-space>
          <a-tag
            v-for="(tag, index) in JSON.parse(record.tags)"
            :key="index"
            color="arcoblue"
          >
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #judgeConfig="{ record }">
        <a-space direction="vertical">
          <a-tag color="arcoblue">
            时间限制：{{ JSON.parse(record.judgeConfig).timeLimit }}
          </a-tag>
          <a-tag color="green">
            内存限制：{{ JSON.parse(record.judgeConfig).memoryLimit }}
          </a-tag>
          <a-tag color="pinkpurple">
            堆栈限制：{{ JSON.parse(record.judgeConfig).stackLimit }}
          </a-tag>
        </a-space>
      </template>
      <template #submitNum="{ record }">
        <a-space size="large">
          <a-statistic :value="record.submitNum" />
        </a-space>
      </template>
      <template #acceptNum="{ record }">
        <a-space size="large">
          <a-statistic
            :value="record.acceptNum"
            :value-style="{ color: 'green' }"
          />
        </a-space>
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="handleUpdate(record)"
            >更新
          </a-button>
          <a-button status="danger" @click="handleDelete(record)"
            >删除
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";

const pageRequest = {
  current: 1,
  pageSize: 5,
};
const total = ref();
const questionData = ref<Question[]>([]);
const router = useRouter();
/**
 * 获取分页数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionUsingGet();
  if (res.code === 0) {
    total.value = res.data?.length;
    questionData.value = res.data as any;
  } else {
    message.error("加载错误" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const handleUpdate = async (question: Question) => {
  // console.log(question);
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};

const handleDelete = async (question: Question) => {
  console.log(question);
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  //刷新表格
  loadData();
  if (res.code === 0) {
    message.success("删除成功");
  } else {
    message.error("删除失败" + res.message);
  }
};

const columns = [
  {
    title: "id",
    dataIndex: "id",
    ellipsis: true,
    tooltip: true,
    width: 50,
  },
  {
    title: "标题",
    dataIndex: "title",
    ellipsis: true,
    tooltip: true,
    width: 100,
  },
  {
    title: "内容",
    dataIndex: "content",
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: "标签",
    slotName: "tags",
    width: 100,
  },
  {
    title: "答案",
    dataIndex: "answer",
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: "测试用例",
    dataIndex: "judgeCase",
  },
  {
    title: "测试配置",
    slotName: "judgeConfig",
  },
  {
    title: "提交数",
    slotName: "submitNum",
    width: 90,
  },
  {
    title: "通过数",
    slotName: "acceptNum",
    width: 90,
  },
  // {
  //   title: "创建时间",
  //   dataIndex: "createTime",
  // },
  // {
  //   title: "更新时间",
  //   dataIndex: "updateTime",
  // },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped>
#manageQuestionView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
