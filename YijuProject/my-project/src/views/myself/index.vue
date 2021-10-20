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
      <Appminenav linkname="myself" :identity="userdata.identity" :uid="userdata.uid"></Appminenav>
      <div class="mine-container">
        <div class="content-title">
          <span>个人资料</span>
        </div>
        <div class="data-box">
          <ul>
            <li>
              <span>昵称：</span>
              <p>{{userdata.name}}</p>
            </li>
            <li>
              <span>账号：</span>
              <p>{{userdata.username}}</p>
            </li>
            <li>
              <span>密码：</span>
              <p>********</p>
            </li>
            <li>
              <span>性别：</span>
              <p>{{userdata.sex}}</p>
            </li>
            <li>
              <span>手机：</span>
              <p>{{userdata.tel}}</p>
            </li>
            <li>
              <span>邮箱：</span>
              <p v-if="userdata.email">{{userdata.email}}</p>
              <p v-else>暂无提供</p>
            </li>
          </ul>
          <div class="data-btn" @click="reviseshow = true">修改资料</div>
        </div>
      </div>
    </div>
    <div class="revise-box" v-if="reviseshow">
      <h2>修改资料</h2>
      <img src="@/assets/icon/close.svg" @click="reviseshow = false"></img>
      <el-form
      class="form-content"
      ref="form" 
      status-icon
      :model="form"
      :rules="rules">
        <el-form-item label="密码" prop="pass" class="halfinput mr20">
          <el-input type="password" v-model="form.pass" placeholder="请输入登陆密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass" class="halfinput">
          <el-input type="password" v-model="form.checkpass" placeholder="请再次输入登陆密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="uname" class="halfinput mr20">
            <el-input v-model="form.uname" placeholder="请输入您的昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" class="halfinput">
            <el-input v-model="form.mobile" maxlength="11" placeholder="请输入您的手机号"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" class="halfinput">
          <el-input v-model="form.email" placeholder="请输入您的邮箱（选填）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="revisedone">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mask" v-if="reviseshow"></div>
    <Appfooter></Appfooter>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AppMine",
  data() {
    // 自定义验证规则。输入密码和确认密码
    var validatePass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkpass !== "") {
          this.$refs.form.validateField("checkpass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      reviseshow: false,
      form: {
        // 注册表单数据对象
        pass: "",
        checkpass: "",
        mobile: "",
        email: "",
        uname: "",
        sex: ""
      },
      // 验证规则
      rules: {
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkpass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        uname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /\d{11}/,
            message: "请输入有效的手机号码",
            trigger: "blur"
          }
        ],
        email: [
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "请输入有效的邮箱",
            trigger: "blur"
          }
        ]
      },
      // 用户数据
      userdata: {},
    };
  },
  mounted() {
    let _this = this;
    _this.userdata = this.$route.query;
    _this.getUserDetail();
  },
  methods: {
    // 修改用户信息
    revisedone() {
      let _this = this;
      axios({
        method: "POST",
        url: `http://127.0.0.1:8080/setUserModifyInfo?uid=${_this.userdata.uid}&username=${_this.userdata.username}&password=${_this.form.pass}&identity=${_this.userdata.identity}&sex=${_this.form.sex}&name=${_this.form.uname}&email=${_this.form.email}&tel=${_this.form.mobile}`,
        headers: { "Content-Type": "application/json" },
      })
        .then(res => {
          console.log(res);
          _this.$message({
            message: "修改成功！",
            type: "success"
          });
          setTimeout(() => {
            window.location.reload();
          },1500);
        })
        .catch(e => {
          // _this.$message.error("修改失败！请重试");
        });
    },
    getUserDetail() {
      axios({
        method: "GET",
        url: `http://127.0.0.1:8080/getUserPersonalInfo?uid=${this.userdata.uid}`
      })
        .then(res => {
          // 获取用户资料
          this.userdata = res.data;
          // 把修改资料表单中的默认值，设置为当前资料的值
          this.form.pass = res.data.password;
          this.form.checkpass = res.data.password;
          this.form.mobile = res.data.tel;
          this.form.email = res.data.email;
          this.form.uname = res.data.name;
          this.form.sex = res.data.sex;
        })
        .catch(e => {
          this.$message.error("获取信息失败！");
        }); 
    }
  }
};
</script>

<style lang="scss">
@import "index.scss";
</style>
