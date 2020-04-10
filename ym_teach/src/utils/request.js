import axios from 'axios';
import router from '../router' // 导入路由文件
import Vue from 'vue'
import qs from 'qs'
import {
  Message,
  MessageBox
} from 'element-ui';
import store from '../store';
import {
  getToken
} from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ?
  //   'http://192.168.1.199:9090' : //测试
  //   'http://192.168.1.176:9090', //正式 api 的 base_url
  baseURL: process.env.NODE_ENV,
  timeout: 50000, // 请求超时时间(因为需要调试后台,所以设置得比较大)
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
//service.defaults.headers.post['Content-Type']='application/json;charset=UTF-8'
const alertErrorMessage=(msg)=>{
  if(msg)
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
}
// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken() //让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.data = qs.parse(config.data)
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
    // hideLoading()//关loading
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {

    // hideLoading()//关loading
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    if (res.status != '0') {
      if(res.msg.includes("session失效")&&sessionStorage.getItem('alertSessionIsValid')!=='Y'){
        sessionStorage.setItem('alertSessionIsValid','Y');
        alertErrorMessage(res.msg);
      }else if(!res.msg.includes("session失效")){
        alertErrorMessage(res.msg);
      }

      if (res.status == 50012 || res.status == 9999) {

        setTimeout(() => {
          router.replace({
            path: '/login',
            // query: {
            //   redirect: router.currentRoute.fullPath
            // }
          });
          sessionStorage.clear();
        }, 500)

      }
      return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {
    // hideLoading()//关loading
    console.log('err' + error) // for debug
  //  alertErrorMessage(error.data.msg);
    return Promise.reject(error)
  }
)

export default service
