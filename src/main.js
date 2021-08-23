import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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

// 组件全局注册 表格树
Vue.component('tree-table', TreeTable)

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
Vue.filter('dataFormat', function (originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    // yyyy-mm-dd hh:mm:ss
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
