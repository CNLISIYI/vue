import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: '/m/',
  routes: [
    // {
    //   // 在整个项目中，模块路径中的 @ 表示的是 src 目录
    //   // 无论你当前模块在哪里，@ 都可以直接定位到 src
    //   // 加载一个目录可以默认加载它的 index.js、index.vue、index.json。。。
    // },

    // { // layout 显示到 App 根组件的路由出口
    //   // name: 'layout', 
    //   path: '/',
    //   component: () => import('@/views/layout'),
    //   children: []
    // },
    {
      name: 'home', //首页
      path: '/',
      component: () => import('@/views/home'),
      children: [],
      meta: {
        keepAlive: true
      }
    }
  ],

})


export default router
