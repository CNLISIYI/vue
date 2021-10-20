<template>
  <!--
    el-menu 组件
      default-active 设置默认激活的项
      open、close 当菜单展开和收起的时候会被触发
      background-color 菜单栏背景色
      text-color 菜单栏默认文本颜色
      active-text-color 激活时候的文本文件
      router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转

    el-submenu
      index 用来区分不同的导航项目的，可以用作路由导航路径，必须唯一，否则会出现菜单冲突
   -->
  <el-menu
    default-active="2"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :router="true"
  >
    <el-menu-item index="/">
      <i class="iconfont icon-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="iconfont icon-document"></i>
        <span>内容</span>
      </template>
      <el-menu-item index="/publish">
        <i class="iconfont icon-edit"></i>
        <span slot="title">发布</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="iconfont icon-icon-articles"></i>
        <span slot="title">内容列表</span>
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="/comment">
      <i class="iconfont icon-comment"></i>
      <span slot="title">评论</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont icon-image"></i>
      <span slot="title">素材</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="iconfont icon-fensi"></i>
      <span slot="title">粉丝</span>
    </el-menu-item>
    <el-menu-item index="/account">
      <i class="iconfont icon-account"></i>
      <span slot="title">账户</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {}
  },

  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}
</style>
