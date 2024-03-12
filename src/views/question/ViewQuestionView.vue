<template>
  <div id="viewQuestionView">
    <a-form :model="pageRequest" layout="inline">
      <a-form-item field="title" label="标题搜索">
        <a-input
          v-model="pageRequest.title"
          style="min-width: 180px"
          placeholder="请输入标题"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签搜索">
        <a-input-tag
          v-model="pageRequest.tags"
          style="min-width: 180px"
          placeholder="请输入标签"
        />
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
      <template #tags="{ record }">
        <a-space>
          <a-tag
            v-for="(tag, index) in record.tags"
            :key="index"
            color="arcoblue"
          >
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        <a-space>
          <a-statistic
            :value="
              record.submitNum == 0
                ? 0
                : (record.acceptNum / record.submitNum) * 100
            "
            :precision="2"
            :value-style="{ color: '#0fbf60', fontSize: '20px' }"
          >
            <template #suffix>%</template>
          </a-statistic>
        </a-space>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="handleView(record)">查看</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import * as path from "path";

const router = useRouter();

const pageRequest = reactive({
  title: "",
  tags: [],
  current: 1,
  pageSize: 10,
  total: 0,
});
// const total = ref();
const questionData = ref<Question[]>([]);
const showData = computed(() => {
  let s = questionData.value.filter((data) => {
    //筛选标签
    for (let i = 0; i < pageRequest.tags.length; i++) {
      if (!data.tags?.includes(pageRequest.tags[i])) {
        return false;
      }
    }
    //筛选标题(只要标签筛选通过之后才能够来到这里)
    return data.title?.includes(pageRequest.title);
  });
  return s;
});
/**
 * 获取分页数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoUsingGet();
  if (res.code === 0) {
    // total.value = res.data?.length;
    pageRequest.total = res.data?.length as number;
    questionData.value = res.data as any;
    console.log(questionData.value);
  } else {
    message.error("加载错误" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const handleView = async (question: Question) => {
  console.log(question.id);
  router.push({
    path: `/do/question/${question.id}`,
  });
};
// const handleSearch = () => {
//   questionData.value = questionData.value.filter((data) => {
//     //筛选标签
//     for (let i = 0; i < pageRequest.tags.length; i++) {
//       if (!data.tags?.includes(pageRequest.tags[i])) {
//         return false;
//       }
//     }
//     //筛选标题(只要标签筛选通过之后才能够来到这里)
//     return data.title?.includes(pageRequest.title);
//   });
//   //设置总条数
//   pageRequest.total = questionData.value.length;
// };

const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    slotName: "optional",
  },
];
</script>

<style scoped>
#viewQuestionView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
