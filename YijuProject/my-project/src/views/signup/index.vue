<template>
  <div class="login-wrap">
    <!-- 注册 -->
    <div class="form-wrap form-signup">
      <div class="form-head">
        <img src="@/assets/logo.png" alt="宜居">
        <h2>宜居</h2>
      </div>
      <el-form
        class="form-content"
        ref="form" 
        status-icon
        :model="signform"
        :rules="rules">
        <el-form-item label="账号" prop="signacnumber">
          <el-input v-model="signform.signacnumber" placeholder="请输入登陆账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" class="halfinput">
          <el-input type="password" v-model="signform.pass" placeholder="请输入登陆密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass" class="halfinput">
          <el-input type="password" v-model="signform.checkpass" placeholder="请再次输入登陆密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="identify">
          <el-radio-group v-model="signform.identify">
            <el-radio label="普通会员"></el-radio>
            <el-radio label="房东"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="昵称" prop="uname" class="halfinput">
            <el-input v-model="signform.uname" placeholder="请输入您的昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" class="halfinput">
            <el-input v-model="signform.mobile" maxlength="11" placeholder="请输入您的手机号"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="signform.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="signform.email" placeholder="请输入您的邮箱（选填）"></el-input>
        </el-form-item>
        <el-form-item class="zhuce">
          <router-link :to="'login'">已有账号？返回登陆</router-link>
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn-login"
            type="primary"
            @click="handleSignup"
            :loading="loginLoading">注册</el-button>
        </el-form-item>
        <el-form-item prop="signagree" class="agree-box">
          <span class="agree-text">我已阅读并同意<a @click="lawsshow = true">用户协议</a>和<a @click="yinsishow = true">隐私条款</a></span>
        </el-form-item>
      </el-form>
    </div>
    <div class="lawsbox" v-if="lawsshow">
      <div class="content">
        <img src="@/assets/icon/close.svg" @click="lawsshow = false"></img>
        <h4>宜居用户协议</h4>
        <p>欢迎您使用宜居的服务！</p>
        <p>为使用宜居的服务，您应当阅读并遵守本《宜居用户服务协议》（以下简称“本协议”）。本协议是用户与宜居之间的法律协议，是用户注册宜居账号并使用宜居平台服务或非经注册程序直接使用宜居平台服务时的通用条款。请您务必审慎阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款。限制、免责条款可能以黑体加粗或加下划线的形式提示您重点注意。如果您不同意本协议的约定，您应立即停止注册程序或停止使用宜居平台服务；如您继续访问和使用宜居平台服务，即视为您已确知并完全同意本协议各项约定。</p>
        <p>一、定义</p>
        <p>1、用户，以下亦称为“您”，系指注册或登录宜居平台使用宜居产品或服务的具有完全民事权利能力和行为能力的企业法人、社会团体、自然人或其他社会组织等。按用户是否经过注册程序分为注册用户和非注册用户，注册用户是指通过宜居平台完成全部注册程序后，使用宜居平台服务或宜居网站资料的用户。非注册用户是指未进行注册、直接登录宜居平台或通过其他宜居平台允许的方式进入宜居平台直接或间接地使用宜居平台服务或宜居网站资料的用户。按用户使用宜居服务的方式分为开发商用户、经纪人用户以及其他普通消费者用户，其中开发商用户及经纪人用户可能会使用宜居另行提供的后台系统。</p>
        <p>2、协议方，本协议中协议双方合称“协议方”。宜居平台在协议中统称为"宜居"。</p>
        <p>二、协议的效力</p>
        <p>1、在您按照注册页面提示填写信息、阅读并同意本协议并完成全部注册程序后或以其他宜居允许的方式实际使用宜居平台服务时，您即受本协议的约束。</p>
        <p>2、宜居有权根据国家法律法规的更新、产品和服务规则的调整需要不时地制订、修改本协议及/或各类规则，并以网站公示的方式进行公示。如您继续使用宜居平台服务的，即表示您接受经修订的协议和规则。如发生有关争议时，以宜居最新的相关协议和规则为准。</p>
        <p>三、账号注册、使用及注销</p>
        <p>1、您确认，在您完成注册程序或以其他宜居允许的方式实际使用宜居平台服务时，您应当是具备相应民事行为能力的自然人、法人或其他组织。若您不具备前述主体资格，则您及您的家长或法定监护人（以下统称"监护人"）应承担因此而导致的一切后果，且宜居有权注销您的账户，并向您及您的监护人索偿。</p>
        <p>2、宜居非常重视对青少年个人信息搜集和使用的安全性的保护。宜居建议，任何未满18周岁的未成年人参加网上活动应事先取得其监护人可经查证的同意并遵守《青少年网络文明公约》。监护人应承担未成年人网络活动风险及保护未成年人相关网络隐私的首要责任。</p>
        <p>3、在您签署本协议，完成注册程序时，宜居会向您提供唯一编号的宜居账户。您应对您的用户账户、登录密码、支付密码（如有）、验证码的安全以及对通过您的账户实施的行为负责，因此所衍生的任何损失或损害，宜居无法也不承担任何责任。除非有法律规定或行政司法机关的指令，且征得宜居的同意，否则您的用户账户不得以任何方式转让、借用、赠与或继承（与账户相关的财产权益除外），您的登录密码、支付密码（如有）和验证码不得对任何第三方提供或泄露。否则，由此给您（或宜居、任何第三方）造成的一切损失，概由您自行承担（或者负责赔偿），宜居不承担任何责任。</p>
        <p>4、用户在注册时，应使用健康规范符合法律法规及网络文化的用户名，用户名中不得含有任何威胁、恐吓、谩骂、庸俗、亵渎、色情、淫秽、非法、前后矛盾、攻击性、伤害性、骚扰性、诽谤性、辱骂性的或侵害他人知识产权的文字。</p>
        <p>5、您在注册帐号或使用宜居平台服务的过程中，可能需要填写一些必要的信息。如您是经纪人用户，为保证您可以正常发布房源信息、使用隐私通话服务、参与担保房源推广以及宜居为经纪人用户提供的其他产品或服务的目的，您需提交您真是有效的个人身份信息（如身份证、手机号、名片、经纪人信息卡等）进行实名认证；如您是非经纪人用户的，如您参与宜居提供的看房团、动态订阅、金融贷款信息咨询、问答、点评等宜居为用户提供的其他产品或服务的，您需提交您的个人身份信息（如手机号）进行实名认证；其他个人身份信息包括但不限于您的真实姓名、工作单位、住址等具体以宜居平台页面公示要求为准，如您未能提供您的个人信息的，您将可能无法正常使用宜居的产品或服务或在使用过程中受到限制。</p>
        <p>6、您在注册帐号或使用宜居平台服务的过程中，应提供合法、真实、准确的个人资料，您的个人资料有变动的，应及时进行更新并向宜居提供最新的身份资质证明资料供宜居审核。如果因您提供的个人资料不合法、不真实、不准确的，或故意以虚假无效资料逃避宜居平台的审核后又变更的，您需承担因此引起的相应责任及后果，并且宜居保留终止您使用宜居各项服务的权利。</p>
        <p>7、宜居承诺非经法定原因、本协议的约定或您的事先许可，宜居不会向任何第三方透露您的注册账号、姓名、身份证号、手机号码等非公开个人信息。如果发现任何人不当使用您的账户或有任何其他可能危及您的账户安全的情形时，您应当立即以有效方式通知宜居，要求宜居暂停相关服务。您理解宜居对您的请求采取行动需要合理时间，宜居对在采取行动前已经产生的后果（包括但不限于您的任何损失）不承担任何责任。</p>
        <p>8、您了解并同意，如您符合并且遵守本协议条款，在通过宜居平台完成注册程序之后，即可成为宜居平台用户。对于您主动提交的相关信息，您授权宜居及/或宜居网站运营者及关联服务提供方委托的第三方通过合法渠道（包括但不限于征信机构等）了解、咨询、审查您的个人市场交易风险的真实情况，并据此判断您的风险状况。</p>
        <p>四、宜居平台服务使用规范</p>
        <p>1、通过宜居平台，您可以按照宜居的规则发布各种生活信息。但所发布之信息不得含有如下内容：</p>
        <p>1)反对宪法所确定的基本原则，煽动抗拒、破坏宪法和法律、行政法规实施的；</p>
        <p>2)煽动危害国家安全、泄露国家秘密、颠覆国家政权，推翻社会主义制度的；</p>
        <p>3)煽动分裂国家、破坏国家统一、损害国家荣誉和民族利益的；</p>
        <p>4)煽动民族仇恨、民族歧视，破坏民族团结的；</p>
        <p>5)其他违反宪法和法律法规的；</p>
        <p>2、在接受宜居平台服务的过程中，您不得从事下列行为：</p>
        <p>1）发表、传送、传播、储存侵害他人知识产权（包括著作权、商标权、专利权等）、品牌形象、商业秘密权等合法权利的内容，包含病毒、木马、定时炸弹等可能对宜居系统造成伤害或影响其稳定性的内容制造虚假身份以误导、欺骗他人；</p>
        <p>2）传送或散布以其他方式实现传送的含有受到知识产权法律保护的图像、相片、软件或其他资料的文件，作为举例（但不限于此）：包括版权或商标法（或隐私权或公开权），除非用户拥有或控制着相应的权利或已得到所有必要的认可；</p>
        <p>3、您了解并同意，宜居有权应政府部门（包括司法及行政部门）的要求，向其提供您在宜居平台填写的注册信息和发布纪录等必要信息。</p>
        <p>4、在宜居平台上使用宜居平台服务过程中，您承诺遵守以下约定：</p>
        <p>1)在使用宜居平台服务过程中实施的所有行为均遵守国家法律、法规等规范文件及宜居平台各项规则的规定和要求，不违背社会公共利益或公共道德，不损害他人的合法权益，不违反本协议及相关规则。您如果违反前述承诺，产生任何法律后果的，您应以自己的名义独立承担所有的法律责任，并确保宜居免于因此产生任何损失或增加费用。</p>
        <p>2)不发布国家禁止发布的信息（除非取得合法且足够的许可），不发布涉嫌侵犯他人知识产权或其它合法权益的信息，不发布违背社会公共利益或公共道德、公序良俗的信息，不发布其它涉嫌违法或违反本协议及各类规则的信息。</p>
        <p>为维护网民和相关权利人利益，上海瑞家信息技术有限公司已经以公示的方式，为用户及相关权利人提供了丰富、便捷的线上线下投诉渠道。基于网络用户间的公平考量，同时也为了使网络用户的投诉能够及时得到处理，避免被当做垃圾邮件屏蔽，上海瑞家信息技术有限公司拒绝接收和处理所有以电子邮件形式发送给本公司员工个人的网络侵权通知，更不承诺对发送给本公司员工个人的电子邮件侵权通知进行优先处理，特此告知。</p>
      </div>
    </div>
    <div class="lawsbox" v-if="yinsishow">
      <div class="content">
        <img src="@/assets/icon/close.svg" @click="yinsishow = false"></img>
        <h4>宜居隐私权政策</h4>
        <p>欢迎您使用宜居的服务！</p>
        <p>向宜居网站提供您的个人隐私是基于对宜居网站的信任，宜居网站将忠于保护您的个人隐私！具体细节如下：</p>
        <p>隐私权政策的适用范围</p>
        <p>1. 包括宜居网站如何处理用户在登录其网站和服务器时留下的个人身份识别信息，例如姓名、 地址、邮件地址或者是电话号码等。</p>
        <p>2. 隐私权政策不适用于非宜居网站所属机构及非宜居网站雇员。</p>
        <p>亲自确认个人信息</p>
        <p>通常，您能在匿名的状态下访问宜居网站，并获取信息。但当您参加网站内的一些互动活动，例如查询数据、使用讨论室、下载或订阅电子报等，您需要提供准确的个人信息，经数据比对后才能参与这些动作， 否则宜居网站将无法向您提供有效的服务。</p>
        <p>除非根据法律或政府的强制性规定，在未得到您的许可之前，宜居网站不会把您的任何个人信息提供给无关的第三方（包括公司或个人）。宜居网站建议您不要对任何人泄漏您的密码，宜居网站也绝不会通过邮件方式询问您的密码。</p>
        <p>此外，宜居网站会自动接收并记录您的浏览器和服务器日志上的信息，其中包括您的IP地址，宜居网站 cookies 中的信息以及您需求的网页记录。</p>
        <p>宜居网站会在您的计算机上设定cookies。当您访问由cookies启动的网站时，cookies会被储存在您的浏览器中。Cookies可以跟踪并记录您在网站的活动，但不会跟踪个人信息。大部分浏览器的原始设置都是接受cookies的。如果您将您的浏览器设置成为拒绝cookies，那么您有可能无法正常浏览宜居网站。</p>
        <p>为了能更好的为您服务，希望您能够接受宜居的cookies 。</p>
        <p>法律的强制下实施信息公开</p>
        <p>或者因善意确信这样的作法对于下列各项有其必要性，宜居网站也许会因法律要求公开个人资料：</p>
        <p>1. 符合法律公告或遵守适用于宜居网站站点的合法程序；</p>
        <p>2. 保护宜居网站的用户之权利或财产；</p>
        <p>3. 在紧急的情况下，为了保护宜居网站及其用户之个人或公众安全。</p>
        <p>未成年人隐私权的保护</p>
        <p>如果您的年龄在 16 岁以下，请随同您的父母一起浏览宜居网站或者向网站提供您的个人信息。在没有经过父母的同意之前，请不要向网站传递任何个人信息！</p>
        <p>隐私权政策的修订</p>
        <p>宜居网站将保留在任何时间修改隐私权政策的权利。请您时常阅读这份关于个人隐私权政策的声明以确定您了解这些条款。</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AppSignup",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.signform.checkpass !== "") {
          this.$refs.form.validateField("checkpass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.signform.pass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      signform: {
        // 注册表单数据对象
        signacnumber: "",
        pass: "",
        checkpass: "",
        identify: "普通会员",
        mobile: "",
        email: "",
        uname: "",
        sex: "男"
      },
      rules: {
        signacnumber: [
          { required: true, message: "请输入您的账号", trigger: "blur" }
        ],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkpass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        uname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
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
            // 正则匹配邮箱
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "请输入有效的邮箱",
            trigger: "blur"
          }
        ]
      },
      loginLoading: false, // 登录中 loading
      codeLoading: false,
      lawsshow: false, //用户协议
      yinsishow: false //隐私政策
    };
  },

  methods: {
    handleSignup() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 表单验证通过，提交登录请求
        this.submitLogin();
      });
    },
    submitLogin() {
      this.loginLoading = true;
      let _identity = 1;
      if (this.signform.identify == "普通会员") {
        _identity = 0;
      } else {
        _identity = 1;
      }
      let _email = this.signform.email || "";
      axios({
        method: "POST",
        url: `http://127.0.0.1:8080/setUserRegisterInfo?username=${
          this.signform.signacnumber
        }&password=${this.signform.pass}&identity=${_identity}&sex=${
          this.signform.sex
        }&name=${this.signform.uname}&email=${_email}&tel=${
          this.signform.mobile
        }`
      })
        .then(res => {
          // >=200 && < 400 的状态码会进入 then 成功
          console.log(res);
          if (res.data==1) {
            this.$message({
              message: "注册成功，请返回登录",
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({
                name: "login",
                query: {
                  // 注册成功后，延迟2秒跳转回登陆页面，并传用户账号密码的参数
                  username: this.signform.signacnumber,
                  password: this.signform.pass
                }
              });
              this.loginLoading = false;
            }, 2000);
          }
        })
        .catch(e => {
          this.$message.error("注册失败，内部错误");
          this.loginLoading = false;
        }); // >= 400 的状态码都会进入这里
    }
  }
};
</script>

<style lang="scss">
@import "index.scss";
</style>
