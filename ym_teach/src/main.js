// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from './router/index'

import axios from 'axios'
import request from '@/utils/request'
import $axios from './utils/request'

import store from './store/index'

import './assets/style/index.scss'
import './assets/style/common.css'
import qs from 'qs'
import 'default-passive-events'

import globalComponents from '@/components/globalComponents.js'

Vue.config.productionTip = false

Vue.prototype.$axios = request
Vue.prototype.qs = qs
Vue.prototype.axios = axios
import Notification from './components/notification'
Vue.use(Notification)
Vue.use(ElementUI)
Vue.use(globalComponents)

import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

//路由守卫
import {
  addRouter
} from './api/login'
router.beforeEach((to, form, next) => {
  let add = window.sessionStorage.getItem('addRouter')
  if (add) {
    if (add == 1) {
      if (to.path !== '/addrouter') {
        window.sessionStorage.setItem('firstTo', to.fullPath)
      }
      window.sessionStorage.removeItem('addRouter')
      next('/addrouter')
      //next('/addrouter')这函数跑完了，会回来，这进跳回之前的页面
      let firstTo = window.sessionStorage.getItem('firstTo')
      next(firstTo)
    }
  } else {
    // if (to.name == 'login') {
    //   next();
    // } else {
    //   if (getToken()) {
    //     next();
    //   } else {
    //     next('/login');
    //   }
    // }
    if(getToken()){
      next();
    }else{    
      if( to.path.includes('/teaching/appraisal_report')  ){   
        let url = decodeURIComponent(window.location.hash) //解码 
        next({ path: '/share_report', query: { 
          courseId: to.query.courseId,
          studentId: to.query.studentId 
        }})
      }else if(to.path.includes('/teaching/appraisal_record') ){
        let urlcourse = decodeURIComponent(to.query.course) //解码
        let urlendTime = decodeURIComponent(to.query.endTime) //解码
        let urlname = decodeURIComponent(to.query.name) //解码
        let urltime = decodeURIComponent(to.query.time) //解码
        next({ path: '/share_record', query: {  courseId: to.query.courseId,
          studentId: to.query.studentId,
          course: urlcourse,
          endTime: urlendTime,
          name: urlname,
          time: urltime }})
      }else if(to.name == 'login'){    
        next()
      }else if(to.path == '/share_report' || to.path == '/share_record') {
        next()
      }else{
        next('/login')
      }
    }
  }
  // 要有一个页面去添加路由，进不了添加路由的代码
  if (to.path == '/addrouter') {
    //在空页面添加路由
    let limit = store.state.limit
    let addLimit = addRouter(limit);
    router.addRoutes(addLimit);
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
