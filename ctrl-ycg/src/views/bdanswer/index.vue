<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="bdanswer" :asideIdx="['5']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card" id="el-main">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 百度问答 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>爱采购问答是爱采购针对B2B领域推出的专业问答产品.</p>
								<p>
									<span class="green">对买家而言，</span
									>爱采购问答在丰富搜索结果页内容、满足搜索用户体验的同时，为买家提供了专业且权威的问答内容，其内容下附带相关商品推荐的产品模式可直接满足买家更进一层的购买需求。
								</p>
								<p>
									<span class="green">对会员而言，</span
									>提供优质问答内容的会员将获得全方位的商品、店铺、品牌等曝光；买家可通过答案详情页直接跳转至会员店铺，为会员店铺导流，在会员提供的答案下方，在同等条件下，将优先推荐该会员的商品，使会员获取更多询价线索。
								</p>
							</div>
							<div class="table-search">
								<label class="el-form-item__label">筛选状态</label>
								<el-select
									v-model="asstatus"
									placeholder="筛选问题类型"
									@change="chooseShow"
								>
									<el-option
										v-for="item in selectopt"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</div>
							<!-- 表格 -->
							<el-table
								:data="tableData"
								border
								style="width: 100%"
								v-loading="loading"
								ref="multipleTable"
							>
								<el-table-column
									:resizable="false"
									fixed
									label="商品词"
									width="180"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.commodityWords }}</span>
									</template>
								</el-table-column>
								<el-table-column :resizable="false" label="问题">
									<template slot-scope="scope">
										<span>{{ scope.row.headline }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="状态"
									width="80"
									align="center"
								>
									<template slot-scope="scope">
										<span v-if="scope.row.status == 0" class="blue"
											>待回答</span
										>
										<span v-else-if="scope.row.status == 2" class="green"
											>已上线</span
										>
										<span v-else-if="scope.row.status == 3">未上线</span>
										<span v-else-if="scope.row.status == 1" class="orange"
											>审核中</span
										>
										<span v-else-if="scope.row.status == 4" class="red"
											>审核失败</span
										>
										<span v-else>-</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="失败原因"
									width="200"
									v-if="asstatus == 2 || asstatus == 4"
								>
									<template slot-scope="scope">
										<span>{{
											scope.row.status_msg ? scope.row.status_msg : "-"
										}}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="回答时间"
									width="160"
									align="center"
									v-if="asstatus != 0"
								>
									<template slot-scope="scope">
										<span>{{
											scope.row.update_time ? scope.row.update_time : "-"
										}}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="抓取时间"
									width="160"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.dispTime }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="操作"
									fixed="right"
									:width="asstatus == 0 ? '220' : '140'"
									align="center"
									v-if="asstatus == 0 || asstatus == 4"
								>
									<template slot-scope="scope">
										<div v-if="scope.row.status == 0">
											<el-button
												size="mini"
												type="primary"
												@click="openEditPop(scope.row.id)"
												>回答问题</el-button
											>
											<el-button
												size="mini"
												type="danger"
												@click="removeAs(scope.row.id)"
												>放弃回答</el-button
											>
										</div>
										<div v-else>
											<el-button
												size="mini"
												type="warning"
												@click="openEditPop(scope.row.id)"
												>修改问题</el-button
											>
										</div>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination
								@current-change="handleChange"
								:current-page="currentPage"
								:page-size="10"
								background
								layout="total, prev, pager, next, jumper"
								:total="total"
								:hide-on-single-page="true"
							>
							</el-pagination>
							<el-drawer
								:title="quesdata.headline"
								:visible.sync="editShow"
								size="80%"
								:destroy-on-close="true"
							>
								<div class="tips">
									<p>
										下述【来源网址】为爱采购侧承认的依据来源，其余依据来源均不可作为答案依据；建议使用百度百科等百度产品作为优先依据来源。
									</p>
									<p>
										建议所有非全部内容原创的词条都要提交依据来源，未提交依据来源的词条默认为纯原创词条，若审核过程中发现该词条内包含参考成分，则该词条会被直接驳回。
									</p>
									<p>
										提供的依据来源的链接，必须为正常可以打开的链接形式，并且打开后直接跳转至原文正文的链接，不可以提交无法明确查看来源内容的链接，例如：文章列表页、死链等。
									</p>
								</div>
								<div class="top-text">
									<span>所属分类</span
									>{{ quesdata.category ? quesdata.category : "-" }}
								</div>
								<div class="top-text">
									<span>关键词</span
									>{{ quesdata.commodityWords ? quesdata.commodityWords : "-" }}
								</div>
								<el-form
									:model="content"
									ref="form"
									label-width="80px"
									class="demo-ruleForm"
									v-loading="pageload"
								>
									<el-form-item label="关联产品">
										<el-input
											v-model="content.sell_id"
											placeholder="请复制关联产品的ID"
										></el-input>
									</el-form-item>
									<el-form-item label="来源网址">
										<el-input
											v-model="content.source"
											placeholder="请输入网址格式"
										></el-input>
									</el-form-item>
									<p class="_h4">
										<a>回复区 <i class="iconfont">&#xe60a;</i></a>
									</p>
									<p class="input-txt mb10">
										回复主图图片比例1:1，大小不低于300*300；不支持png格式。图片内容为问题或答案所涉及的商品；商品务必居中展现；图片使用白色或其它浅色背景；不得出现无关物体。
									</p>
									<el-form-item label="回复主图" required>
										<Appheadupload
											@handlefile="handlefile"
											:noadd="true"
											ref="headupload"
										></Appheadupload>
									</el-form-item>
									<el-form-item label="回复概述" required>
										<el-input
											type="textarea"
											:autosize="{ minRows: 2, maxRows: 10 }"
											placeholder="请输入回复概述"
											v-model="content.bk_overview"
											resize="none"
										>
										</el-input>
									</el-form-item>
									<el-form-item label="回复信息" required>
										<el-input
											type="textarea"
											:autosize="{ minRows: 2, maxRows: 10 }"
											placeholder="请输入回复信息"
											v-model="content.bk_info"
											resize="none"
										>
										</el-input>
									</el-form-item>
									<p class="_h4">
										<a>商家回答区 <i class="iconfont">&#xe60a;</i></a>
									</p>
									<p class="input-txt mb10">回答1</p>
									<el-form-item label="子标题" required>
										<el-input
											v-model="content.child_overview_1"
											placeholder="请输入子标题"
										></el-input>
									</el-form-item>
									<el-form-item label="回复图片">
										<Appheadupload
											@handlefile="handlefile1"
											:noadd="true"
											ref="headupload1"
										></Appheadupload>
									</el-form-item>
									<el-form-item label="回复内容" required>
										<el-input
											type="textarea"
											:autosize="{ minRows: 2, maxRows: 10 }"
											placeholder="请输入回复内容"
											v-model="content.child_info_1"
											resize="none"
										>
										</el-input>
									</el-form-item>
									<p class="input-txt mb10">回答2</p>
									<el-form-item label="子标题">
										<el-input
											v-model="content.child_overview_2"
											placeholder="请输入子标题"
										></el-input>
									</el-form-item>
									<el-form-item label="回复图片">
										<Appheadupload
											@handlefile="handlefile2"
											:noadd="true"
											ref="headupload2"
										></Appheadupload>
									</el-form-item>
									<el-form-item label="回复内容">
										<el-input
											type="textarea"
											:autosize="{ minRows: 2, maxRows: 10 }"
											placeholder="请输入回复内容"
											v-model="content.child_info_2"
											resize="none"
										>
										</el-input>
									</el-form-item>
									<p class="input-txt mb10">回答3</p>
									<el-form-item label="子标题">
										<el-input
											v-model="content.child_overview_3"
											placeholder="请输入子标题"
										></el-input>
									</el-form-item>
									<el-form-item label="回复图片">
										<Appheadupload
											@handlefile="handlefile3"
											:noadd="true"
											ref="headupload3"
										></Appheadupload>
									</el-form-item>
									<el-form-item label="回复内容">
										<el-input
											type="textarea"
											:autosize="{ minRows: 2, maxRows: 10 }"
											placeholder="请输入回复内容"
											v-model="content.child_info_3"
											resize="none"
										>
										</el-input>
									</el-form-item>
									<div class="sub-btn">
										<el-button
											type="primary"
											@click="submitForm"
											v-loading="subloading"
											>保存信息</el-button
										>
									</div>
								</el-form>
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
	getAnswerlist,
	PostAsForgive,
	getAnswerInfo,
	PostAnswer,
} from "../../api/apis";
export default {
	name: "AppBDanswer",
	data() {
		return {
			tableData: [],
			loading: false,
			currentPage: 1,
			asstatus: 0, //类型
			total: 0,
			selectopt: [
				{ value: 0, label: "待回答" },
				{ value: 2, label: "已上线" },
				{ value: 3, label: "未上线" },
				{ value: 1, label: "审核中" },
				{ value: 4, label: "审核失败" },
			],
			editShow: false, //回答问题弹窗
			quesdata: {}, //问答详情
			content: {}, //回答详情
			pageload: false, //回答loading
			subloading: false, //提交loading
			askid: "",
		};
	},
	created() {},
	mounted() {
		this.getAnsList();
	},
	destroyed() {
		this.tableData = [];
	},
	methods: {
		// 获取列表
		getAnsList(page) {
			let _page = page ? page : this.currentPage;
			this.loading = true;
			getAnswerlist(this.asstatus, _page).then((res) => {
				this.loading = false;
				if (res.code == 0) {
					this.total = res.body.page.count;
					this.tableData = res.body.list;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 选择页码
		handleChange(val) {
			this.getAnsList(val);
		},
		// 筛选
		chooseShow() {
			this.getAnsList(1);
		},
		// 放弃回答
		removeAs(id) {
			this.$prompt("请输入放弃原因", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				beforeClose: (action, instance, done) => {
					if (action === "confirm") {
						if (instance.inputValue == "") {
							this.$message.error("请输入放弃原因");
						} else {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = "";
							PostAsForgive(id, instance.inputValue)
								.then((res) => {
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = "确定";
									if (res.code == 0) {
										this.$message.success("提交成功");
										this.getAnsList();
										done();
									} else {
										this.$message.error(res.msg);
									}
								})
								.catch((err) => {
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = "确定";
								});
						}
					} else {
						instance.confirmButtonLoading = false;
						instance.confirmButtonText = "确定";
						done();
					}
				},
			})
				.then(({ value }) => {
					this.getPhotoList(this.currentPage);
				})
				.catch(() => {});
		},
		// 回答
		openEditPop(id) {
			this.editShow = true;
			this.pageload = true;
			this.askid = id;
			this.getAnsInfo(id);
		},
		// 主图
		handlefile(url) {
			this.content.master_picture = url;
		},
		// 回答123
		handlefile1(url) {
			this.content.child_picture_1 = url;
		},
		handlefile2(url) {
			this.content.child_picture_2 = url;
		},
		handlefile3(url) {
			this.content.child_picture_3 = url;
		},
		// 获取问答详情
		getAnsInfo(id) {
			getAnswerInfo(id).then((res) => {
				this.pageload = false;
				if (res.code == 0) {
					this.quesdata = res.body;
					this.content = res.body.content ? JSON.parse(res.body.content) : {};
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 保存
		submitForm() {
			let _form = JSON.parse(JSON.stringify(this.content));
			_form.ask_id = this.askid;
			if (!_form.bk_overview) {
				this.$message.error("请输入回复概述");
			} else if (!_form.bk_info) {
				this.$message.error("请输入回复信息");
			} else if (!_form.master_picture) {
				this.$message.error("请上传回复主图");
			} else if (!_form.child_overview_1 || !_form.child_info_1) {
				this.$message.error("请至少填写一个回答");
			} else {
				this.subloading = true;
				PostAnswer(_form).then((res) => {
					this.subloading = false;
					if (res.code == 0) {
						this.$message.success("保存成功");
						this.editShow = false;
						this.getAnsList(this.currentPage);
					} else {
						this.$message.error(res.msg);
					}
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.table-search {
	width: 100%;
	text-align: left;
}
.top-text {
	font-size: 14px;
	color: #606266;
	line-height: 1;
	margin-bottom: 28px;
	padding-top: 10px;
	span {
		display: inline-block;
		width: 80px;
		padding-right: 12px;
		text-align: right;
		box-sizing: border-box;
	}
}
._h4 {
	font-size: 14px;
	font-weight: 600;
	color: #222222;
	margin: 40px 0 20px;
}
/deep/ .el-textarea,
/deep/ .el-input {
	max-width: 400px;
}
.mb10 {
	margin-bottom: 10px;
}
.sub-btn {
	margin-top: 40px;
}
</style>
