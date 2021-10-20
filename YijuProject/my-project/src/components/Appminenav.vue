<template>
      <ul class="mine-left-nav">
        <!-- 判断当前页面名为myself的话，就加acitve类名，否则类名为空。通过这句控制导航当前项的样式。 -->
        <li :class="linkname=='myself'?'active':''">
          <router-link :to="{name:linkname=='myself'?'':'myself',query:{identity:identity,uid:uid}}">
            <img src="@/assets/icon/navuser.svg">
            <span>个人资料</span>
          </router-link>
        </li>
        <li :class="linkname=='message'?'active':''">
          <router-link :to="{name:linkname=='message'?'':'message',query:{identity:identity,uid:uid}}">
            <img src="@/assets/icon/navmessage.svg">
            <span>系统消息</span>
          </router-link>
        </li>
        <li :class="linkname=='history'?'active':''">
          <router-link :to="{name:'history',query:{identity:identity,uid:uid}}" target="_blank">
            <img src="@/assets/icon/navhistory.svg">
            <span>我的足迹</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{name:'mylike',query:{identity:identity,uid:uid}}" target="_blank">
            <img src="@/assets/icon/navlike.svg">
            <span>我的收藏</span>
          </router-link>
        </li>
        <li v-if="identity==2">
          <router-link :to="{name:'notdone',query:{identity:identity,uid:uid}}" target="_blank">
            <img src="@/assets/icon/navmessage.svg">
            <span>审批申请</span>
          </router-link>
        </li>
        <li v-if="identity==2">
          <router-link :to="{name:'userlist',query:{identity:identity,uid:uid}}" target="_blank">
            <img src="@/assets/icon/navmessage.svg">
            <span>管理会员</span>
          </router-link>
        </li>
      </ul>
</template>

<script>
export default {
  name: "AppNav",
  data() {
    return {};
  },
  props: {
    // 当前页面名
    linkname: {
      type: String,
      value: 'home'
    },
    // 用户信息
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
.mine-left-nav {
  float: left;
  width: 200px;
  padding: 20px 0px;
  background-color: #ffffff;

  li {
    height: 56px;
    margin-top: 10px;
    padding-right: 10px;
    font-size: 0;
    text-align: center;
  }

  .active {
    span {
      color: #62ab00;
    }
  }

  img {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-bottom: 10px;
    margin-right: 6px;
  }

  span {
    font-size: 16px;
    line-height: 56px;
    font-weight: 600;
    color: #475669;
  }

  li:hover {
    span {
      color: #62ab00;
    }
  }
}
</style>
