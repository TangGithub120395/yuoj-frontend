// import HelloView from "@/views/HelloView.vue";
import { RouteRecordRaw } from "vue-router";
// import AdminView from "@/views/AdminView.vue";
import NoAuthVIew from "@/views/NoAuthVIew.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import UpdateQuestionView from "@/views/question/UpdateQuestionView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import DoQuestionView from "@/views/question/DoQuestionView.vue";
import ViewQuestionSubmitView from "@/views/question/ViewQuestionSubmitView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
  },
  {
    path: "/",
    name: "题目列表",
    component: ViewQuestionView,
  },
  {
    path: "/question_submit/list",
    name: "提交列表",
    component: ViewQuestionSubmitView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/do/question/:id",
    name: "做题页面",
    component: DoQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hidden: true,
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/manage/question",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: UpdateQuestionView,
    meta: {
      hidden: true,
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/noAuth",
    name: "错误页面",
    component: NoAuthVIew,
    meta: {
      hidden: true,
    },
  },
  // {
  //   path: "/hidden",
  //   name: "隐藏页面",
  //   component: HelloView,
  //   meta: {
  //     hidden: true,
  //   },
  // },
  // {
  //   path: "/admin",
  //   name: "仅管理员可见",
  //   component: AdminView,
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //   },
  // },
];
