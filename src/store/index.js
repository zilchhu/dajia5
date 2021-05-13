import Vue from "vue";
import Vuex from "vuex";
import types from "./mutation-types";
import defaultValue from "../services/default";
import * as api from "../api";
import { getCurrentMenu, getSessionKey } from "../common/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true, // process.env.NODE_ENV !== 'production', 直接修改state 抛出异常

  getters: {
    loading: state => state.loading,
    menuList: state => state.menuList,
    sidebar: state => state.sidebar,
    userInfo: state => state.userInfo,
    device: state => state.device,
    currentMenus: state => state.currentMenus
  },
  state: {
    loading: false,
    menuList: {},
    sidebar: {
      collapsed: getSessionKey("state.sidebar.collapsed", "false") === "true",
      show: getSessionKey("state.sidebar.show", "true") === "true"
    },
    device: {
      isMobile: false
    },
    userInfo: { name: "user" },
    currentMenus: [],
    elms: []
  },
  mutations: {
    //只能同步的函数
    [types.TOGGLE_DEVICE](state, isMobile) {
      state.device.isMobile = isMobile;
    },
    [types.TOGGLE_LOADING](state) {
      state.loading = !state.loading;
    },
    [types.LOAD_MENU](state, menu) {
      state.menuList = menu;
    },
    [types.LOAD_CURRENT_MENU](state, menu) {
      state.currentMenus = menu;
    },
    [types.SET_USER_INFO](state, info) {
      state.userInfo = info;
    },
    [types.TOGGLE_SIDEBAR](state, collapsed) {
      if (collapsed == null) collapsed = !state.sidebar.collapsed;
      state.sidebar.collapsed = collapsed;
      window.sessionStorage.setItem("state.sidebar.collapsed", collapsed);
    },
    [types.TOGGLE_SIDEBAR_SHOW](state, show) {
      if (show == null) state.sidebar.show = !state.sidebar.show;
      else {
        state.sidebar.show = show;
      }
      window.sessionStorage.setItem("state.sidebar.show", state.sidebar.show);
    }
  },
  actions: {
    //异步的函数
    toggleLoading: ({ commit }) => commit(types.TOGGLE_LOADING),
    loadMenuList: ({ commit }) => {
      // if (localStorage.getItem("menuList")) {
      //   commit(types.LOAD_MENU, JSON.parse(localStorage.getItem("menuList")));
      // } else {
      //   localStorage.setItem("menuList", JSON.stringify(defaultValue.menuList));
      //   commit(types.LOAD_MENU, defaultValue.menuList);
      // }
      Vue.axios
        .get('http://192.168.3.112:9020/menus')
        .then(res => {
          commit(types.LOAD_MENU, JSON.parse(res.data.menu));
        })
        .catch(exp => commit(types.LOAD_MENU, defaultValue.menuList));
    },
    changeCurrentMenu: ({ state, commit }, { path, matched, fullPath }) => {
      const a = getCurrentMenu(fullPath, state.menuList);
      commit(types.LOAD_CURRENT_MENU, a.reverse());
    }
  }
});

export default store;
