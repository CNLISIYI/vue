<template>
  <div>
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <div class="mine-head">
      <div class="head-box"><img src="@/assets/icon/fd.svg"></div>
      <h3>你好，<span>{{userdata.name}}</span></h3>
      <p>账户名：<span>{{userdata.username}}</span><i></i>
        <span v-if="userdata.identity==0">用户</span>
        <span v-else-if="userdata.identity==1">房东</span>
        <span v-else>管理员</span>
      </p>
    </div>
    <div class="mine-border">
      <Appminenav linkname="message" :identity="userdata.identity" :uid="userdata.uid"></Appminenav>
      <div class="mes-container">
        <div class="content-title">
          <span>系统消息</span>
        </div>
        <div class="mes-box">
          <div class="no-message" v-if="nomessage">
            <img src="@/assets/noContent.png">
            <p>您还没有消息哟～</p>
          </div>
          <ul v-else class="message-box">
            <li v-for="(item,index) in messageData" :key="index">
              <h4>系统通知</h4>
              <span class="mess-time">{{item.time}}</span>
              <!-- 处理消息的结果是拒绝 -->
              <p v-if="item.isagree==0" style="border-top:2px solid #ab1a00;">您“申请房东”的处理结果：拒绝此操作！该用户不符合成为房东身份的标准。您可以选择重新申请，或放弃申请。</p>
              <!-- 处理消息的结果是同意 -->             
              <p v-else style="border-top:2px solid #569603;">您“申请房东”的处理结果：已通过！根据您的申请条件，符合成为房东身份的标准。您现在就可以开始发布房源啦！</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Appfooter></Appfooter>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AppMessage",
  data() {
    return {
      nomessage: false,
      userdata: {},
      messageData: [],
    };
  },
  mounted() {
    let _this = this;
    _this.userdata = this.$route.query;
    _this.getUserDetail();
  },
  methods: {
    getUserDetail() {
      axios({
        method: "GET",
        url: `http://127.0.0.1:8080/getUserPersonalInfo?uid=${this.userdata.uid}`
      })
        .then(res => {
          this.userdata = res.data;
          this.getMessage();
        })
        .catch(e => {
          this.$message.error("获取信息失败！");
        }); 
    },
    getMessage() {
      axios({
        method: "GET",
        url: `http://127.0.0.1:8080/getAllApprovalInfo?uid=${this.userdata.uid}`
      })
        .then(res => {
          // 在所有消息处理的数据里，匹配当前用户uid的消息，存新数组
          res.data.map(item => {
            if(item.uid == this.userdata.uid) {
              this.messageData.unshift(item);
            } 
          })
          console.log(this.messageData);
        })
        .catch(e => {
          this.$message.error("获取信息失败！");
        }); 
    },
  }
};
</script>

<style lang="scss">
@import "index.scss";
</style>
