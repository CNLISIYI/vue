import Vue from 'vue'
import Router from 'vue-router'

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
      name: 'information', //信息录入
      path: '/information',
      component: () => import('@/views/information'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'manageuser', //用户管理
      path: '/manageuser',
      component: () => import('@/views/manageuser'),
      children: [],
      meta: {
        keepAlive: false
      }
    },{
      name: 'managetan', //碳汇项目管理
      path: '/managetan',
      component: () => import('@/views/managetan'),
      children: [],
      meta: {
        keepAlive: false
      }
    },{
      name: 'managedone', //成交单管理
      path: '/managedone',
      component: () => import('@/views/managedone'),
      children: [],
      meta: {
        keepAlive: false
      }
    },{
      name: 'agreement', //协议成交管理
      path: '/agreement',
      component: () => import('@/views/agreement'),
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
    },{
      name: 'setfee', //服务费配置
      path: '/setfee',
      component: () => import('@/views/setfee'),
      children: [],
      meta: {
        keepAlive: false
      }
    },
  ],

})

router.beforeEach((to, from, next) => {
  const userInfo = localStorage.getItem('user_info')
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
