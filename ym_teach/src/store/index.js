import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

import getters from './getters'
import createPersistedState from 'vuex-persistedstate'
import {
  addRouter
} from "@/api/login"
import router from '@/router/index'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
  },
  state: {
    name: '', //用户名
    headImage: '', //头像
    limit: [], //权限列表
    call_count: "0", //呼叫次数
    monitorList: "{}", //兼课列表
    exercises: "", //习题
    analysis: "",
    DateilList:"",
    quitStudy:""
  },
  getters,
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })], //持久化
  mutations: {
    set_name(state, newName) {
      state.name = newName
    },
    set_headImage(state, newImg) {
      state.headImage = newImg
    },
    set_role(state, newRole) {
      state.limit = newRole
    },
    CALLCOUNT: (state, newCount) => {
      state.call_count = newCount
    },
    MONITOR: (state, newMonitorl) => {
      state.monitorList = newMonitorl
    },
    DATEILLIST:(state, DateilList)=>{
      state.DateilList = DateilList
    },
    QUITSTUDY:(state,quitStudy)=>{
      state.quitStudy = quitStudy
    }
  },
  actions: {
    setName: (context, newName) => {
      context.commit('set_name', newName)
    },
    setHeadImage: (context, newImg) => {
      context.commit('set_headImage', newImg)
    },
    setRole: (context, newRole) => {
      context.commit('set_role', newRole)
    },
    callCount: (context, callCount) => {
      context.commit('CALLCOUNT', callCount)
    },
    monitor: (context, monitorList) => {
      context.commit('MONITOR', monitorList)
    },
    monitorDateil:(context, Dateil)=>{
      context.commit('DATEILLIST', Dateil)
    },
    quitStudyJson:(context,quitStudyStr)=>{
      context.commit('QUITSTUDY', quitStudyStr)
    }
  }

})
export default store
