// import { useRouter } from "vue-router";
// import { useStore } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";

//不能在ts文件当中使用useRouter和useStore函数
// const router = useRouter();
// const store = useStore();
//应该直接导入ts文件
import router from "@/router";
import store from "@/store";
import checkAccess from "@/access/checkAccess";
import { computed } from "vue";

//当访问路由的时候执行以下函数
router.beforeEach(async (to, from, next) => {
  // console.log(store.state.user.loginUser);
  // console.log(from);
  // const loginUser = computed(() => {
  //   return store.state.user.loginUser;
  // });
  let loginUser = store.state.user.loginUser;
  //如果之前没有登录过，自动登录
  if (!loginUser.value || !loginUser.value.userRole) {
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.loginUser;
  }
  // console.log(loginUser);
  //获取访问路由需要的权限,如果这个路由没有设置权限，就默认为未登录权限即可访问
  const needAccess = to.meta?.access ?? ACCESS_ENUM.NOT_LOGIN;
  //没有权限的时候
  // console.log(loginUser);
  // console.log(!checkAccess(loginUser, needAccess));
  if (!checkAccess(loginUser, needAccess)) {
    //如果你没有登录，发生权限不足的话，就跳转到登录耶main
    // console.log(loginUser.userRole);
    if (loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
      //to.fullPath:想要跳转到的路由，当你在/user/login登录成功后可以获取redirect参数的值来跳转到这个路由
      console.log("跳转到登录页面");
      next(`/user/login?redirect=${to.fullPath}`);
    } else {
      //如果你登录了，发生权限不足的话，就跳转到错误页面
      console.log("跳转到错误页面");
      next("/noAuth");
    }
  }
  next();
});
