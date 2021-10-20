<template>
  <div>
    <!-- 使用组件，传参 -->
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <Appnav linkname='apply' :identity="userdata.identity" :uid="userdata.uid" :username="userdata.username"></Appnav>
    <div class="apply-head">
        <div class="mask-box">
            <h3>百万用户资源在线选房</h3>
            <p>立即成为房东，享受快速租房！</p>
        </div>
    </div>
    <div class="apply-form">
        <h4>填写信息，立即申请</h4>
        <p>只需2步，立即成为房东！</p>
        <ul class="clearfix">
            <li class="formbox">
                <h4>填写表单</h4>
                <!-- element-ui的表单组件。
                ref=form：父属性
                status-icon：显示输入正确或错误的提示图标
                model=form：双向绑定的数据
                rules=rules：表单验证规则                
                -->
                <el-form
                ref="form" status-icon
                :model="form"
                :rules="rules">
                <!-- prop是必须且唯一的，子属性 -->
                    <el-form-item label="房东姓名" prop="uname">
                        <el-input v-model="form.uname" placeholder="请输入您的姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="mobile">
                        <el-input v-model="form.mobile" maxlength="11" placeholder="请输入您的手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <!-- loaging是提交后转圈的动效 
                      点击提交按钮后的方法是applyNow
                      -->
                        <el-button
                            type="primary"
                            @click="applyNow"
                            :loading="loginLoading">立即申请</el-button>
                    </el-form-item>
                </el-form>
            </li>
            <!-- 下面这些是静态样式 -->
            <p class="circle"><span></span><span></span><span></span></p>
            <li>
                <img src="https://static8.ziroom.com/yezhu/pc/2017/images/step1.jpg">
                <h4>提交申请信息</h4>
                <p>填写表单，提交基本信息，在线申请</p>
            </li>
            <p class="circle"><span></span><span></span><span></span></p>
            <li>
                <img src="https://static8.ziroom.com/yezhu/pc/2017/images/step4.jpg">
                <h4>等待客服审批</h4>
                <p>根据你的申请及用户资质进行审批，等待结果反馈</p>
            </li>
        </ul>
    </div>
    <Appfooter></Appfooter>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AppApply",
  data() {
    return {
      form: {
        // 登陆表单数据对象
        uname: "",
        mobile: ""
      },
      // 表单验证规则
      rules: {
        uname: [{ required: true, message: "请输入您的姓名", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /\d{11}/,
            message: "请输入有效的手机号码",
            trigger: "blur"
          }
        ]
      },
      loginLoading: false, // 登录中 loading
      // 用户数据
      userdata: {},
      username: '',
    };
  },
  mounted() {
    let _this = this;
    // 通过$route.query拿到上一个页面传过来的参数，存给userdata，也就是用户id、用户账号、身份表示
    _this.userdata = this.$route.query;
  },
  methods: {
    applyNow() {
      // 使用 form 组件的 validate 方法触发校验，获取校验的结果状态
      // $refs调用，和ref=form对应
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
          // 验证没通过，返回rules的错误提示
        }
        // 表单验证通过，调用提交请求方法
        this.submitApply();
      });
    },
    submitApply() {
      let _this = this;
      _this.loginLoading = true;
      // axios相当于原生中的ajax
      axios({
        method: "POST",
        // url接口地址，传参数用户id、用户账号、填写的申请表单的数据内容、当前日期。
        // 用es6新属性``来代替字符串拼接
        url: `http://127.0.0.1:8080/setUserApplyInfo?uid=${_this.userdata.uid}&username=${_this.userdata.username}&fdname=${_this.form.uname}&fdtel=${_this.form.mobile}&date=${new Date().toLocaleDateString()}`,
        // post方法，定义响应头。        
        headers: { "Content-Type": "application/json" },
      })
        .then(res => {
          console.log(res);
          // post成功，调用eleui组件的$message提示成功
          _this.$message({
            message: "提交成功！",
            type: "success"
          });
          _this.loginLoading = false;
          // 清空表单
          _this.form.uname = "";
          _this.form.mobile = "";
        })
        .catch(e => {
          // post失败
          _this.loginLoading = false;
          _this.$message.error("提交失败！请重试");
        });
    }
  }
};
</script>

<style lang="scss">
@import "index.scss";
</style>
