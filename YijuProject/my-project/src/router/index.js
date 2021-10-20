import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({

  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   // 在整个项目中，模块路径中的 @ 表示的是 src 目录
    //   // 无论你当前模块在哪里，@ 都可以直接定位到 src
    //   // 加载一个目录可以默认加载它的 index.js、index.vue、index.json。。。
    //   component: () => import('@/views/home')
    // },

    // 只要有新的页面，就需要在这里注册好路由。
    // 放在第一个的 就是默认的首页
    { // layout 显示到 App 根组件的路由出口
      // name: 'layout', 
      path: '/',
      component: () => import('@/views/layout'),
      children: []
    },
    {
      name: 'login', //登陆
      path: '/login', 
      component: () => import('@/views/login'),
    },
    {
      name: 'signup', //注册
      path: '/signup',
      component: () => import('@/views/signup')
    },
    {
      name: 'home', //首页
      path: '/home',
      component: () => import('@/views/home')
    },
    {
      name: 'homeindex', //房源详情页
      path: '/homeindex',
      component: () => import('@/views/homeindex')
    },
    {
      name: 'myself', //个人中心-个人资料
      path: '/myself',
      component: () => import('@/views/myself')
    },
    {
      name: 'message', //系统消息
      path: '/message',
      component: () => import('@/views/message')
    },
    {
      name: 'history', //浏览记录
      path: '/history',
      component: () => import('@/views/history')
    },
    {
      name: 'mylike', //我的收藏
      path: '/mylike',
      component: () => import('@/views/mylike')
    },
    {
      name: 'myhouse', //我发布的房源
      path: '/myhouse',
      component: () => import('@/views/myhouse')
    },
    {
      name: 'apply', //申请房东
      path: '/apply',
      component: () => import('@/views/apply')
    },
    {
      name: 'posthouse', //发布房源
      path: '/posthouse',
      component: () => import('@/views/posthouse')
    },
    {
      name: 'notdone', //发布房源
      path: '/notdone',
      component: () => import('@/views/notdone')
    },
    {
      name: 'userlist', //管理会员
      path: '/userlist',
      component: () => import('@/views/userlist')
    },

  ]
})

export default router
