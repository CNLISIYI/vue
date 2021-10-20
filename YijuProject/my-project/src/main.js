// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 全局注册组件，先import，再在下面vue.component使用。
import Appfooter from './components/Appfooter'
import Appheader from './components/Appheader'
import Appbacktop from './components/Appbacktop'
import Appnav from './components/Appnav'
import Appminenav from './components/Appminenav'

// 使用axios调用接口
import axios from 'axios'
Vue.prototype.$axios = axios

Vue.component("Appfooter",Appfooter)
Vue.component("Appheader",Appheader)
Vue.component("Appbacktop",Appbacktop)
Vue.component("Appnav",Appnav)
Vue.component("Appminenav",Appminenav)

Vue.use(ElementUI)//全局使用ElementUI
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
