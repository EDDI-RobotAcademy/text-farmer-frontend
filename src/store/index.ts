import { createStore } from 'vuex'
import boardModule from "@/board/store/boardModule";
import accountModule from '@/account/store/accountModule';

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    boardModule,
    accountModule
  }
})
