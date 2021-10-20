<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="myability" :asideIdx="['4']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<!-- 我的资质 -->
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 我的资质 </span>
							<!-- 页面内容 -->
							<div class="table-operate">
								<el-button type="primary" @click="openAddPop"
									>添加资质</el-button
								>
							</div>
							<el-table
								:data="tableData"
								border
								style="width: 100%"
								v-loading="loading"
							>
								<el-table-column
									:resizable="false"
									fixed
									label="行业类型"
									align="center"
									width="120"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.industryName }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="行业资质证书"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.licenseName }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="行业资质证书号"
									align="center"
									width="150"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.liceSerialNum }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="商品名称"
									align="center"
									width="180"
								>
									<template slot-scope="scope">
										<span>{{
											scope.row.certiName ? scope.row.certiName : "-"
										}}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="资质状态"
									align="center"
									width="80"
								>
									<template slot-scope="scope">
										<span class="green" v-if="scope.row.status == 'approved'"
											>已批准</span
										>
										<span class="red" v-else-if="scope.row.status == 'rejected'"
											>拒绝</span
										>
										<span
											class="orange"
											v-else-if="scope.row.status == 'auditing'"
											>审核中</span
										>
										<span v-else-if="scope.row.status == 'expired'"
											>已过期</span
										>
										<span v-else>-</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="审核时间"
									align="center"
									width="160"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.auditTime }}</span>
									</template>
								</el-table-column>
								<el-table-column :resizable="false" label="不通过原因">
									<template slot-scope="scope">
										<span>{{
											scope.row.rejectReason ? scope.row.rejectReason : "-"
										}}</span>
									</template>
								</el-table-column>
							</el-table>
							<!-- 添加资质 -->
							<el-drawer title="添加资质" :visible.sync="addShow" size="70%">
								<el-form
									:model="ruleForm"
									ref="form"
									label-width="100px"
									class="demo-ruleForm"
								>
									<!-- 选择资质类型 -->
									<el-form-item label="选择资质类型">
										<el-radio-group
											v-model="ruleForm.industry_id"
											@change="changeIds"
										>
											<el-radio label="1">企业行业资质</el-radio>
											<el-radio label="2">商品行业资质</el-radio>
										</el-radio-group>
									</el-form-item>
									<!-- 选择资质 -->
									<el-form-item label="选择资质">
										<el-select
											v-model="ruleForm.license_id"
											placeholder="请选择资质"
											@focus="chooseOptions"
											:loading="getloading"
										>
											<el-option-group
												v-for="(group, index) in abilityOption"
												:key="index"
												:label="group.label"
											>
												<el-option
													v-for="item in group.options"
													:key="item.value"
													:label="item.label"
													:value="item.value"
												>
												</el-option>
											</el-option-group>
										</el-select>
									</el-form-item>
									<!-- 长期有效 -->
									<el-form-item label="长期有效">
										<el-switch v-model="valid"></el-switch>
									</el-form-item>
									<!-- 有效期 -->
									<el-form-item label="有效期" v-if="!valid">
										<el-date-picker
											v-model="choosedate"
											:picker-options="pickerOptions"
											type="date"
											placeholder="选择日期"
											:editable="false"
											:clearable="false"
											format="yyyy年MM月dd日"
											value-format="yyyy-MM-dd"
										>
										</el-date-picker>
									</el-form-item>
									<!-- 证书编号 -->
									<el-form-item label="证书编号">
										<el-input
											v-model="ruleForm.lice_serial_num"
											placeholder="请输入证书编号"
										></el-input>
									</el-form-item>
									<!-- 商品行业资质商品名称 -->
									<el-form-item label="行业资质名称">
										<el-input
											v-model="ruleForm.certi_name"
											placeholder="请输入商品行业资质商品名称"
										></el-input>
									</el-form-item>
									<!-- 资质图片 -->
									<el-form-item label="资质图片">
										<!-- <Applistupload :max="10" ref="listupload"></Applistupload> -->
										<div
											class="
												el-button el-button--primary
												_position
												el-button--medium
											"
										>
											<input
												type="file"
												class="file-input"
												id="upload"
												accept="image/*"
												ref="file"
												multiple
												@click="handleImage"
												@change="handlefile($event)"
											/>
											<span>点击上传</span>
										</div>
										<p class="input-txt">
											至少选择一张图片，最多选择十张图片。
										</p>
										<draggable
											v-if="fileData.length > 0"
											:list="fileData"
											:disabled="!enabled"
											class="list-group"
											ghost-class="ghost"
											:move="checkMove"
											@start="dragging = true"
											@end="dragging = false"
										>
											<div
												class="list-group-item"
												v-for="(item, index) in fileData"
												:key="index"
											>
												<img :src="item.url" />
												<i class="iconfont" @click="deleteImg(index)"
													>&#xe633;</i
												>
											</div>
											<p class="input-txt">（可拖拽图片进行排序）</p>
										</draggable>
									</el-form-item>
								</el-form>
								<div class="sub-btn">
									<el-button
										type="primary"
										@click="addSubmit"
										v-loading="uploading"
										element-loading-spinner="el-icon-loading"
										>上传资质</el-button
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
import { GetAbility, GetAbilityData, PostNewAbility } from "../../api/apis";
import { mapActions } from "vuex";
import draggable from "vuedraggable";
export default {
	name: "AppMyAbility",
	components: {
		draggable,
	},
	data() {
		return {
			loading: false, //loading
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now();
				},
			},
			fileData: [], //上传图片列表
			imgUrl: [], // 上传后图片列表
			tableData: [],
			uploading: false, //上传按钮loading
			getloading: false, //获取资质类型列表loading
			addShow: false, //添加资质
			enabled: true, //拖拽
			dragging: false,
			valid: false, //是否长期
			choosedate: "", //日期
			haschange: true, //是否切换资质类型
			ruleForm: { industry_id: "1" },
			abilityOption: [], //资质类型
		};
	},
	created() {},
	computed: {},

	mounted() {
		this.getAbilityList();
	},
	destroyed() {
		this.tableData = [];
		this.imgUrl = [];
		this.fileData = [];
		this.abilityOption = [];
	},

	methods: {
		...mapActions(["getUploadSts"]),
		// 提交表单
		addSubmit() {
			this.ruleForm.lice_expire_time = this.valid
				? "long_term"
				: this.choosedate;
			if (this.fileData.length == 0) {
				this.$message.error("至少上传一张资质图片");
			} else if (this.ruleForm.certi_name == "") {
				this.$message.error("请输入行业资质名称");
			} else if (this.ruleForm.lice_expire_time == "") {
				this.$message.error("请选择资质有效期");
			} else if (this.ruleForm.lice_serial_num == "") {
				this.$message.error("请输入证书编号");
			} else if (this.ruleForm.license_id == "") {
				this.$message.error("请选择资质类型");
			} else {
				this.$confirm("确定上传本条资质吗？")
					.then(() => {
						this.uploading = true;
						for (let i = 0; i < this.fileData.length; i++) {
							this.$tools
								.getClient(this.$state.uploadSts)
								.put(this.fileData[i].uploadPath, this.fileData[i].file)
								.then((res) => {
									if (res.url) {
										this.imgUrl.push(
											res.url.replace(
												/ctrlyuncaigou.oss-cn-beijing.aliyuncs.com/g,
												"image.yuncaigou.net"
											)
										);
										if (i == this.fileData.length - 1) {
											this.ruleForm.license_img = this.imgUrl[0];
											this.uploadAblity();
										}
									}
								});
						}
					})
					.catch(() => {});
			}
		},
		// 上传资质
		uploadAblity() {
			for (let i = 1; i < this.imgUrl.length; i++) {
				this.ruleForm.license_img += "," + this.imgUrl[i];
			}
			PostNewAbility(this.ruleForm)
				.then((res) => {
					if (res.code == 0) {
						this.$message.success("上传成功");
						this.ruleForm = {};
						this.fileData = [];
						this.addShow = false;
						this.getAbilityList();
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
		// 获取资质列表
		getAbilityList() {
			this.loading = true;
			GetAbility()
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.tableData = res.body;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 获取资质类型
		getAbilityType() {
			this.getloading = true;
			this.abilityOption = [];
			GetAbilityData()
				.then((res) => {
					this.getloading = false;
					if (res.code == 0) {
						let datas =
							this.ruleForm.industry_id == "1"
								? res.body.licenses[1]
								: res.body.licenses[2];
						for (let key in res.body.industry) {
							let _group = { label: res.body.industry[key], options: [] };
							for (let t_key in datas[key]) {
								let _item = {
									value: t_key,
									label: datas[key][t_key],
								};
								_group.options.push(_item);
							}
							if (_group.options.length > 0) {
								this.abilityOption.push(_group);
							}
						}
						this.haschange = false;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.getloading = false;
					this.$message.error(err);
				});
		},
		// 选择资质
		chooseOptions() {
			if (this.haschange) {
				this.getAbilityType();
			}
		},
		// 选择资质类型
		changeIds(value) {
			this.haschange = true;
			this.ruleForm.industry_id = value;
			this.ruleForm.license_id = "";
		},
		// 添加资质
		openAddPop() {
			this.addShow = true;
		},
		// 选择图片
		handleImage() {
			this.getUploadSts();
		},
		// 上传图片
		handlefile(e) {
			let _files = e.target.files;
			if (_files.length > 0) {
				if (_files.length + this.fileData.length > 10) {
					this.$message.error("最多上传10张图片");
				} else {
					for (let i = 0; i < _files.length; i++) {
						let _data = {
							name: _files[i].name,
							file: _files[i],
							url: window.URL.createObjectURL(_files[i]),
							size: _files[i].size,
							uploadPath: `newyuncaigou/${this.$state.user_id}/${
								this.$state.user_id
							}_${Math.round(
								new Date().getTime() / 1000
							).toString()}_${parseInt(Math.random() * 999)}.${_files[
								i
							].type.substr(6, 4)}`,
						};
						this.fileData.push(_data);
					}
				}
			}
		},
		// 拖拽图片
		checkMove(e) {
			// console.log("index: " + e.draggedContext.futureIndex);
		},
		// 删除图片
		deleteImg(idx) {
			this.fileData.splice(idx, 1);
		},
	},
};
</script>

<style lang="scss" scoped>
.table-operate {
	margin: 20px 0 10px;
}
/deep/ .el-cascader .el-input .el-input__inner,
/deep/ .el-input--prefix .el-input__inner,
/deep/ .el-select {
	width: 320px;
}
.el-form {
	height: calc(100% - 50px);
}
</style>
