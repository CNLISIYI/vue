<template>
  <div class="short-footer">
    <!-- 页面底部，没什么内容，一个静态页而已 -->
    <div class="footer-cont">
        <img class="logo" src="@/assets/logo.png">
        <img class="logo-img" src="@/assets/yj.png" alt="宜居">
        <ul>
            <li><a href="javascript:;" rel="nofollow" target="_blank">关于我们</a></li>
            <li><a href="javascript:;" rel="nofollow" target="_blank">联系方式</a></li>
            <li><a href="javascript:;" rel="nofollow" target="_blank">权利声明</a></li>
            <li><a href="javascript:;" rel="nofollow" target="_blank">法律声明</a></li>
            <li><a href="javascript:;" rel="nofollow" target="_blank">隐私条款</a></li>
        </ul>
        <div class="fcopyright"> 
            <a href="javascript:;" target="_blank" style="margin-right:20px;">客户服务中心</a>邮箱：<span class="pr5">service@yj.com</span>
            <br>Copyright © 2010 -2020 www.yiju.com All Rights Reserved
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: "Appfooter",
  data() {
    return {};
  },

  methods: {}
};
</script>

<style lang="scss">
.short-footer {
  width: 100%;
  background-color: #262626;
  padding: 60px 0px 40px;
  margin: 50px auto 0px auto;
}
.short-footer .footer-cont {
  width: 1220px;
  margin: 0 auto;
  text-align: center;
}
.short-footer .footer-cont img {
  display: inline-block;
  margin-bottom: 20px;
}
.short-footer .footer-cont .logo {
  width: 60px;
}
.short-footer .footer-cont .logo-img {
  height: 40px;
}
.short-footer .footer-cont ul {
  text-align: center;
  overflow: hidden;
  list-style: none;
}
.footer-cont li {
  display: inline-block;
  height: 14px;
  border-left: 1px solid #666;
  padding: 0 10px;
  line-height: 14px;
}
.footer-cont li:first-child {
  border-left: 0;
}
.footer-cont li a {
  font-size: 12px;
  color: #ffffff;
  line-height: 14px;
}
.footer-cont li a:hover {
  color: #1a8cff;
}
.footer-cont li a:focus {
  color: #666;
}
.fcopyright {
  margin: 15px auto 0 auto;
  font-size: 12px;
  color: #aaa;
  line-height: 24px;
  text-align: center;
}
.fcopyright .colora2 {
  color: #2a2a2a;
}
.pr5 {
  padding-right: 5px;
}
.font15 {
  font-size: 15px;
}
.short-footer a {
  color: #aaa;
}
</style>
