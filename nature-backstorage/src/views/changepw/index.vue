<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="changepw" :asideIdx="['5']"></Appaside>
			<el-container>
				<el-main>
					<div class="logbox forget-body">
						<h4>修改密码</h4>
						<el-form
							:model="setform"
							ref="form"
							label-width="80px"
							class="demo-ruleForm"
						>
							<el-form-item label="原密码">
								<el-input
									v-model="setform.oldpass"
									type="password"
									placeholder="请输入原密码"
								></el-input>
							</el-form-item>
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
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { setNewPassword } from "../../api/apis";
export default {
	name: "AppChangePw",
	data() {
		return {
			setform: {}, //设置密码
			loading: false,
		};
	},
	created() {},
	mounted() {},
	computed: {},
	destroyed() {},
	methods: {
		setNewPw() {
			if (this.setform.password != this.setform.password2) {
				this.$message.error("两次密码输入不一致");
			} else if (!this.setform.oldpass) {
				this.$message.error("请输入原密码");
			} else {
				setNewPassword(this.setform.oldpass, this.setform.password).then(
					(res) => {
						if (res.code == 0) {
							this.$message.success("修改成功");
							this.$router.push({
								name: "home",
							});
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
.logbox {
	width: 420px;
	background: #f7f7f7;
	border-radius: 16px;
	padding: 30px;
	margin: 100px auto;

	h4 {
		text-align: center;
		font-size: 24px;
		font-weight: bold;
		color: #333333;
		margin-bottom: 39px;
	}
}

.sub-btn {
	margin-top: 40px;

	.el-button {
		width: 100%;
	}
}
</style>
