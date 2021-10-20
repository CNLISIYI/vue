<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="bdminiapp" :asideIdx="['2']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 小程序信息 </span>
							<!-- 页面内容 -->
							<div class="tips">
								<p>
									百度小程序信息相关：此处的资料可以根据您的实际情况作出调整
								</p>
								<p>
									小程序头像：像素不得低于100px*100px；建议像素不大于256px*256px，大小不超过5MB，超过会自动压缩；四角留空
								</p>
							</div>
							<el-form
								:model="form"
								ref="form"
								label-width="100px"
								class="demo-ruleForm"
								v-loading="pageload"
							>
								<el-form-item label="小程序名称">
									<el-input
										v-model="form.app_name"
										placeholder="请输入小程序名称"
										@input="form.app_name = $tools.inputLimit(form.app_name)"
									></el-input>
								</el-form-item>
								<el-form-item label="小程序描述">
									<el-input
										v-model="form.app_desc"
										placeholder="请输入描述信息"
										maxlength="28"
									></el-input>
									<p class="input-txt">最多28个字符</p>
								</el-form-item>
								<el-form-item label="小程序图标">
									<Appheadupload
										@handlefile="handlefile"
										ref="headupload"
									></Appheadupload>
									<p class="input-txt">仅支持 jpg、png 格式</p>
								</el-form-item>

								<div class="sub-btn">
									<el-button
										type="primary"
										@click="submitForm"
										v-loading="loading"
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
import { PostMiniApp, GetMiniApp } from "../../api/apis";
export default {
	name: "AppBdMiniapp",
	data() {
		return {
			loading: false, //提交表单loading
			form: {},
			imgfile_url: "", //图片上传后url
			pageload: false, //页面加载loading
		};
	},
	created() {},
	computed: {},
	
	mounted() {
		this.getMiniInfo();
	},
	

	methods: {
		// 获取小程序信息
		getMiniInfo() {
			this.pageload = true;
			GetMiniApp()
				.then((res) => {
					this.pageload = false;
					if (res.code == 0) {
						if (res.body) {
							this.form = res.body;
							this.$refs.headupload.imgurl = JSON.parse(
								res.body.photo_addr
							)[0].cover;
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.pageload = false;
					this.$message.error(err);
				});
		},
		// 获取上传图片
		handlefile(url) {
			this.imgfile_url = url;
		},
		// 提交表单
		submitForm() {
			PostMiniApp(this.form.app_name, this.form.app_desc, this.imgfile_url)
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						if (res.body.errno == 0) {
							this.$message.success("保存成功！");
						} else {
							this.$message.error("无法修改，可联系客服咨询");
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.input-txt {
	display: inline-block;
	vertical-align: middle;
	margin-left: 5px;
	font-size: 14px;
	color: #909399;
	margin-right: 20px;

	a {
		color: #1a8cff;
	}
}
/deep/ .el-input {
	width: 30%;
}
</style>
