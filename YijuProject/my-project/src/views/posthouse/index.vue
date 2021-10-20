<template>
  <div>
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <Appnav linkname='posthouse' :identity="userdata.identity" :uid="userdata.uid" :username="userdata.username"></Appnav>
    <div class="post-head">
        <div class="mask-box">
            <h3>百万用户资源共享，平台免费托管</h3>
            <p>发布房源，快速出租</p>
            <div class="head-btn">填写表单，立即发布</div>
        </div>
    </div>
    <div class="post-form">
      <h4>填写信息，发布房源</h4>
      <div class="element-form clearfix">
        <el-form :model="ruleForm" :hide-required-asterisk="true" :rules="rules" ref="ruleForm">
          <el-form-item label="房源标题" prop="title" style="width:99%;">
            <el-input v-model="ruleForm.title" placeholder="请输入房源标题"></el-input>
          </el-form-item>
          <el-form-item label="房东姓名" prop="uname" class="halfinput">
            <el-input v-model="ruleForm.uname" placeholder="请输入您的姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="mobile" class="halfinput">
              <el-input v-model="ruleForm.mobile" maxlength="11" placeholder="请输入您的手机号"></el-input>
          </el-form-item>
          <el-form-item label="所在区域" prop="area" class="halfinput">
            <el-select v-model="ruleForm.area" placeholder="请选择房源所在区">
              <el-option label="思明" value="思明"></el-option>
              <el-option label="湖里" value="湖里"></el-option>
              <el-option label="集美" value="集美"></el-option>
              <el-option label="海沧" value="海沧"></el-option>
              <el-option label="同安" value="同安"></el-option>
              <el-option label="翔安" value="翔安"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在街道" prop="street" class="halfinput">
            <el-input v-model="ruleForm.street" placeholder="请输入房源所在街道"></el-input>
          </el-form-item>
          <el-form-item label="所在小区" prop="apartment" class="halfinput">
            <el-input v-model="ruleForm.apartment" placeholder="请输入房源所在小区"></el-input>
          </el-form-item>
          <el-form-item label="所在楼层" prop="step" class="halfinput">
            <el-input v-model="ruleForm.step" placeholder="请输入房源所在楼层"></el-input>
          </el-form-item>
          <el-form-item label="房源面积" prop="hsize" class="halfinput">
            <el-input v-model="ruleForm.hsize" placeholder="请输入房屋实际面积（平方米）"></el-input>
          </el-form-item>
          <el-form-item label="房源户型" prop="" class="halfinput">
            <el-form-item prop="hshi" class="smallinput">
              <el-select v-model="ruleForm.hshi">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
              </el-select>
            </el-form-item>室
            <el-form-item prop="hting" class="smallinput">
              <el-select v-model="ruleForm.hting">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
              </el-select>
            </el-form-item>厅
            <el-form-item prop="hwei" class="smallinput">
              <el-select v-model="ruleForm.hwei">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
              </el-select>
            </el-form-item>卫
          </el-form-item>
          <el-form-item label="出租价格" prop="fee" class="halfinput">
            <el-input v-model="ruleForm.fee" placeholder="请输入房屋价格（元/月）"></el-input>
          </el-form-item>
          <el-form-item label="付款方式" prop="feeway" class="halfinput">
            <el-select v-model="ruleForm.feeway" placeholder="请选择付款方式">
              <el-option label="押一付一" value="押一付一"></el-option>
              <el-option label="押一付三" value="押一付三"></el-option>
              <el-option label="半年付" value="半年付"></el-option>
              <el-option label="一年付" value="一年付"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出租方式" prop="way" class="halfinput">
            <el-radio-group v-model="ruleForm.way">
              <el-radio label="整组"></el-radio>
              <el-radio label="合租"></el-radio>
              <el-radio label="短租"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="房屋朝向" prop="chaoxiang" class="halfinput">
            <el-radio-group v-model="ruleForm.chaoxiang">
              <el-radio label="朝南"></el-radio>
              <el-radio label="南北"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="特色标签" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="一号线" name="ditie"></el-checkbox>
              <el-checkbox label="有电梯" name="dianti"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="配套设施" prop="furniture" class="err-position">
            <el-checkbox-group v-model="ruleForm.furniture">
              <el-checkbox label="床" name="bed"></el-checkbox>
              <el-checkbox label="洗衣机" name="xyj"></el-checkbox>
              <el-checkbox label="空调" name="kt"></el-checkbox>
              <el-checkbox label="冰箱" name="bx"></el-checkbox>
              <el-checkbox label="可做饭" name="cook"></el-checkbox>
              <el-checkbox label="电视" name="tv"></el-checkbox>
              <el-checkbox label="热水器" name="rsq"></el-checkbox>
              <el-checkbox label="衣柜" name="cloth"></el-checkbox>
              <el-checkbox label="宽带" name="wifi"></el-checkbox>
              <el-checkbox label="沙发" name="sofa"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="房屋简介" prop="desc" class="err-position">
            <el-input type="textarea" v-model="ruleForm.desc" placeholder="建议至少输入一百字的简介哦～"></el-input>
          </el-form-item>
          <!-- 上传图片功能有网络才能用 -->
          <!-- 把你发布房源时要上传的图片全都放在src/assets/homeindex目录下，否则会出错 -->
          <el-form-item label="上传照片" prop="" class="upload-photo">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :multiple="true"
              :limit="9"
              :on-exceed="overLength"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="getImageArr">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <p>（最多上传9张图片，请在图片上传成功后提交发布）</p>
          </el-form-item>
          <el-form-item class="form-btn">
            <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
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
      ruleForm: {
        title: "",
        uname: "",
        mobile: "",
        area: "思明",
        street: "",
        apartment: "",
        step: "",
        hsize: "",
        hshi: "1",
        hting: "1",
        hwei: "1",
        fee: "",
        feeway: "押一付一",
        way: "整组",
        chaoxiang: "朝南",
        type: [],
        furniture: [],
        desc: ""
      },
      imgArr: [],
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        title: [{ required: true, message: "请输入房源标题", trigger: "blur" }],
        uname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /\d{11}/,
            message: "请输入有效的手机号码",
            trigger: "blur"
          }
        ],
        area: [{ required: true, message: "请选择所在区", trigger: "change" }],
        street: [
          { required: true, message: "请输入所在街道", trigger: "blur" }
        ],
        apartment: [
          { required: true, message: "请输入所在小区", trigger: "blur" }
        ],
        step: [{ required: true, message: "请输入房屋楼层", trigger: "blur" }],
        hsize: [{ required: true, message: "请输入房屋面积", trigger: "blur" }],
        hshi: [
          { required: true, message: "请选择房源户型", trigger: "change" }
        ],
        hting: [
          { required: true, message: "请选择房源户型", trigger: "change" }
        ],
        hwei: [
          { required: true, message: "请选择房源户型", trigger: "change" }
        ],
        fee: [{ required: true, message: "请输入出租价格", trigger: "blur" }],
        feeway: [
          { required: true, message: "请选择付款方式", trigger: "change" }
        ],
        way: [{ required: true, message: "请选择出租方式", trigger: "change" }],
        chaoxiang: [
          { required: true, message: "请选择房屋朝向", trigger: "change" }
        ],
        furniture: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个配套设施",
            trigger: "change"
          }
        ],
        desc: [{ required: true, message: "请填写房源简介", trigger: "blur" }]
      },
      areaArr: [
        { name: "思明", ename: "siming" },
        { name: "湖里", ename: "huli" },
        { name: "集美", ename: "jimei" },
        { name: "同安", ename: "tongan" },
        { name: "海沧", ename: "haicang" },
        { name: "翔安", ename: "xiangan" }
      ],
      // 用户数据
      userdata: {}
    };
  },
  mounted() {
    let _this = this;
    _this.userdata = this.$route.query;
  },
  methods: {
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.loginLoading = true;
          // 表单验证通过，提交请求
          this.submitApply();
        } else {
          return false;
        }
      });
    },
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },
    // 选择超过9张照片
    overLength() {
      this.$message({
        type: "warning",
        message: "最多只能上传9张照片！"
      });
    },
    // 点击已上传图片右上角的叉号
    handleRemove(file, fileList) {
      this.imgArr.map((item, index) => {
        if (item == file.url) {
          this.imgArr.splice(index, 1);
        }
      });
    },
    // 获取上传的图片url
    getImageArr(response, file, fileList) {
      // this.imgArr.push(file.url);
      this.imgArr.push(file.name);
      console.log(file);
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 提交表单
    submitApply() {
      let _areaname = "siming";
      this.areaArr.map((item, index) => {
        if (this.ruleForm.area == item.name) {
          _areaname = item.ename;
        }
      });
      // 把朝向和租房方式都加到标签里，顺序为：整租/合租/短租、朝南/南北、其他标签
      let _labelArr = this.ruleForm.type;
      _labelArr.unshift(this.ruleForm.chaoxiang);
      _labelArr.unshift(this.ruleForm.way);
      if (this.imgArr[0]) {
        let _formdata = {
          uid: this.userdata.uid,
          banner: this.imgArr[0].toString() || "", //图片路径都转成字符串
          title: this.ruleForm.title,
          fee: this.ruleForm.fee,
          ssize: this.ruleForm.hshi,
          tsize: this.ruleForm.hting,
          wsize: this.ruleForm.hwei,
          homesize: this.ruleForm.hsize,
          area: this.ruleForm.area,
          areaname: _areaname,
          imgarr: this.imgArr.toString() || [""],
          fddata: JSON.stringify({
            fdname: this.ruleForm.uname,
            fdtel: this.ruleForm.mobile
          }),
          apartment: this.ruleForm.apartment,
          street: this.ruleForm.street,
          step: this.ruleForm.step,
          sendtime: new Date().toLocaleDateString(),
          haveall: this.ruleForm.furniture.toString(),
          fukuan: this.ruleForm.feeway,
          introduce: this.ruleForm.desc,
          label: this.ruleForm.type.toString()
        };
        axios({
          method: "POST",
          url: `http://127.0.0.1:8080/setHouserIssueInfo`,
          headers: { "Content-Type": "application/json" },
          // 整个对象数据格式转成json字符串
          data: JSON.stringify(_formdata)
        })
          .then(res => {
            this.$message({
              message: "发布成功！",
              type: "success"
            });
            // >=200 && < 400 的状态码会进入 then 成功
            console.log(res);
            this.imgArr = [];
            this.resetForm('ruleForm');
          })
          .catch(e => {
          }); 
      }
      else {
        this.$message.error("请至少上传一张照片");
      }
    }
  }
};
</script>

<style lang="scss">
@import "index.scss";
</style>
