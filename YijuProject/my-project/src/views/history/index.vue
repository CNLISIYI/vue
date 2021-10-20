<template>
  <div>
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <div class="mine-head">
      <div class="head-box"><img src="@/assets/icon/fd.svg"></div>
      <h3>你好，<span>{{userdata.name}}</span></h3>
      <p>账户名：<span>{{userdata.username}}</span><i></i>
      <!-- 根据不同身份，展示不同的span -->
        <span v-if="userdata.identity==0">用户</span>
        <span v-else-if="userdata.identity==1">房东</span>
        <span v-else>管理员</span>
      </p>
    </div>
    <div class="mine-border">
      <Appminenav linkname="history" :identity="userdata.identity" :uid="userdata.uid"></Appminenav>
      <div class="his-container">
        <!-- 房源列表 -->
        <div class="homelist-box" v-if="historyArr.length>0">
            <!-- 用v-for循环数据列表 -->
            <router-link v-for="(item,index) in historyArr" :key="index" :to="{name:'homeindex',query:{identity:userdata.identity,uid:userdata.uid,fid:item.fid}}" target="_blank" class="zu-itemmod">
                <a class="img" hidefocus="true">
                    <!-- 图片路径 动态引入的话，需要用require方法 -->
                    <img class="thumbnail" width="180" height="135" :src="require('@/assets/homeindex/'+item.banner)">
                </a>
                <div class="zu-info">
                    <h3>
                        <a>{{item.title}}</a>
                    </h3>
                    <p class="details-item tag">
                        <!-- 房东信息fddata，拿到的是json格式的，所以要用parse解析 -->
                        <b class="normal">{{item.ssize}}</b>室<b class="normal">{{item.tsize}}</b>厅<span>|</span><b 
                            class="normal">{{item.homesize}}</b>平米<span>|</span>{{item.step}}层<img src="@/assets/icon/fd.svg">{{JSON.parse(item.fddata).fdname}}
                    </p>
                    <address class="details-item"><a>{{item.apartment}}</a>{{item.area}}-{{item.street}}</address>
                    <p class="details-item bot-tag">
                        <span v-for="(litem,lindex) in labelArr[index]" :key="lindex" :class="`cls-${lindex+1}`">{{litem}}</span>
                    </p>
                </div>
                <div class="zu-side">
                    <p><strong><b>{{item.fee}}</b></strong> 元/月</p>
                </div>
            </router-link>
        </div>
        <div v-else class="no-order">
            <img src="@/assets/noContent.png" alt="">
            <p>暂无信息</p>
        </div>
      </div>
    </div>
    <!-- 在下面放一个空标签，用来清除浮动 -->
    <div class="clearfix"></div>
    <Appbacktop scrollhigh="200" :identity="userdata.identity" :uid="userdata.uid"></Appbacktop>
    <Appfooter></Appfooter>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AppHistory",
  data() {
    return {
      userdata: {},
      historyArr: [],
      historyData: [],
      labelArr: []
    };
  },
  created() {},
  mounted() {
    // 拿路由参数
    this.userdata = this.$route.query;
    // 获取用户信息
    this.getUserDetail();
    // 获取本地存储的浏览记录，用parse解析
    this.historyData = JSON.parse(localStorage.getItem("historyAll")) || "";
    // 获取房源信息
    this.getHistoryArr();
  },
  methods: {
    getUserDetail() {
      axios({
        method: "GET",
        url: `http://127.0.0.1:8080/getUserPersonalInfo?uid=${
          this.userdata.uid
        }`
      })
        .then(res => {
          this.userdata = res.data;
        })
        .catch(e => {});
    },
    getHistoryArr() {
      console.log("历史记录", this.historyData);
      if (this.historyData) {
        axios({
          method: "GET",
          url: "http://127.0.0.1:8080/getAllHouseResourceInfo"
        })
          .then(res => {
            let houseArr = JSON.parse(res.data.data);
            // map方法循环get接口得到的全部房源信息
            houseArr.map((item, index) => {
              // 再循环本地存储的信息数组
              this.historyData.map(hitem => {
                // fid即房源id相同的，把这条存到新的数组里，给页面遍历展示用
                if (item.fid == hitem) {
                  this.historyArr.push(item);
                  this.labelArr.push(item.label.split(","));
                }
              });
            });
          })
          .catch(e => {});
      }
    }
  }
};
</script>

<style lang="scss">
@import "index.scss";
</style>
