import Vue from 'vue'
import Router from 'vue-router'
import cookies from 'vue-cookies'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  // base: '/m/',
  routes: [{
      name: 'login', //登录
      path: '/login',
      component: () => import('@/views/login'),
      children: [],
      meta: {
        keepAlive: false
      }
    },
    {
      name: 'home', //首页
      path: '/',
      component: () => import('@/views/home'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'banner', //banner管理
      path: '/banner',
      component: () => import('@/views/banner'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'managenews', //内容管理
      path: '/managenews',
      component: () => import('@/views/managenews'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'changepw', //修改密码
      path: '/changepw',
      component: () => import('@/views/changepw'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'newspost', //发布内容
      path: '/newspost',
      component: () => import('@/views/newspost'),
      children: [],
      meta: {
        keepAlive: false
      }
    },{
      name: 'setuser', //人员管理
      path: '/setuser',
      component: () => import('@/views/setuser'),
      children: [],
      meta: {
        keepAlive: false
      }
    },{
      name: 'setrole', //角色管理
      path: '/setrole',
      component: () => import('@/views/setrole'),
      children: [],
      meta: {
        keepAlive: false
      }
    },{
      name: 'sethistory', //操作管理
      path: '/sethistory',
      component: () => import('@/views/sethistory'),
      children: [],
      meta: {
        keepAlive: false
      }
    },
  ],

})

router.beforeEach((to, from, next) => {
  const userInfo = cookies.get('authorization')
  if (userInfo) {
    if (to.path == '/login') {
      next('/');
    } else {
      next();
    }
  } else {
    if (to.path == '/login') {
      next();
    } else { //不然就跳转到登录;
      next('/login');
    }
  }
})

export default router
