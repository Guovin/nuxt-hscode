import Vue from 'vue'
import axios from 'axios'
import NProgress from 'nprogress'

// 绑定axios默认访问地址
axios.defaults.baseURL = 'https://hscode.vip/api/'
// axios挂载到http原型对象上使用
Vue.prototype.$http = axios

// 发起request请求时展示进度条 Nprogress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start()
  return config // 在最后必须return config
})
// 接收到response时隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})