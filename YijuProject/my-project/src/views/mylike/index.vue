<template>
  <div class="home-page">
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <Appnav linkname='mylike' :identity="userdata.identity" :uid="userdata.uid" :username="userdata.username"></Appnav>
    <div class="homelist">
      <!-- 房源列表 -->
      <ul class="homelist-box" v-if="mineData.length>0">
        <li v-for="(item,index) in mineData" :key="index">
            <router-link :to="{name:'homeindex',query:{identity:userdata.identity,uid:userdata.uid}}" target="_blank" class="zu-itemmod">
                <a class="img" hidefocus="true">
                    <img class="thumbnail" width="180" height="135" :src="require('@/assets/homeindex/'+item.banner)">
                </a>
                <div class="zu-info">
                    <h3>
                        <a>{{item.title}}</a>
                    </h3>
                    <p class="details-item tag">
                        <b class="normal">{{item.ssize}}</b>室<b class="normal">{{item.tsize}}</b>厅<span>|</span><b 
                            class="normal">{{item.homesize}}</b>平米<span>|</span>{{item.step}}层<img src="@/assets/icon/fd.svg">{{JSON.parse(item.fddata).fdname}}
                    </p>
                    <address class="details-item"><a>{{item.apartment}}</a>{{item.area}}-{{item.street}}</address>
                    <p class="details-item bot-tag">
                        <span v-for="(litem,lindex) in item.label" :key="lindex" :class="`cls-${lindex+1}`">{{litem}}</span>
                    </p>
                </div>
                <div class="zu-side">
                    <p><strong><b>{{item.fee}}</b></strong> 元/月</p>
                </div>
            </router-link>
            <div @click="unLikeClick(item.fid)" class="like-box">
                <img src="@/assets/icon/sxlike.svg" title="点击收藏">
            </div>
        </li>
      </ul>
      <div v-else class="no-order">
        <img src="@/assets/noContent.png" alt="">
        <p>暂无收藏</p>
      </div>
    </div>
    <Appbacktop scrollhigh="200" :identity="userdata.identity" :uid="userdata.uid"></Appbacktop>
    <Appfooter></Appfooter>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AppLike",
  data() {
    return {
      isinputfocus: false,
      unlike: false,
      // 用户数据
      userdata: {},
      mineData: [],
      mylikes: []
    };
  },
  mounted() {
    let _this = this;
    _this.userdata = this.$route.query;
    _this.getMyhouses();
  },

  methods: {
    getMyhouses() {
      axios({
        method: "GET",
        url: `http://127.0.0.1:8080/getUserPersonalInfo?uid=${
          this.userdata.uid
        }`
      })
        .then(res => {
          // 和我的房源逻辑相同
          this.mylikes = res.data.mylike.split("#");
          this.getAllHouse();
        })
        .catch(e => {
        });
    },
    getAllHouse() {
      let _this = this;
      axios({
        method: "GET",
        url: "http://127.0.0.1:8080/getAllHouseResourceInfo"
      })
        .then(res => {
          // >=200 && < 400 的状态码会进入 then 成功
          _this.mylikes.map((item, index) => {
            JSON.parse(res.data.data).map((ritem, rindex) => {
              if (item == ritem.fid) {
                _this.mineData.push(ritem);
              }
            });
          });
          _this.mineData.map(item => {
            item.label = item.label.split(",");
          });
          console.log("我的房源信息", _this.mineData);
        })
        .catch(e => {
        }); // >= 400 的状态码都会进入这里
    },
    // 取消收藏
    unLikeClick(fid) {
      this.$confirm("此房源将从收藏列表中删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            method: "POST",
            url: `http://127.0.0.1:8080/delHouseCollectorInfo?uid=${this.userdata.uid}&fid=${fid}`,
            headers: { "Content-Type": "application/json" }
          })
            .then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: "已取消收藏!"
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            })
            .catch(e => {});
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
@import "index.scss";
</style>
