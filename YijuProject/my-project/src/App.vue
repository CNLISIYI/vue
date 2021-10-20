<template>
  <div id="app">
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 这里写的是整个项目的公共样式 */ 
/* 清除样式的代码 */
#app {font-family: 'Avenir', Helvetica, Arial, sans-serif;}
body,ol,ul,h1,h2,h3,h4,h5,h6,p,th,td,dl,dd,form,fieldset,legend,input,textarea,select{margin:0;padding:0}
body{font:12px "宋体","Arial Narrow",HELVETICA;background:#f2f2f2;-webkit-text-size-adjust:100%}
input { padding-top:0; padding-bottom:0; font-family: "SimSun","宋体";}
input::-moz-focus-inner { border:none; padding:0; }
select, input { vertical-align:middle; }
select, input, textarea { font-size:12px; margin:0; }
input[type="text"], input[type="password"], textarea { outline-style:none; -webkit-appearance:none; }
textarea { resize:none; }
a{color:#172c45;text-decoration:none}
a:hover{color:#62ab00;text-decoration:none;}
em{font-style:normal}
li{list-style:none}
img{border:0;vertical-align:middle}
table{border-collapse:collapse;border-spacing:0}
p{word-wrap:break-word}
/* 清除浮动 */
.clearfix:after{content:'.';display:block;height:0;clear:both;visibility:hidden}
/* 公共类名样式 */
.normal{font-weight:normal}
.no-order {width: 100%;padding-bottom: 50px;margin: 0 auto;}
.no-order img {display: block;width: 300px;margin: 50px auto 0;}
.no-order p {text-align: center;font-size: 14px;color: #999;margin-top: 20px;}
.mask {position: fixed;top: 0;left: 0;width: 100%;height: 100vh;overflow: hidden;z-index: 100;background-color: rgba(0,0,0,0.3);}
</style>
