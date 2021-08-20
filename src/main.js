import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
import store from './store'

// 说明：API V1 认证统一使用 Token 认证
//      需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
// （登录成功会返回 token 字段信息）
// 通过 axios 添加请求拦截器 保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // console.log(config);
  // 为请求头对象添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 在最后必须return config
  return config;
})

// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/' // 白嫖 API 接口地址
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/' // 白嫖 +1
// 将 axios 挂载到 Vue 原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
