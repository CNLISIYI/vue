<template>
  <div class="home-page">
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <Appnav linkname='home' :identity="userdata.identity" :uid="userdata.uid" :username="userdata.username"></Appnav>
       <!-- 这里写了个banner，没有banner的结果页面。为了好看。 -->
    <div class="banner">
      <el-carousel :interval="4000" type="card" height="360px">
        <el-carousel-item v-for="(item,index) in bannerArr" :key="index">
          <img :src="require('@/assets/home/'+item.src)">
          <p>{{item.txt1}}<span>{{item.txt2}}</span></p>
        </el-carousel-item>
      </el-carousel>
    </div>
    <h4 class="home-title">你想住哪里？</h4>
    <p class="list-title">厦门 · 热门房源</p>
    <div class="div-border items-list">
        <!-- 区域 begin-->
        <div class="items">
            <span class="item-title">位置：</span>
            <span class="elems-l">
              <!-- 筛选部分每一栏的数据都从数组里data定义的数组里循环 -->
              <!-- 定一一个单独的序号标识idx，当点击的idx等于这一个index的时候，加选中的类名，否则为空。 -->
              <!-- 点击事件里面传入index参数。以下租金、房型、租房方式都是相同的模式 -->
                <a v-for="(item,index) in areaArr" :key="index" href="javascript:;" :title="item+'租房'" :class="areaidx==index?'selected-item':''" @click="chooseArea(index)">{{item}}</a>
            </span>
        </div>
        <!-- 区域 end-->
        <!-- 租金 begin-->
        <div class="items ">
            <span class="item-title">租金：</span>
            <span class="elems-l">
                <a v-for="(item,index) in feeArr" :key="index" href="javascript:;" :class="feeidx==index?'selected-item':''" @click="chooseFee(index)">{{item}}</a>
                <!-- 手动输入租金区间 -->
                <div class="pricecond">
                    <form id="price_range_form">
                        <input class="from-price yell" type="text" maxlength="5"
                            v-model="minfeeinput" style="width:32px;" autocomplete="off"> -
                        <input class="to-price yell" type="text" maxlength="5"
                            v-model="maxfeeinput" style="width:32px;" autocomplete="off">&nbsp;<span>元</span>
                        <input class="smit" type="button" value="确定" @click="inputDone">
                    </form>
                </div>
            </span>
        </div>
        <!--  房型 begin-->
        <div class="items">
            <span class="item-title">房型：</span>
            <span class="elems-l">
                <a v-for="(item,index) in typeArr" :key="index" href="javascript:;" :class="typeidx==index?'selected-item':''" @click="chooseType(index)">{{item}}</a>
            </span>
        </div>

        <div class="items">
            <span class="item-title">类型：</span>
            <span class="elems-l">
                <a v-for="(item,index) in wayArr" :key="index" href="javascript:;" :class="wayidx==index?'selected-item':''" @click="chooseWay(index)">{{item}}</a>
            </span>
        </div>

        <div class="items">
            <span class="item-title">排序：</span>
            <span class="elems-l">
                <a href="javascript:;" :class="sortidx==0?'selected-item':''" @click="chooseSort(0)">默认</a>
                <a href="javascript:;" :class="sortidx==1?'selected-item':''" @click="chooseSort(1)">租金<img src="@/assets/icon/bd_up.svg"></a>
                <a href="javascript:;" :class="sortidx==2?'selected-item':''" @click="chooseSort(2)">租金<img src="@/assets/icon/bd_down.svg"></a>
            </span>
        </div>  
    </div>
    <div class="homelist">
      <!-- 房源列表 -->
      <!-- 如果接口获取的有数据，显示列表 -->
      <div class="homelist-box" v-if="houseArr.length>0">
        <p class="homelist-title">为您找到<span>全部</span>房源</p>
        <router-link v-for="(item,index) in houseArr" :key="index" :to="{name:'homeindex',query:{identity:userdata.identity,uid:userdata.uid,fid:item.fid}}" target="_blank" class="zu-itemmod">
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
                  <span v-for="(litem,lindex) in labelArr[index]" :key="lindex" :class="`cls-${lindex+1}`">{{litem}}</span>
              </p>
          </div>
          <div class="zu-side">
              <p><strong><b>{{item.fee}}</b></strong> 元/月</p>
          </div>
        </router-link>
      </div>
      <!-- 如果接口获取的没有数据，显示没找到 -->
      <div class="nolist" v-else>
        <p class="homelist-title">为您找到<span>全部</span>房源</p>
        <img src="@/assets/noContent.png" alt="">
        <p>没有找到您想要的房源～</p>
      </div>
      <!-- 广告，没用，为了好看 -->
      <div class="adver-content">
        <div class="advBox">
            <div class="adv-outer">
                <a target="_blank" href="https://ifx.anjuke.com/cr?c=606&u=http%3A%2F%2Fshanghai.anjuke.com%2Fask%2F%3Ffrom%3Dnavigation&p=950&as=1131061366">
                  <img src="https://pic6.ajkimg.com/mat/f1e81f2a177ffbfd3fd2cb4c8f5bd58f?imageMogr2/format/jpg/thumbnail/200x200">
                </a>
                <span>广告</span>
            </div>
        </div>
      </div>
    </div>
    
    <Appbacktop scrollhigh="700" :identity="userdata.identity" :uid="userdata.uid"></Appbacktop>
    <Appfooter></Appfooter>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AppHome",
  data() {
    return {
      isinputfocus: false,
      bannerArr: [
        {
          src: "banner1.jpg",
          txt1: "马銮湾新房",
          txt2: "断供三百日，临湾一排有大动作"
        },
        {
          src: "banner2.jpg",
          txt1: "海投尚书房",
          txt2: "月租8000起入住马銮湾新城"
        },
        {
          src: "banner3.jpg",
          txt1: "泰禾院子",
          txt2: "新中式滨海生态大盘"
        },
        {
          src: "banner4.jpg",
          txt1: "融侨铂樾府",
          txt2: "鼓锣公园旁低密墅区"
        }
      ],
      // 筛选数据
      areaArr: ["全部", "思明", "湖里", "集美", "海沧", "同安", "翔安"],
      areaidx: 0, //序号标识
      areaitem: "all", //要传给接口的结果，all表示全选
      feeArr: [
        "全部",
        "1000元以下",
        "1000-3000元",
        "3000-5000元",
        "5000元以上"
      ],
      feeidx: 0,
      maxFee: -1, //传给接口的最大房价，-1表示无限
      minFee: -1, //传给接口的最小房价，-1表示无限
      minfeeinput: '', //输入框输入的最小房价
      maxfeeinput: '', //输入框输入的最大房价
      typeArr: ["全部", "一室", "二室", "三室", "四室"],
      typeidx: 0,
      typeitem: -1, //传入的几室，-1表示全部，其余对应的为1、2、3、4，数字类型
      wayArr: ["全部", "整租", "合租", "短租"],
      wayidx: 0,
      wayitem: "all", //all表示全部
      sortidx: 0,
      sortitem: "all", //all表示默认排序，1为降序，0为升序
      // 用户数据
      userdata: {},
      houseArr: [],
      labelArr: []
    };
  },

  mounted() {
    let _this = this;
    _this.userdata = this.$route.query;
    _this.getAllHouse();
  },

  methods: {
    chooseArea(index) {
      // 给序号标识赋值为当前index
      this.areaidx = index;
      if (index == 0) {
        // index是0，就是全部
        this.areaitem = "all";
      } else {
        // 否则就是对应项
        this.areaitem = this.areaArr[index];
      }
      // 每次点击都重新调用一次接口，刷新列表
      this.getAllHouse();
    },
    chooseFee(index) {
      this.feeidx = index;
      this.minfeeinput = '';
      this.maxfeeinput = '';
      if (index == 0) {
        this.maxFee = -1;
        this.minFee = -1;
      } else if (index == 1) {
        this.maxFee = 1000;
        this.minFee = -1;
      } else if (index == 2) {
        this.maxFee = 3000;
        this.minFee = 1000;
      } else if (index == 3) {
        this.maxFee = 5000;
        this.minFee = 3000;
      } else {
        this.maxFee = -1;
        this.minFee = 5000;
      }
      this.getAllHouse();
    },
    chooseType(index) {
      this.typeidx = index;
      if (index == 0) {
        this.typeitem = -1;
      } else {
        this.typeitem = index;
      }
      this.getAllHouse();
    },
    chooseWay(index) {
      this.wayidx = index;
      if (index == 0) {
        this.wayitem = "all";
      } else {
        this.wayitem = this.wayArr[index];
      }
      this.getAllHouse();
    },
    chooseSort(index) {
      this.sortidx = index;
      if (index == 0) {
        this.sortitem = "all";
      } else if (index == 1) {
        this.sortitem = "0";
      } else {
        this.sortitem = "1";
      }
      this.getAllHouse();
    },
    inputDone() {
      // 手动输入最大最小值，点确定，赋值
      this.maxFee = this.maxfeeinput;
      this.minFee = this.minfeeinput;
      this.getAllHouse();
    },
    getAllHouse() {
      let _this = this;
      axios({
        // get接口调用房源列表，六个参数
        method: "GET",
        url: `http://127.0.0.1:8080/getAllHouseResourceInfoSort?area=${this.areaitem}&maxFee=${this.maxFee}&minFee=${this.minFee}&ftype=${this.typeitem}&way=${this.wayitem}&sort=${this.sortitem}`
      })
        .then(res => {
          // >=200 && < 400 的状态码会进入 then 成功
          _this.houseArr = JSON.parse(res.data.data);
          console.log(_this.houseArr);
          _this.houseArr.map((item, index) => {
            // label是json格式的字符串，用split在,的地方分割，得到数组
            _this.labelArr.push(item.label.split(","));
          });
        })
        .catch(e => {
          this.$message.error("获取信息失败！");
        }); // >= 400 的状态码都会进入这里
    }
  }
};
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
