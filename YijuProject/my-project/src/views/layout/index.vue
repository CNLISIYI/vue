<template>
  <div class="main-box">
    <h2>宜居，您在厦门的长短租选房助手</h2>
    <router-link :to="'login'" class="tologin">立即登陆</router-link>
    <router-link :to="'signup'" class="tosignup">立即注册</router-link>
  </div>
</template>

<script>
export default {
  name: 'AppBefore',
  data () {
    return {}
  }
}
</script>

<style lang="scss">
.main-box {
  background: #161614 url("https://s1.ljcdn.com/feroot/pc/asset/img/home/bannerV2.jpg") no-repeat;
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding-top: 200px;
  text-align: center;
  h2 {
    font-size: 36px;
    text-align: center;
    color: #ffffff;
  }
  a {
    display: inline-block;
    margin-top: 60px;
    width: 120px;
    height: 46px;
    border-radius: 8px;
    font-size: 16px;
    text-align: center;
    line-height: 46px;
    background-color: #62ab00;
    color: #ffffff;
  }
  .tosignup {
    margin-left: 20px;
  }
  a:hover {
    opacity: 0.8;
  }
}
</style>
