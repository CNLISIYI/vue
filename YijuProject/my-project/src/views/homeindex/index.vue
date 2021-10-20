<template>
  <div class="">
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <div class="home-container">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <router-link :to="{name:'home',query:{uid:houseData.uid,identity:userdata.identity,username:userdata.username}}" target="_blank">首页</router-link>
            <el-breadcrumb-item></el-breadcrumb-item>
            <el-breadcrumb-item>厦门整租</el-breadcrumb-item>
            <el-breadcrumb-item>思明租房</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="house-title">{{houseData.title}}</h3>
        <div class="title-basic-info clearfix">
            <span class="light info-tag"><em><b class="normal">{{houseData.fee}}</b></em>元/月</span>
            <span class="info-tag">
                <em><b class="normal">{{houseData.ssize}}</b></em>室<em><b
                        class="normal">{{houseData.tsize}}</b></em>厅
            </span>
            <span class="info-tag no-line"><em><b class="normal">{{houseData.homesize}}</b></em>平方米</span>
            <p class="bot-tag">
                <span v-for="(item,index) in labelData" :key="index" :class="`cls-${index+1}`">{{item}}</span>
            </p>
        </div>
        <div class="banner-outer">
            <div class="b-title"><img src="@/assets/icon/image.svg"><p>真实照片</p></div>
            <div class="homeimg">
                <el-carousel trigger="click" height="400px">
                    <el-carousel-item v-for="(item,index) in houseData.imgarr" :key="index">
                        <img :src="require('@/assets/homeindex/'+item)">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="fd-card">
                <div class="head-box"><img src="@/assets/icon/fd.svg"></div>
                <h4>房东卡片</h4>
                <p>姓名：<span>{{fddata.fdname}}</span></p>
                <p>电话：<span>{{fddata.fdtel}}</span></p>
            </div>
            <div class="like-box">
                <span>喜欢本房源？点击收藏</span>
                <div @click="likeHouseClick">
                    <img v-if="unlike" src="@/assets/icon/kxlike.svg" title="点击收藏">
                    <img v-else src="@/assets/icon/sxlike.svg" title="取消收藏">
                </div>
            </div>
        </div>
        
        <div class="home-intro">
            <div class="mod-title bottomed">
                <h3 id="houseInfo" class="title nav-scroll">房屋信息</h3>
                <div class="right-info">发布时间：<b class="normal">{{houseData.sendtime}}</b></div>
            </div>
            <ul class="house-info-zufang cf">
                <li class="full-line cf">
                    <span class="price"><em><b class="normal">{{houseData.fee}}</b></em>元/月</span>
                    <span class="type">{{houseData.fukuan}}</span>
                </li>
                <li class="house-info-item">
                    <span class="type">户型：</span>
                    <span class="info"><b class="normal">{{houseData.ssize}}</b>室<b class="normal">{{houseData.tsize}}</b>厅<b class="normal">{{houseData.wsize}}</b>卫</span>
                </li>
                <li class="house-info-item">
                    <span class="type">面积：</span>
                    <span class="info"><b class="normal">{{houseData.homesize}}平方米</b></span>
                </li>
                <li class="house-info-item" v-if="labelData[1]">
                    <span class="type">朝向：</span>
                    <span class="info">{{labelData[1]}}</span>
                </li>
                <li class="house-info-item">
                    <span class="type">楼层：</span>
                    <span class="info">{{houseData.step}}层</span>
                </li>
                <li class="house-info-item">
                    <span class="type">小区：</span>
                    <a href="javascript:;" class="link">{{houseData.apartment}}</a>
                    &nbsp;(<a href="javascript:;" class="link">{{houseData.area}}</a> <a href="javascript:;" class="link">{{houseData.street}}</a>)
                </li>
            </ul>
        </div>
        <div class="home-intro">
            <div class="mod-title bottomed">
                <h3 id="houseInfo" class="title nav-scroll">房屋设施</h3>
            </div>
            <ul class="house-info-peitao cf">
                <li class="peitao-item has" v-for="(item,index) in iconArr" :key="index" v-if="item.has">
                    <i class="iconfont">{{item.icon}}</i>
                    <div class="peitao-info">{{item.name}}</div>
                </li>
            </ul>
        </div>
        <div class="home-intro">
            <div class="mod-title bottomed">
                <h3 id="houseInfo" class="title nav-scroll">房屋简介</h3>
            </div>
            <div class="house-info-intro cf">
                <p>{{houseData.introduce}}</p>
            </div>
        </div>
    </div>
    <!-- 如果有历史记录的话，底部会有这一栏 -->
    <div class="history-box" v-if="historyAll">
        <div class="mod-title bottomed">
            <h3 id="houseInfo" class="title nav-scroll">历史浏览</h3>
        </div>
        <ul>
            <li class="rec_common_con" v-for="(item,index) in historyData" :key="index">
                <router-link :to="{name:'homeindex',query:{identity:userdata.identity,uid:userdata.uid,fid:item.fid}}" target="_blank">
                    <img class="rec_common_img" width="150" height="115" :src="require('@/assets/homeindex/'+item.banner)">
                    <a class="rec_common_title">{{item.title}}</a>
                    <p class="rec_common_price">{{item.fee}}<span>元/月</span></p>
                    <p class="rec_common_info">{{item.ssize}}室{{item.tsize}}厅，{{item.homesize}}平米</p>
                    <p class="rec_common_name">{{item.apartment}}</p>
                </router-link>
            </li>
        </ul>
    </div>
    <Appbacktop scrollhigh="300" :identity="userdata.identity" :uid="userdata.uid"></Appbacktop>
    <Appfooter></Appfooter>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AppHomeindex",
  data() {
    return {
      // 配套设施的图标数据
      iconArr: [
        { icon: "", name: "床", has: false },
        { icon: "", name: "洗衣机", has: false },
        { icon: "", name: "空调", has: false },
        { icon: "", name: "冰箱", has: false },
        { icon: "", name: "可做饭", has: false },
        { icon: "", name: "电视", has: false },
        { icon: "", name: "热水器", has: false },
        { icon: "", name: "衣柜", has: false },
        { icon: "", name: "宽带", has: false },
        { icon: "", name: "沙发", has: false }
      ],
      unlike: true,
      // 用户数据
      userdata: {},
      houseArr: [],
      houseData: {},
      labelData: {},
      fddata: {}, //房东信息
      historyAll: [], //历史记录
      historyData: [] //从历史记录得到的房源数据
    };
  },
  created() {},
  mounted() {
    this.userdata = this.$route.query;
    this.getAllHouse();
    // 历史纪录
    // 先获取历史记录
    let localArr = localStorage.getItem("historyAll");
    let new_localArr = [];
    // localStorage.clear(); //清除所有记录,需要清缓存记录的话把这句打开
    // 还得做一个判断，就是当历史纪录有了同样的纪录的情况，删掉同样的那条。
    if (localArr) {
      // 存在local里的数据是json格式，要解析
      this.historyAll = JSON.parse(localArr);
      this.historyAll.map((item, index) => {
        if (item == this.userdata.fid) {
          this.historyAll.splice(index, 1); //splice删除
        }
      });
      // 删掉相同的那条后，在新的数组开头插入这条。
      this.historyAll.unshift(this.userdata.fid);
      // 把新的历史记录数组存到本地
      localStorage.setItem("historyAll", JSON.stringify(this.historyAll));
    } else {
      //如果没有，push到数组里
      this.historyAll.push(this.userdata.fid);
      localStorage.setItem("historyAll", JSON.stringify(this.historyAll));
    }
    console.log("历史记录", this.historyAll);
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
          // 判断当前房源是不是已经在我的收藏中了，如果是的话，改变收藏按钮的颜色
          if (res.data.mylike.indexOf(this.houseData.fid) != -1) {
            this.unlike = false;
          } else {
            this.unlike = true;
          }
        })
        .catch(e => {});
    },
    getAllHouse() {
      let _this = this;
      axios({
        method: "GET",
        url: "http://127.0.0.1:8080/getAllHouseResourceInfo"
      })
        .then(res => {
          _this.houseArr = JSON.parse(res.data.data);
          _this.houseArr.map((item, index) => {
            if (item.fid == _this.userdata.fid) {
              _this.houseData = item;
              // 解析数据格式
              _this.labelData = item.label.split(",");
              _this.houseData.imgarr = item.imgarr.split(",");
              _this.houseData.haveall = item.haveall.split(",");
              _this.fddata = JSON.parse(item.fddata);
            }
            _this.historyAll.map(hitem => {
              if (item.fid == hitem) {
                _this.historyData.push(item);
              }
            });
          });
          // 历史记录超过4条的，截掉。这页最多显示4条历史记录。
          if (_this.historyData.length > 4) {
            _this.historyData.splice(4);
          }
          // 判断配套设施数据有无
          _this.iconArr.map((item, index) => {
            _this.houseData.haveall.map((hitem, hindex) => {
              if (item.name == hitem) {
                item.has = true;
              }
            });
          });
          console.log("房源详情", _this.houseData);
          _this.getUserDetail();
        })
        .catch(e => {});
    },
    // 点击收藏的方法
    likeHouseClick() {
      this.unlike = !this.unlike;
      if (this.unlike) {
        this.unlikePost();
      } else {
        this.likePost();
      }
    },
    // 收藏房源的接口
    likePost() {
      axios({
        method: "POST",
        // 传用户id和房源id
        url: `http://127.0.0.1:8080/setHouseCollectorInfo?uid=${
          this.userdata.uid
        }&fid=${this.houseData.fid}`,
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          console.log(res);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
        .catch(e => {});
    },
    // 取消收藏房源的接口
    unlikePost() {
      axios({
        method: "POST",
        url: `http://127.0.0.1:8080/delHouseCollectorInfo?uid=${
          this.userdata.uid
        }&fid=${this.houseData.fid}`,
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          console.log(res);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
        .catch(e => {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "index.scss";
// 配套设施的图标直接引用了安居客的图标库
@import url("https://pages.anjukestatic.com/frs/fangfe/anjuke-zufang-pc-site/1.0/zf-detail/index_v20200227163106.css");
</style>
