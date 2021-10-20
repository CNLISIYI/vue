<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="manageshop" :asideIdx="['3']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<span slot="label"> 店铺设置 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>横幅图片显示方式为(1440*440)幻灯片，仅支持jpg/png格式图片</p>
							</div>
							<el-form
								:model="form"
								ref="form"
								label-width="100px"
								class="demo-ruleForm"
								v-loading="loading"
							>
								<el-form-item label="横幅图片">
									<Applistupload :max="6" ref="listupload"></Applistupload>
								</el-form-item>
								<el-form-item label="店铺模板">
									<div class="tpl-img" v-if="tplImg" @click="tplshow = true">
										<img :src="tplImg" />
									</div>
									<el-button type="primary" @click="tplshow = true" v-else
										>选择模板</el-button
									>
								</el-form-item>
								<el-form-item label="网站公告">
									<el-input
										type="textarea"
										:autosize="{ minRows: 4 }"
										placeholder="请输入内容"
										v-model="textarea"
										resize="none"
									>
									</el-input>
								</el-form-item>
							</el-form>
							<div class="submit-btn">
								<el-button
									type="primary"
									@click="submitForm"
									v-loading="subloading"
									element-loading-spinner="el-icon-loading"
									>保存信息</el-button
								>
							</div>
							<el-drawer
								title="选择店铺模板"
								:visible.sync="tplshow"
								size="80%"
							>
								<el-radio-group v-model="radiovalue">
									<el-radio
										:label="item.itemid"
										border
										v-for="(item, index) in tplData"
										:key="index"
									>
										<img :src="item.imgs" lazy />
									</el-radio>
								</el-radio-group>
								<div class="submit-btn">
									<el-button
										type="primary"
										@click="saveTpl"
										v-loading="saveloading"
										element-loading-spinner="el-icon-loading"
										>保存设置</el-button
									>
								</div>
							</el-drawer>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	GetTplList,
	GetSettingInfo,
	PostShopSetting,
	PostTplPic,
} from "../../api/apis";
export default {
	name: "AppManageShop",
	data() {
		return {
			form: {},
			loading: false, //loading
			subloading: false, //提交loading
			textarea: "", //公告
			radiovalue: "1", //选择的模板
			tplData: [], //店铺模板列表
			tplshow: false, //店铺模板pop
			saveloading: false, //保存模板loading
			tplImg: "", //选择的模板img
			banners: {}, //banner对象
		};
	},
	created() {},
	computed: {},
	destroyed() {},
	mounted() {
		this.getsetting();
	},

	methods: {
		// 获取设置
		getsetting() {
			this.loading = true;
			GetSettingInfo()
				.then((res) => {
					if (res.code == 0) {
						res.body.map((item) => {
							if (item.item_key == "banner") {
								this.banners[0] = item.item_value;
							}
							if (item.item_key == "banner1") {
								this.banners[1] = item.item_value;
							}
							if (item.item_key == "banner2") {
								this.banners[2] = item.item_value;
							}
							if (item.item_key == "banner3") {
								this.banners[3] = item.item_value;
							}
							if (item.item_key == "banner4") {
								this.banners[4] = item.item_value;
							}
							if (item.item_key == "banner5") {
								this.banners[5] = item.item_value;
							}
							if (item.item_key == "announce") {
								this.textarea = item.item_value;
							}
						});
						for (let key in this.banners) {
							if (this.banners[key]) {
								this.$refs.listupload.imgList.push(this.banners[key]);
							}
						}
						this.gettpllist();
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 获取模板列表
		gettpllist() {
			GetTplList()
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.tplData = res.body.list;
						res.body.list.map((item) => {
							if (item.template == res.body.use_tpl) {
								this.tplImg = item.imgs;
								this.radiovalue = item.itemid;
							}
						});
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 保存模板
		saveTpl() {
			this.$confirm("确定使用此模板吗？")
				.then(() => {
					this.saveloading = true;
					PostTplPic(this.radiovalue)
						.then((res) => {
							this.saveloading = false;
							if (res.code == 0) {
								this.tplData.map((item) => {
									if (item.itemid == this.radiovalue) {
										this.tplImg = item.imgs;
									}
								});
								this.$message.success("保存成功");
								this.tplshow = false;
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((err) => {
							this.saveloading = false;
							this.$message.error(err);
						});
				})
				.catch(() => {});
		},
		// 提交表单
		submitForm() {
			this.subloading = true;
			let _data = [];
			this.$refs.listupload.imgList.map((item, index) => {
				let _i = {};
				if (index == 0) {
					_i.banner = item;
				} else {
					_i[`banner${index}`] = item;
				}
				_data.push(_i);
			});
			_data.push({ announce: this.textarea });
			PostShopSetting(_data)
				.then((res) => {
					this.subloading = false;
					if (res.code == 0) {
						this.$message.success("保存成功！");
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.subloading = false;
					this.$message.error(err);
				});
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-form-item {
	.list-group-item {
		width: 140px !important;
	}
}
.submit-btn {
	text-align: center;
}
/deep/ .el-drawer__body {
	.submit-btn {
		position: fixed;
		bottom: 20px;
		width: 80%;
		right: 0;
		background: #fff;
		padding: 10px 0px;
	}
}
/deep/ .el-radio-group {
	height: calc(100vh - 156px);
	overflow-y: scroll;
	padding: 4px 0px 0px 4px;
	width: 100%;
}
/deep/ .el-radio {
	text-align: center;
	margin-bottom: 20px;
}
/deep/ .el-radio__input {
	display: none;
}

/deep/ .el-radio__label {
	display: block;
	width: 100%;
	height: 100%;
	padding-left: 0;
	img {
		width: 100%;
		height: 100%;
		border-radius: 4px;
	}
}
/deep/ .el-radio.is-bordered {
	padding: 0px;
	width: 304px;
	height: 424px;
}
/deep/ .el-radio.is-bordered.is-checked {
	border: none;
	box-shadow: 0px 0px 0px 2px #409eff;
}
/deep/ .el-radio.is-bordered + .el-radio.is-bordered {
	margin-left: 0px;
}
.tpl-img {
	width: 304px;
	height: 424px;
	cursor: pointer;
	border: 1px solid #dcdfe6;
	img {
		width: 100%;
		height: 100%;
	}
}
</style>
