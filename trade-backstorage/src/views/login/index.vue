<template>
	<div>
		<Appheader></Appheader>
		<div class="logbox clearfix" v-if="loginshow">
			<h4>用户登录</h4>
			<el-form
				:model="form"
				ref="form"
				label-width="60px"
				class="demo-ruleForm"
			>
				<el-form-item label="用户名">
					<el-input
						v-model="form.username"
						placeholder="请输入用户名"
					></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input
						v-model="form.password"
						type="password"
						placeholder="请输入密码"
					></el-input>
				</el-form-item>
				<el-form-item label="验证码" class="code-box">
					<el-input v-model="form.code" placeholder="请输入验证码"></el-input>
					<div class="img-box" @click="getimgcode">
						<img :src="codeimg" /><span>看不清？换一张</span>
					</div>
				</el-form-item>
				<div class="sub-btn">
					<el-button type="primary" @click="submitForm" v-loading="loading"
						>登录</el-button
					>
				</div>
			</el-form>
			<p
				class="forget-p"
				@click="
					loginshow = false;
					forgetshow = true;
				"
			>
				忘记密码？
			</p>
		</div>
		<div class="logbox forget-body" v-if="forgetshow">
			<h4>找回密码</h4>
			<el-form
				:model="forgetform"
				ref="form"
				label-width="60px"
				class="demo-ruleForm"
			>
				<el-form-item label="用户名">
					<el-input
						v-model="forgetform.username"
						placeholder="请输入用户名"
					></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input
						v-model="forgetform.mobile"
						maxlength="11"
						type="number"
						@input="forgetform.mobile = $tools.PhoneInput(forgetform.mobile)"
						placeholder="请输入手机号"
					></el-input>
				</el-form-item>
				<el-form-item label="验证码" class="code-box">
					<el-input
						v-model="forgetform.code"
						placeholder="请输入验证码"
					></el-input>
					<el-button
						class="send-box"
						@click="sendCode"
						:disabled="timer > 0 ? true : false"
					>
						{{ sendtxt }}
					</el-button>
				</el-form-item>
				<div class="sub-btn">
					<el-button type="primary" @click="setNext" v-loading="loading">下一步</el-button>
				</div>
			</el-form>
		</div>
		<div class="logbox forget-body" v-if="setshow">
			<h4>找回密码</h4>
			<el-form
				:model="setform"
				ref="form"
				label-width="80px"
				class="demo-ruleForm"
			>
				<el-form-item label="新密码">
					<el-input
						v-model="setform.password"
						type="password"
						placeholder="请输入新密码"
						maxlength="6"
					></el-input>
				</el-form-item>
				<el-form-item label="确认密码">
					<el-input
						v-model="setform.password2"
						type="password"
						placeholder="请再次输入密码"
						maxlength="6"
					></el-input>
				</el-form-item>
				<p class="input-txt">登录密码由6位数字或字母组成，不区分大小写</p>
				<div class="sub-btn">
					<el-button type="primary" @click="setNewPw">确定</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
import {
	GetImgcode,
	userLogin,
	setPasswordFirst,
	ResetPassword,
} from "../../api/apis";
export default {
	name: "AppLogin",
	inject: ["reload"],
	data() {
		return {
			form: {}, //登录
			forgetform: {}, //忘记密码
			setform: {}, //设置密码
			loading: false,
			loginshow: true, //登录
			forgetshow: false, //找回
			setshow: false, //重置
			sendtxt: "获取验证码",
			flag: "",
			timer: 0,
			codeimg: "",
			imgkey: "",
		};
	},
	created() {},
	mounted() {
		this.getimgcode();
	},
	computed: {},
	destroyed() {},
	methods: {
		getimgcode() {
			GetImgcode().then((res) => {
				if (res.code == 0) {
					this.codeimg = this.$tools.imageBase64ToBlob(
						"data:image/jpeg;base64," + res.data.img
					);
					this.imgkey = res.data.uuid;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		submitForm() {
			if (!this.form.username || !this.form.password || !this.form.code) {
				this.$message.error("请输入登录信息");
			} else {
				this.loading = true;
				userLogin(this.form, this.imgkey).then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.$cookies.set("authorization", `${res.data.access_token}`);
						this.$cookies.set("username", this.form.username);
						this.$router.push({
							name: "home",
						});
					} else {
						this.$message.error(res.msg);
					}
				});
			}
		},
		sendCode() {
			this.timer = 5;
			this.flag = setInterval(() => {
				if (this.timer < 2) {
					clearInterval(this.flag);
					this.timer = 0;
					this.sendtxt = "获取验证码";
				} else {
					this.sendtxt = `${--this.timer}s后重新获取`;
				}
			}, 1000);
		},
		setNext() {
			if (
				!this.forgetform.username ||
				!this.forgetform.mobile ||
				!this.forgetform.code
			) {
				this.$message.error("请输入相关信息");
			} else {
				this.loading = true;
				setPasswordFirst(
					this.forgetform.username,
					this.forgetform.mobile,
					"123456"
				).then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.$state.user_id = res.data.id;
						this.$state.userInfo = res.data;
						this.forgetshow = false;
						this.setshow = true;
					} else {
						this.$message.error(res.msg);
					}
				});
			}
		},
		setNewPw() {
			if (this.setform.password != this.setform.password2) {
				this.$message.error("两次密码输入不一致");
			} else {
				ResetPassword(this.$state.user_id, this.setform.password).then(
					(res) => {
						if (res.code == 0) {
							this.$message.success("修改成功！请重新登录");
							this.reload();
						} else {
							this.$message.error(res.msg);
						}
					}
				);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
