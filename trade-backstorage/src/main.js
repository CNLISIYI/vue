// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'


// 外部组件样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueClipboard from 'vue-clipboard2'
Vue.use(ElementUI)
Vue.use(VueClipboard)


// 公共方法 数据 接口
import tools from './utils/utils'
import state from './store/state'
import axios from 'axios'
import qs from 'qs'
import cookies from 'vue-cookies'

Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.$tools = tools
Vue.prototype.$state = state
Vue.prototype.$cookies = cookies;

// 组件
import Appheader from './components/AppHeader'
import Appaside from './components/AppAside'
import Appheadupload from './components/AppHeadUpload'
Vue.component("Appheader", Appheader)
Vue.component("Appaside", Appaside)
Vue.component("Appheadupload", Appheadupload)


Vue.config.productionTip = false


import versionTood from './utils/versionUpdate'
router.beforeEach(( to, from, next ) => {
  //判断当前代码版本是否与服务器中代码版本一致，如不一致则刷新页面获取最新
  versionTood.isNewVersion(); 
  next();
})

router.afterEach((to, from, next) => {
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0

  // next()
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
