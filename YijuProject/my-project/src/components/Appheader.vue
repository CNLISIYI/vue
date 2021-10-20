<template>
    <div>
        <div class="top-logo">
          <div class="logo">
              <img class="logo-img" src="@/assets/logo.png" alt="logo">
              <img src="@/assets/yj.png" alt="宜居">
          </div>
          <h2>您在厦门的长短租助手</h2>
          <div class="top-myself">
            <!-- 页面头部，用element-ui的导航组件 -->
              <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
              <el-submenu index="1">
                  <template slot="title">个人中心</template>
                  <router-link target="_blank" :to="{name:'myself',query:{identity:identity,uid:uid}}"><el-menu-item>我的资料</el-menu-item></router-link>
                  <router-link target="_blank" :to="{name:'mylike',query:{identity:identity,uid:uid}}"><el-menu-item>我的收藏</el-menu-item></router-link>
                  <router-link target="_blank" :to="{name:'history',query:{identity:identity,uid:uid}}"><el-menu-item>我的足迹</el-menu-item></router-link>
                  <router-link v-if="identity==2" target="_blank" :to="{name:'userlist',query:{identity:identity,uid:uid}}"><el-menu-item>管理会员</el-menu-item></router-link>
                  <router-link :to="'login'"><el-menu-item>退出登录</el-menu-item></router-link>
              </el-submenu>
              </el-menu>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      activeIndex: "1",
    };
  },
  props: {
    identity: {
      type: String,
      value: 0
    },
    uid: {
      type: String,
      value: ""
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.top-header {
  position: relative;
  height: 70px;

  img {
    width: 100%;
    height: 100%;
  }
  span {
    position: absolute;
    display: inline-block;
    bottom: 5px;
    right: 50px;
    height: 14px;
    padding: 0px 4px;
    color: #ffffff;
    text-align: center;
    line-height: 14px;
    font-size: 12px;
  }
}
.top-logo {
  height: 65px;
  margin: 0 auto 20px;
  padding: 30px 150px 0px;
  background-image: linear-gradient(#ffffff 40%, #f2f2f2);
  font-size: 0;
  border-bottom: 1px solid #e6e6e6;

  h2 {
    display: inline-block;
    margin-left: 40px;
    color: #62ab00;
    line-height: 1;
    font-size: 26px;
    vertical-align: bottom;
    margin-bottom: 8px;
  }
}
.logo {
  display: inline-block;
  font-size: 0;

  img {
    display: inline-block;
    vertical-align: middle;
  }

  .logo-img {
    margin-right: 5px;
    width: 60px;
    height: 60px;
  }
}
.top-myself {
  float: right;
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .el-menu {
    background-color: transparent;
  }
}
.el-menu--popup {
  min-width: 116px !important;
}
.el-menu--horizontal .el-menu .el-menu-item {
  text-align: center;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

</style>
