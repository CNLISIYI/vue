<template>
    <div class="top-nav">
      <ul>
        <!-- 控制当前项的样式 -->
          <li :class="linkname=='home'?'active':''">
            <!-- 当前页是home的时候，不能跳转，否则跳到新页面-->
              <router-link :to="{name:linkname=='home'?'':'home',query:{uid:uid,identity:identity,username:username}}" :target="linkname=='home'?'':'_blank'">首页</router-link>
          </li>
          <!-- 用户身份标识：0为普通用户，1为房东，2为管理员 -->
          <!-- 用户身份是普通用户时，会有申请房东 -->
          <li :class="linkname=='apply'?'active':''" v-if="identity==0">
              <router-link :to="{name:linkname=='apply'?'':'apply',query:{uid:uid,identity:identity,username:username}}" :target="linkname=='apply'?'':'_blank'">成为房东</router-link>
          </li>
          <!-- 用户身份是管理员或房东时，会有发布房源 -->
          <li :class="linkname=='posthouse'?'active':''" v-if="identity!=0">
              <router-link :to="{name:linkname=='posthouse'?'':'posthouse',query:{uid:uid,identity:identity,username:username}}" :target="linkname=='posthouse'?'':'_blank'">我要发布</router-link>
          </li>
          <!-- 用户身份是管理员或房东时，会有我的房源 -->
          <li :class="linkname=='myhouse'?'active':''" v-if="identity!=0">
              <router-link :to="{name:linkname=='myhouse'?'':'myhouse',query:{uid:uid,identity:identity,username:username}}" :target="linkname=='myhouse'?'':'_blank'">我的房源</router-link>
          </li>
          <!-- 用户身份是管理员时，会有待处理和管理会员 -->
          <li :class="['userlist',linkname=='userlist'?'active':'']" v-if="identity==2">
              <router-link :to="{name:linkname=='userlist'?'':'userlist',query:{uid:uid,identity:identity,username:username}}" :target="linkname=='userlist'?'':'_blank'">管理会员</router-link>
          </li>
          <li :class="['notpass',linkname=='notdone'?'active':'']" v-if="identity==2">
              <router-link :to="{name:linkname=='notdone'?'':'notdone',query:{uid:uid,identity:identity,username:username}}" :target="linkname=='notdone'?'':'_blank'">待处理</router-link>
          </li>
          <li :class="['mylike',linkname=='mylike'?'active':'']">
              <router-link :to="{name:linkname=='mylike'?'':'mylike',query:{uid:uid,identity:identity,username:username}}" :target="linkname=='mylike'?'':'_blank'">个人收藏</router-link>
          </li>
      </ul>
    </div>
</template>

<script>
export default {
  name: "AppNav",
  data() {
    return {};
  },
  props: {
    linkname: {
      type: String,
      value: "home"
    },
    // 用户身份标识
    identity: {
      type: String,
      value: 0
    },
    // 自动生成的用户uid
    uid: {
      type: String,
      value: ""
    },
    // 用户账号
    username: {
      type: String,
      value: ""
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.top-nav {
  width: calc(100vw - 300px);
  height: 56px;
  margin: 20px auto;
  border-bottom: 3px solid #62ab00;
  li {
    float: left;
    width: 180px;
    height: 56px;
    text-align: center;
    line-height: 56px;
    font-weight: 600;
    font-size: 18px;
    border-radius: 12px 12px 0px 0px;
    cursor: pointer;
    a {
      color: #475669;
      width: 100%;
      height: 100%;
      display: inline-block;
    }
  }
  .active {
    background-image: linear-gradient(#f2f2f2, #62ab00);
    line-height: 68px;
    a {
      color: #ffffff;
    }
  }
  .mylike {
    float: right;
  }
  .notpass {
    float: right;
  }
  .userlist {
  }
  li:hover {
    background-image: linear-gradient(#f2f2f2, #62ab00);
    line-height: 68px;
    transition: 300ms;
    a {
      color: #ffffff;
    }
  }
}
</style>
