<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="banner" :asideIdx="['banner']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>banner图管理</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="table-operate">
						<el-button type="primary" @click="addbanner">新增banner</el-button>
					</div>
					<el-table
						:data="tableData"
						border
						style="width: 100%"
						v-loading="loading"
						key="table"
					>
						<el-table-column
							type="index"
							width="50"
							align="center"
						></el-table-column>
						<el-table-column
							:resizable="false"
							label="标题"
							align="center"
							width="240px"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.title }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="banner图" align="center">
							<template slot-scope="scope">
								<div class="img-box" @click="$tools.openUrl(scope.row.image)">
									<img :src="scope.row.image" />
								</div>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="跳转链接"
							align="center"
							width="200px"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.url }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="显示顺序" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.orders }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="状态" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.status == 1" class="green">已通过</span>
								<span v-else-if="scope.row.status == 2" class="red"
									>已驳回</span
								>
								<span v-else-if="scope.row.status == 0">待审批</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="创建时间" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.createTime }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="操作"
							fixed="right"
							align="center"
							width="220px"
						>
							<template slot-scope="scope">
								<el-button
									size="mini"
									type="warning"
									@click="openEditPop(scope.row)"
									v-if="scope.row.status != 1"
									>编辑</el-button
								>
								<el-button
									@click.native.prevent="deleteRow(scope.row)"
									type="danger"
									size="mini"
								>
									删除
								</el-button>
								<el-button
									size="mini"
									type="success"
									@click.native.prevent="passRow(scope.row)"
									v-if="scope.row.status == 0"
									>通过</el-button
								>
								<el-button
									size="mini"
									type="info"
									@click.native.prevent="openReject(scope.row)"
									v-if="scope.row.status == 0"
									>驳回</el-button
								>
								<el-button
									size="mini"
									type="primary"
									@click="openReason(scope.row.reject)"
									v-if="scope.row.status == 2"
									>驳回原因</el-button
								>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-size="20"
						background
						layout="total, prev, pager, next"
						:total="total"
						:hide-on-single-page="true"
					>
					</el-pagination>
					<el-drawer
						:title="editid ? '编辑banner图' : '新增banner图'"
						:visible.sync="addbannerShow"
						size="70%"
					>
						<el-form
							:model="ruleForm"
							ref="form"
							label-width="100px"
							class="demo-ruleForm"
						>
							<el-form-item label="标题" required>
								<el-input
									v-model="ruleForm.title"
									placeholder="请输入标题"
									show-word-limit
									maxlength="30"
								></el-input>
							</el-form-item>
							<el-form-item label="banner图" required>
								<Appheadupload
									@handlefile="handleimg"
									ref="headupload"
								></Appheadupload>
								<p class="input-txt">
									注：图片大小不可超过2M，格式支持JPG、GIF、png；长宽为1920*575
								</p>
							</el-form-item>
							<el-form-item label="跳转链接">
								<el-input
									v-model="ruleForm.url"
									placeholder="请输入跳转链接"
								></el-input>
							</el-form-item>
							<el-form-item label="显示顺序">
								<el-input
									v-model="ruleForm.orders"
									placeholder="请输入显示顺序"
								></el-input>
								<p class="input-txt">
									注：只可输入正整数，数字越大，显示顺序越靠前
								</p>
							</el-form-item>
						</el-form>
						<div class="sub-btn">
							<el-button
								type="primary"
								@click="addSubmit"
								v-loading="uploading"
								element-loading-spinner="el-icon-loading"
								>确定保存</el-button
							>
						</div>
					</el-drawer>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	GetBannerData,
	PostBannerData,
	GetBannerDetail,
	EditBannerData,
	DelBanner,
	PassBanner,
	RejectBanner,
} from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppBanner",
	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [],
			addbannerShow: false, //新增弹窗
			ruleForm: {},
			editid: 0,
			uploading: false,
		};
	},
	created() {},
	computed: {
		...mapState(["userData"]),
	},
	watch: {},
	mounted() {
		this.getBannerList();
	},

	methods: {
		// 获取列表
		getBannerList() {
			this.loading = true;
			GetBannerData(this.currentPage).then((res) => {
				if (res.code == 0) {
					this.loading = false;
					if (res.data) {
						this.tableData = res.data.records;
						this.total = res.data.total;
					} else {
						this.$message.error("暂无数据");
					}
				} else {
					this.loading = false;
					this.$message.error(res.msg);
				}
			});
		},
		// 新增保存
		addSubmit() {
			if (!this.ruleForm.title) {
				this.$message.error("请输入标题");
			} else if (!this.ruleForm.image) {
				this.$message.error("请上传图片");
			} else {
				this.uploading = true;
				if (this.ruleForm.id) {
					EditBannerData(this.ruleForm).then((res) => {
						if (res.code == 0) {
							this.uploading = false;
							this.$message.success("保存成功");
							this.ruleForm = {};
							this.addbannerShow = false;
							this.getBannerList();
						} else {
							this.uploading = false;
							this.$message.error(res.msg);
						}
					});
				} else {
					PostBannerData(this.ruleForm).then((res) => {
						if (res.code == 0) {
							this.uploading = false;
							this.$message.success("保存成功");
							this.ruleForm = {};
							this.addbannerShow = false;
							this.getBannerList();
						} else {
							this.uploading = false;
							this.$message.error(res.msg);
						}
					});
				}
			}
		},
		// 编辑
		openEditPop(row) {
			this.addbannerShow = true;
			this.editid = row.id;
			GetBannerDetail(this.editid).then((res) => {
				if (res.code == 0) {
					this.ruleForm = res.data;
					this.$refs.headupload.imgurl = res.data.image;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		addbanner() {
			this.addbannerShow = true;
			this.ruleForm = {};
			this.$refs.headupload.imgurl = "";
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getBannerList();
		},
		// 驳回
		openReject(row) {
			this.$prompt("请输入驳回原因", "驳回", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				beforeClose: (action, instance, done) => {
					if (action === "confirm") {
						if (!instance.inputValue) {
							this.$message.error("请输入驳回原因");
						} else {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = "";
							RejectBanner(row.id, instance.inputValue)
								.then((res) => {
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = "确定";
									if (res.code == 0) {
										this.$message.success("操作成功");
										done();
										this.getBannerList();
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
				.then(({ value }) => {})
				.catch(() => {});
		},
		// 删除
		deleteRow(row) {
			this.$confirm("确定删除该banner图么？")
				.then(() => {
					DelBanner(row.id).then((res) => {
						if (res.code == 0) {
							this.$message.success("删除成功");
							this.getBannerList();
							setTimeout(() => {
								done();
							}, 400);
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {});
		},
		// 通过
		passRow(row) {
			this.$confirm("确定通过该banner图么？")
				.then(() => {
					PassBanner(row.id, 1).then((res) => {
						if (res.code == 0) {
							this.$message.success("操作成功");
							this.getBannerList();
							setTimeout(() => {
								done();
							}, 400);
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {});
		},
		// 驳回原因
		openReason(data) {
			this.$alert(data, "驳回原因", {
				confirmButtonText: "确定",
			});
		},
		// 新增的url
		handleimg(url) {
			this.ruleForm.image = url;
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-button--mini,
.el-button--mini.is-round {
	padding: 6px;
}

.table-operate {
	margin: 20px 0;
}
/deep/.el-table .cell {
	.img-box {
		width: 100%;
		height: 40px;
		overflow: hidden;
		cursor: zoom-in;
		img {
			width: 100%;
			height: 100%;
		}
	}
	span {
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
/deep/ .avatar-uploader {
	width: 380px;
}

/deep/ .avatar {
	width: 380px !important;
}
/deep/ .el-input {
	width: 60%;
}
</style>
