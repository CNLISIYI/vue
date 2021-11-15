<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="newspost" :asideIdx="['3']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>内容管理</el-breadcrumb-item>
						<el-breadcrumb-item>发布内容</el-breadcrumb-item>
					</el-breadcrumb>
					<div>
						<el-form
							:model="ruleForm"
							ref="form"
							label-width="170px"
							class="demo-ruleForm"
							:v-loading="isedit ? editloading : ''"
						>
							<el-form-item label="标题" required>
								<el-input
									v-model="ruleForm.title"
									placeholder="请输入内容标题"
									maxlength="50"
									show-word-limit
								></el-input>
							</el-form-item>
							<el-form-item label="封面图片" required>
								<Appheadupload
									@handlefile="handleimg"
									ref="headupload"
								></Appheadupload>
								<p class="input-txt">
									注：图片大小不可超过2M，格式支持JPG、GIF、png格式；推荐位图片大小长宽为625*230
								</p>
							</el-form-item>
							<el-form-item label="内容摘要" required>
								<el-input
									type="textarea"
									placeholder="请输入内容摘要"
									rows="5"
									v-model="ruleForm.description"
									resize="none"
									maxlength="150"
									show-word-limit
								>
								</el-input>
							</el-form-item>
							<el-form-item label="内容作者" required>
								<el-radio-group v-model="quoteway">
									<el-radio label="1">本站编辑</el-radio>
									<el-radio label="2">其他来源</el-radio>
								</el-radio-group>
								<div>
									<el-input
										v-if="quoteway == '2'"
										v-model="ruleForm.author"
										type="number"
										placeholder="请输入来源地址"
									></el-input>
								</div>
							</el-form-item>
							<el-form-item label="所属类型" required>
								<el-select
									v-model="ruleForm.categoryId"
									placeholder="请选择所属类型"
								>
									<el-option
										v-for="(item, index) in $state.typeopt"
										:key="index"
										:label="item.name"
										:value="item.id"
									>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="是否显示在首页推荐位" required>
								<el-radio-group v-model="ruleForm.homeNews">
									<el-radio label="0">否</el-radio>
									<el-radio label="1">发布时推荐</el-radio>
									<el-radio label="2">编辑时推荐</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="内容正文" class="editor-box" required>
								<div id="pro-editor"></div>
							</el-form-item>
							<div class="submit-btn">
								<el-button
									type="primary"
									@click="submitForm"
									v-loading="postloading"
									element-loading-spinner="el-icon-loading"
									>保存信息</el-button
								>
							</div>
						</el-form>
					</div>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetArticleDetail, EditNewsData, PostNews } from "../../api/apis";
import E from "wangeditor";

export default {
	name: "AppNewsPost",
	inject: ["reload"],
	data() {
		return {
			editloading: false, //编辑loading
			isedit: false, //是否为编辑
			editor: "", //富文本
			quoteway: "1",
			ruleForm: {},
			postloading: false,
		};
	},

	created() {},
	computed: {},

	mounted() {
		this.creatEditor();
		if (this.$route.params.newsid) {
			this.getNewsDetail(this.$route.params.newsid);
			this.isedit = true;
		}
	},

	methods: {
		// 富文本
		creatEditor() {
			this.editor = new E(document.getElementById("pro-editor"));
			this.editor.config.height = 450;
			this.editor.config.excludeMenus = ["todo", "code"];
			this.editor.config.uploadImgShowBase64 = true;
			this.editor.create(); // 创建富文本实例
		},
		handleimg(url) {
			this.ruleForm.image = url;
		},
		// 获取产品详情
		getNewsDetail(id) {
			this.editloading = true;
			GetArticleDetail(id)
				.then((res) => {
					this.editloading = false;
					if (res.code == 0) {
						this.ruleForm = res.data;
						this.ruleForm.homeNews = res.data.homeNews.toString();
						// 富文本
						if (res.data.content) {
							this.editor.txt.html(res.data.content);
						}
						this.$refs.headupload.imgurl = res.data.image;
						this.quoteway = res.data.author.indexOf("本站编辑") < 0 ? "2" : "1";
					} else {
						this.$message.error(err);
					}
				})
				.catch((err) => {
					this.editloading = false;
					this.$message.error(err);
				});
		},
		// 提交表单
		submitForm() {
			this.ruleForm.author =
				this.quoteway == "1" ? "本站编辑" : this.ruleForm.author;
			let formCopy = JSON.parse(JSON.stringify(this.ruleForm));
			if (this.editor.txt.html() == "") {
				this.$message.error("请填写内容正文");
			} else if (!this.ruleForm.image) {
				this.$message.error("请上传封面图片");
			} else if (!formCopy.title || !formCopy.description) {
				this.$message.error("请填写标题和摘要");
			} else if (
				!formCopy.author ||
				!formCopy.categoryId ||
				!formCopy.homeNews
			) {
				this.$message.error("请完善作者、类型和推荐位相关信息");
			} else {
				formCopy.id = this.$route.params.newsid ? this.$route.params.newsid : 0;
				formCopy.content = this.editor.txt.html();
				if (this.isedit) {
					this.postloading = true;
					EditNewsData(formCopy)
						.then((res) => {
							if (res.code == 0) {
								this.postloading = false;
								this.$message.success("保存成功");
								this.$router.push({
									name: "managenews",
								});
							} else {
								this.postloading = false;
								this.$message.error(res.msg);
							}
						})
						.catch((err) => {
							this.postloading = false;
							this.$message.error(err);
						});
				} else {
					PostNews(formCopy)
						.then((res) => {
							this.postloading = false;
							if (res.code == 0) {
								this.$message.success("发布成功");
								this.reload();
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((err) => {
							this.postloading = false;
							this.$message.error(err);
						});
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.demo-ruleForm {
	margin-top: 40px;
}

/deep/ .el-input {
	max-width: 588px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.submit-btn {
	text-align: center;
}
.el-textarea {
	max-width: 588px;
}
/deep/ .el-textarea__inner {
	padding: 10px 15px;
}
.editor-box {
	position: relative;
	max-width: 95%;

	.el-button {
		position: absolute;
		right: 20px;
		top: 8px;
		z-index: 3;
		padding: 6px 15px;
	}
}

#pro-editor {
	height: 500px;
}

/deep/ .w-e-text-container {
	z-index: 1 !important;
}

/deep/ .w-e-toolbar {
	z-index: 2 !important;
}

/deep/ .avatar-uploader {
	width: 280px;
}
/deep/ .avatar-uploader .el-upload {
	width: 100%;
}
/deep/ .avatar {
	width: 280px !important;
}
</style>
