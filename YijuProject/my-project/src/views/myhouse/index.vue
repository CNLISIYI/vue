<template>
  <div class="home-page">
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <Appnav linkname='myhouse' :identity="userdata.identity" :uid="userdata.uid" :username="userdata.username"></Appnav>
    <div class="homelist">
      <!-- 房源列表 -->
      <ul class="homelist-box" v-if="mineData.length>0">
        <li v-for="(item,index) in mineData" :key="index">
            <router-link :to="{name:'homeindex',query:{identity:userdata.identity,uid:userdata.uid,fid:item.fid}}" target="_blank" class="zu-itemmod">
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
            <div @click="deleteClick(item.fid)" class="f-delete">下架房源</div>
        </li>
      </ul>
      <div v-else class="no-order">
        <img src="@/assets/noContent.png" alt="">
        <p>暂无房源</p>
      </div>
    </div>
    <Appbacktop scrollhigh="200" :identity="userdata.identity" :uid="userdata.uid"></Appbacktop>
    <Appfooter></Appfooter>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AppHouse",
  data() {
    return {
      isinputfocus: false,
      unlike: false,
      // 用户数据
      userdata: {},
      mineData: [],
      myfids: []
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
          // 获取我的详细资料，其中fids为我的房源列表。用#分割
          this.myfids = res.data.fids.split("#");
          this.getAllHouse();
        })
        .catch(e => {
          this.$message.error("获取信息失败！");
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
          _this.myfids.map((item, index) => {
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
          this.$message.error("获取信息失败！");
        }); // >= 400 的状态码都会进入这里
    },
    // 在我的房源中和所有房源中，删掉这个fid的房源
    deleteClick(fid) {
      this.$confirm("此房源将从您的发布列表中永久删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            method: "POST",
            url: `http://127.0.0.1:8080/delHouseInfo?fid=${fid}`,
            headers: { "Content-Type": "application/json" }
          })
            .then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功"
              });
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            })
            .catch(e => {});
        })
        .catch(() => {
          this.$message({
            message: "取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss">
@import "index.scss";
</style>
