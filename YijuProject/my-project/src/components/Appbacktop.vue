<template>
  <div class="">
    <!-- router-link会被浏览器编译为a标签，to相当于href，带参数跳转新页面，参数放在query对象里 -->
    <router-link v-if="btnFlag" :to="{name:'mylike',query:{identity:identity,uid:uid}}" target="_blank" title="我的收藏" class="backtop-box" style="bottom:250px;">
        <div class="scroll-item"><img src="@/assets/icon/like.svg"></img></div>
    </router-link>
    <router-link v-if="btnFlag" :to="{name:'history',query:{identity:identity,uid:uid}}" target="_blank" title="我的足迹" class="backtop-box" style="bottom:200px;">
        <!-- @ 相当于很多个../，直到找到后面的路径 -->
        <div class="scroll-item"><img src="@/assets/icon/history.svg"></img></div>
    </router-link>
    <div v-if="btnFlag" class="backtop-box" title="返回顶部" @click="backTop">
        <div class="scroll-item"><img src="@/assets/icon/backtop.svg" style="width:40px;"></img></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Appbacktop",
  data() {
    return {
      btnFlag: false,
    };
  },
  // 通过props传参
  props: {
    // 设置滚动高度是多少的时候，显示组件
    scrollhigh: {
      type: String,
      value: '200'
    },
    // 传用户id和身份标示
    identity: {
      type: String,
      value: 0
    },
    uid: {
      type: String,
      value: ""
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    // 监听滚动高度的函数
    handleScroll() {
      let _this = this;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      _this.scrollTop = scrollTop;
      // 页面滚动到指定距离后，控制组件显隐
      if (_this.scrollTop > _this.scrollhigh) {
        _this.btnFlag = true;
      } else {
        _this.btnFlag = false;
      }
    },
    backTop() {
      let _this = this;
      // 用定时器来实现滚动过渡的效果
      let timer = setInterval(() => {
        let ispeed = Math.floor(-_this.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          _this.scrollTop + ispeed;
        if (_this.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 20);
    }
  }
};
</script>

<style lang="scss">
.scroll-item {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 40px;
  color: #62ab00;
}
.scroll-item img {
  display: block;
  margin: 7px auto;
  width: 26px;
}
.backtop-box {
  position: fixed;
  right: 40px;
  bottom: 150px;
  background-color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 20px;
  -webkit-box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 5;
}
</style>
