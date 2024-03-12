// initial state
// const state = () => ({
//   loginUser: {
//     userName: "未登录",
//   },
// });
//
// // getters
// const getters = {};
//
// // actions 执行异步操作，并且触发mutation的执行
// const actions = {
//   getLoginUser({ commit, state }, payload) {
//     commit("updateUser", { userName: "Tang" });
//   },
// };
//
// // mutations 更新数据
// const mutations = {
//   updateUser(state, payload) {
//     state.loginUser = payload;
//   },
// };

import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录",
    },
  }),
  getters: {},
  actions: {
    async getLoginUser({ commit, state }, payload) {
      //获取当前登录用户
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
