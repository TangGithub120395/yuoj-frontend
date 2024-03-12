<template>
  <div id="globalHeader">
    <a-row id="globalHeader" align="center" :wrap="false">
      <a-col flex="auto">
        <div>
          <a-menu
            mode="horizontal"
            :selected-keys="selectedKeys"
            @menu-item-click="doMenuClick"
          >
            <a-menu-item
              key="0"
              :style="{ padding: 0, marginRight: '38px' }"
              disabled
            >
              <div class="title-bar">
                <img class="logo" src="../assets/oj-logo.svg" />
                <div class="title">鱼OJ</div>
              </div>
            </a-menu-item>
            <a-menu-item v-for="item in visibleRoutes" :key="item.path">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </div>
      </a-col>
      <a-col flex="100px">
        <div>{{ store.state.user.loginUser.userName }}</div>
      </a-col>
    </a-row>
    <!--    <a-button @click="test">Test</a-button>-->
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";

const router = useRouter();
//selectedKeys:表示菜单栏中的哪个项被相中了
const selectedKeys = ref<string[]>([]);
const store = useStore();
// const loginUser = store.state.user.loginUser;

//过滤之后需要展示的路由
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    //过滤掉要隐藏的路由
    if (item.meta?.hidden) {
      return false;
    }
    //过滤掉权限不符合的路由
    //⚠️：要直接使用store.state中的数据，不能够使用中间变量
    return checkAccess(store.state.user.loginUser, item.meta?.access);
    // return true;
  });
});

//三秒后修改vuex中的数据
// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "Tang",
//     userRole: ACCESS_ENUM.ADMIN,
//   });
// }, 3000);

onMounted(() => {
  if (selectedKeys.value.length == 0) {
    if (sessionStorage.getItem("path")) {
      selectedKeys.value = [sessionStorage.getItem("path") as string];
    } else {
      selectedKeys.value = ["/"];
    }
  }
});

//路由跳转之后 => 同步更新菜单栏的高亮状态
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
  sessionStorage.setItem("path", to.path);
  // selectedKeys.value = ["/manage/question"];
});

// const test = () => {
//   console.log(selectedKeys.value);
// };

//用户点击菜单项 => 跳转更新路由
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>
<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 40px;
}
</style>
