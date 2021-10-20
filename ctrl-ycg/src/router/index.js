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
    }, {
      name: 'productpost', //商品发布
      path: '/productpost',
      component: () => import('@/views/productpost'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'productmanage', //商品管理
      path: '/productmanage',
      component: () => import('@/views/productmanage'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'productlow', //低质商品
      path: '/productlow',
      component: () => import('@/views/productlow'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'productmove', //搬家优化
      path: '/productmove',
      component: () => import('@/views/productmove'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'bdminiapp', //百度权益
      path: '/bdminiapp',
      component: () => import('@/views/bdminiapp'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'shopscore', //商铺评分
      path: '/shopscore',
      component: () => import('@/views/shopscore'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'shoptrend', //趋势变化
      path: '/shoptrend',
      component: () => import('@/views/shoptrend'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'shopkeyword', //关键词
      path: '/shopkeyword',
      component: () => import('@/views/shopkeyword'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'shoprank', //商品排名
      path: '/shoprank',
      component: () => import('@/views/shoprank'),
      children: [],
      meta: {
        keepAlive: false
      }
    },{
      name: 'populardata', //推广数据
      path: '/populardata',
      component: () => import('@/views/populardata'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'managephoto', //图片管理
      path: '/managephoto',
      component: () => import('@/views/managephoto'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'managevideo', //视频管理
      path: '/managevideo',
      component: () => import('@/views/managevideo'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'manageclass', //自定义分类
      path: '/manageclass',
      component: () => import('@/views/manageclass'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'manageshop', //商铺管理
      path: '/manageshop',
      component: () => import('@/views/manageshop'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'myinformate', //我的资料
      path: '/myinformate',
      component: () => import('@/views/myinformate'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'mycertify', //实名认证
      path: '/mycertify',
      component: () => import('@/views/mycertify'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'myability', //我的资质
      path: '/myability',
      component: () => import('@/views/myability'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'agentmanage', //代发任务管理
      path: '/agentmanage',
      component: () => import('@/views/agentmanage'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'agentpost', //创建任务
      path: '/agentpost',
      component: () => import('@/views/agentpost'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'articlelist', //爱采购小课堂
      path: '/articlelist',
      component: () => import('@/views/articlelist'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'message', //消息
      path: '/message',
      component: () => import('@/views/message'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'newsbuy', //求购信息
      path: '/newsbuy',
      component: () => import('@/views/newsbuy'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'topup', //充值
      path: '/topup',
      component: () => import('@/views/topup'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'productedit', //批量修改产品
      path: '/productedit',
      component: () => import('@/views/productedit'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'solescore', //搜了店铺分
      path: '/solescore',
      component: () => import('@/views/solescore'),
      children: [],
      meta: {
        keepAlive: false
      }
    }, {
      name: 'bdanswer', //百度问答
      path: '/bdanswer',
      component: () => import('@/views/bdanswer'),
      children: [],
      meta: {
        keepAlive: false
      }
    }
  ],

})


export default router
