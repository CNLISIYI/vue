<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="mycertify" :asideIdx="['4']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card" :value="tabnum" @tab-click="handleClick">
						<!-- 公司实名认证 -->
						<el-tab-pane name="1">
							<!-- 标签标题 -->
							<span slot="label"> 公司实名认证 </span>
							<!-- 页面内容 -->
							<div class="tips">
								<p>
									公司实名信息认证必须确保信息准确无误，否则认证将会被驳回，请按照要求填写信息。
								</p>
							</div>
							<div v-if="companyForm.status">
								<p class="green" v-if="companyForm.status == 3">
									您的企业实名认证已经审核通过!
								</p>
								<p class="red" v-else-if="companyForm.status == 1">
									您的企业实名认证审核被驳回!
								</p>
								<p class="gray" v-else>您的企业实名认证正在审核中</p>
							</div>
							<el-form
								:model="companyForm"
								ref="form"
								label-width="130px"
								class="demo-ruleForm"
								v-loading="loading"
							>
								<el-form-item label="公司名称">
									<el-input
										v-model="companyForm.title"
										placeholder="请输入公司名称"
									></el-input>
								</el-form-item>
								<el-form-item label="企业类型">
									<el-radio-group v-model="companyForm.is_merchants">
										<el-radio label="1">个体工商</el-radio>
										<el-radio label="2">企业</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="统一社会信用代码">
									<el-input
										v-model="companyForm.unified_code"
										placeholder="请输入统一社会信用代码"
									></el-input>
								</el-form-item>
								<el-form-item label="营业执照">
									<Appheadupload
										@handlefile="handlelogo"
										ref="logoupload"
									></Appheadupload>
								</el-form-item>

								<div class="sub-btn">
									<el-button type="primary" @click="submitForm"
										>保存信息</el-button
									>
								</div>
							</el-form>
						</el-tab-pane>
						<!-- 个人实名认证 -->
						<el-tab-pane name="2">
							<!-- 标签标题 -->
							<span slot="label"> 个人实名认证 </span>
							<!-- 页面内容 -->
							<div class="tips">
								<p>
									个人实名认证信息必须保证准确无误，否则认证将会被驳回，请按照要求填写信息。
								</p>
							</div>
							<div v-if="companyForm.personal">
								<p class="green" v-if="companyForm.personal.status == 3">
									您的个人实名认证已经审核通过!
								</p>
								<p class="red" v-else-if="companyForm.personal.status == 1">
									您的个人实名认证审核被驳回!
								</p>
								<p class="gray" v-else>您的个人实名认证正在审核中</p>
							</div>
							<el-form
								:model="companyForm"
								ref="form"
								label-width="100px"
								class="demo-ruleForm"
								v-if="companyForm.personal"
								v-loading="loading"
							>
								<el-form-item label="真实姓名">
									<el-input
										v-model="companyForm.personal.title"
										placeholder="请输入您的真实姓名"
									></el-input>
								</el-form-item>
								<el-form-item label="身份证正面">
									<Appheadupload
										@handlefile="handlefront"
										ref="frontupload"
									></Appheadupload>
								</el-form-item>
								<el-form-item label="身份证反面">
									<Appheadupload
										@handlefile="handleback"
										ref="backupload"
									></Appheadupload>
								</el-form-item>
								<div class="sub-btn">
									<el-button
										type="primary"
										@click="submitForm"
										v-loading="uploading"
										element-loading-spinner="el-icon-loading"
										>保存信息</el-button
									>
								</div>
							</el-form>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetCertifyInfo, PostCertifyInfo } from "../../api/apis";
export default {
	name: "AppMyCertify",
	data() {
		return {
			loading: false, //页面loading
			tabnum: "1",
			companyForm: {},
			uploading: false, //提交loading
		};
	},
	created() {},
	computed: {},
	
	mounted() {
		this.getCertify();
	},
	

	methods: {
		// 获取信息
		getCertify() {
			this.loading = true;
			GetCertifyInfo()
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.companyForm = res.body;
						this.companyForm.is_merchants =
							this.companyForm.is_merchants.toString();
						this.$refs.logoupload.imgurl = this.companyForm.thumb;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		handleClick(tab) {
			this.tabnum = tab.name;
			if (tab.name == "2") {
				this.$refs.frontupload.imgurl = this.companyForm.personal.thumb;
				this.$refs.backupload.imgurl = this.companyForm.personal.thumb1;
			}
		},
		// 营业执照的url
		handlelogo(url) {
			this.companyForm.thumb = url;
		},
		// 身份证正面url
		handlefront(url) {
			this.companyForm.personal.thumb = url;
		},
		// 身份证背面url
		handleback(url) {
			this.companyForm.personal.thumb1 = url;
		},
		// 提交表单
		submitForm() {
			if (this.tabnum == "1") {
				if (this.companyForm.thumb == "") {
					this.$message.error("请上传营业执照");
				} else if (
					this.companyForm.unified_code == "" ||
					this.companyForm.title == ""
				) {
					this.$message.error("公司名称及信用代码必填");
				} else {
					this.postInfo('company');
				}
			}
			if (this.tabnum == "2") {
				if (
					this.companyForm.personal.thumb == "" ||
					this.companyForm.personal.thumb1 == ""
				) {
					this.$message.error("请上传身份证照片");
				} else if (this.companyForm.personal.title == "") {
					this.$message.error("请输入真实姓名");
				} else {
					this.postInfo('person');
				}
			}
		},
		postInfo(val) {
			PostCertifyInfo(this.companyForm,val)
				.then((res) => {
					if (res.code == 0) {
						this.$message.success("保存成功！");
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.green,
.red,
.gray {
	font-weight: 600;
	margin: 15px auto 25px;
	font-size: 16px;
	text-align: center;
}
/deep/ .el-input {
	width: 30%;
}
/deep/ .avatar-uploader {
	width: 180px;
}
/deep/ .avatar-uploader .el-upload{
	width: 100%;
}
/deep/ .avatar {
	width: 180px !important;
}
</style>
