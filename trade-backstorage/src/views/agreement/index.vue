<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="agreement" :asideIdx="['agreement']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>协议成交管理</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="tips"><p>点击项目名称可查看内容详情</p></div>
					<div class="table-search">
						<el-input
							placeholder="请输入接受企业名称"
							v-model="searchin"
							class="input-with-select"
						>
						</el-input>
						<el-input
							placeholder="请输入转出企业名称"
							v-model="searchout"
							class="input-with-select"
						>
						</el-input>
						<div class="date-choose">
							<el-date-picker
								v-model="choosedate"
								align="right"
								type="date"
								placeholder="选择日期"
								:picker-options="pickerOptions"
								:clearable="false"
							>
							</el-date-picker>
						</div>
						<el-select v-model="selectval" placeholder="请选择状态">
							<el-option
								v-for="item in selectopt"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
						<el-button
							slot="append"
							type="primary"
							icon="el-icon-search"
							@click="getlist"
							>搜索</el-button
						>
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
						<el-table-column :resizable="false" label="项目名称" align="center">
							<template slot-scope="scope">
								<a href="javascript:;" @click="openDetail(scope.row)">
									{{ scope.row.projectName }}
								</a>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="转让金额" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.price }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="转让数量" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.quantity }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="交易总金额"
							align="center"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.totalAmount }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="交易服务费"
							align="center"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.serviceFee }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="接收企业" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.fromEntName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="转出企业" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.toEntName }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="是否线上交易"
							align="center"
							width="120px"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.isOnline == '0'">否</span>
								<span v-else>是</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="状态"
							align="center"
							width="110px"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.status == 0">待审核</span>
								<span v-else-if="scope.row.status == 1" class="green"
									>已通过</span
								>
								<span v-else-if="scope.row.status == 2" class="red"
									>已驳回</span
								>
								<span v-else-if="scope.row.status == 3" class="orange"
									>接收方待确认</span
								>
								<span v-else-if="scope.row.status == 4" class="red"
									>接收方已拒绝</span
								>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="提交时间" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.createTime }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="操作"
							fixed="right"
							align="center"
							width="160px"
						>
							<template slot-scope="scope">
								<el-button
									size="mini"
									type="warning"
									@click.native.prevent="openedit(scope.row)"
									v-if="scope.row.status == 0"
									>编辑</el-button
								>
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
									@click="openReason(scope.row)"
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
					<el-dialog title="编辑" :visible.sync="editshow">
						<el-form :model="ruleForm">
							<el-form-item label="交易总金额">
								<el-input
									v-model="ruleForm.totalAmount"
									placeholder="请输入交易总金额"
									type="text"
									@input="
										ruleForm.totalAmount = $tools.onlyNumber(
											ruleForm.totalAmount
										)
									"
								></el-input>
								<p class="input-txt">元</p>
							</el-form-item>
							<el-form-item label="交易服务费">
								<el-input
									v-model="ruleForm.serviceFee"
									placeholder="请输入交易服务费"
									type="text"
									@input="
										ruleForm.serviceFee = $tools.onlyNumber(ruleForm.serviceFee)
									"
								></el-input>
								<p class="input-txt">元</p>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="editshow = false">取 消</el-button>
							<el-button type="primary" @click="editBtn">确 定</el-button>
						</div>
					</el-dialog>
					<el-drawer title="内容详情" :visible.sync="detailShow" size="70%">
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">转让信息</span>
							</div>
							<div class="card-item">
								<span>项目名称：</span>
								<span>{{ deDatas.projectName }}</span>
							</div>
							<div class="card-item">
								<span>转让价格：</span>
								<span>{{ deDatas.price }}</span>
							</div>
							<div class="card-item">
								<span>转让数量：</span>
								<span>{{ deDatas.quantity }}</span>
							</div>
							<div class="card-item">
								<span>交易总金额：</span>
								<span>{{ deDatas.totalAmount }}</span>
							</div>
							<div class="card-item">
								<span>是否线上交易：</span>
								<span v-if="deDatas.isOnline == 0">否</span>
								<span v-if="deDatas.isOnline == 1">是</span>
							</div>
							<div class="card-item">
								<span>交易服务费：</span>
								<span>{{ deDatas.serviceFee }}</span>
							</div>
							<div class="card-item">
								<span>提交时间：</span>
								<span>{{ deDatas.createTime }}</span>
							</div>
						</el-card>
						<el-card
							class="box-card"
							shadow="never"
							v-if="deDatas.toTrEnterprise"
						>
							<div slot="header" class="clearfix">
								<span class="_h4">转出方信息</span>
							</div>
							<div class="card-item">
								<span>企业名称：</span>
								<span>{{ deDatas.toTrEnterprise.entName }}</span>
							</div>
							<div class="card-item">
								<span>企业身份：</span>
								<span>{{
									$tools.roleToLabel(deDatas.toTrEnterprise.role)
								}}</span>
							</div>
							<div class="card-item">
								<span>所在地区：</span>
								<span
									>{{ deDatas.toTrEnterprise.province }}
									{{ deDatas.toTrEnterprise.city }}
									{{ deDatas.toTrEnterprise.district }}</span
								>
							</div>
							<div class="card-item">
								<span>三证合一证件号码：</span>
								<span>{{ deDatas.toTrEnterprise.licenseNumber }}</span>
							</div>
							<div class="card-item">
								<span>经办人姓名：</span>
								<span>{{ deDatas.toTrEnterprise.operator }}</span>
							</div>
							<div class="card-item">
								<span>经办人手机号码：</span>
								<span>{{ deDatas.toTrEnterprise.operatorMobile }}</span>
							</div>
							<div class="card-item">
								<span>详细地址：</span>
								<span>{{ deDatas.toTrEnterprise.address }}</span>
							</div>
						</el-card>
						<el-card
							class="box-card"
							shadow="never"
							v-if="deDatas.formTrEnterprise"
						>
							<div slot="header" class="clearfix">
								<span class="_h4">接收方信息</span>
							</div>
							<div class="card-item">
								<span>企业名称：</span>
								<span>{{ deDatas.formTrEnterprise.entName }}</span>
							</div>
							<div class="card-item">
								<span>企业身份：</span>
								<span>{{
									$tools.roleToLabel(deDatas.formTrEnterprise.role)
								}}</span>
							</div>
							<div class="card-item">
								<span>所在地区：</span>
								<span
									>{{ deDatas.formTrEnterprise.province }}
									{{ deDatas.formTrEnterprise.city }}
									{{ deDatas.formTrEnterprise.district }}</span
								>
							</div>
							<div class="card-item">
								<span>三证合一证件号码：</span>
								<span>{{ deDatas.formTrEnterprise.licenseNumber }}</span>
							</div>
							<div class="card-item">
								<span>经办人姓名：</span>
								<span>{{ deDatas.formTrEnterprise.operator }}</span>
							</div>
							<div class="card-item">
								<span>经办人手机号码：</span>
								<span>{{ deDatas.formTrEnterprise.operatorMobile }}</span>
							</div>
							<div class="card-item">
								<span>详细地址：</span>
								<span>{{ deDatas.formTrEnterprise.address }}</span>
							</div>
						</el-card>
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">审批信息</span>
							</div>
							<div>
								<div class="card-item">
									<span>状态：</span>
									<span v-if="deDatas.status == 0">待审核</span>
									<span v-else-if="deDatas.status == 1" class="green"
										>已通过</span
									>
									<span v-else-if="deDatas.status == 2" class="red"
										>已驳回</span
									>
									<span v-else-if="deDatas.status == 3" class="orange"
										>接收方待确认</span
									>
									<span v-else-if="deDatas.status == 4" class="red"
										>接收方已拒绝</span
									>
								</div>
								<div v-if="deDatas.status == 0" class="btn-box">
									<el-button
										size="small"
										type="success"
										@click.native.prevent="passRow(deDatas)"
										>通过</el-button
									>
									<el-button
										size="small"
										type="info"
										@click.native.prevent="openReject(deDatas)"
										>驳回</el-button
									>
								</div>
								<div v-else-if="deDatas.status == 1 || deDatas.status == 2">
									<div class="card-item">
										<span>审批时间：</span>
										<span>{{ deDatas.auditCreateTime }}</span>
									</div>
									<div class="card-item">
										<span>审批人员：</span>
										<span>{{ deDatas.reviewerUserName }}</span>
									</div>
									<div class="card-item" v-if="deDatas.status == 2">
										<span>驳回原因：</span>
										<span>{{ deDatas.reject }}</span>
									</div>
								</div>
							</div>
						</el-card>
					</el-drawer>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	GetAgreeMana,
	RejectAgreeMana,
	GetAgreeManaData,
	EditAgreeData,
} from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppAgreement",

	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [],
			choosedate: "",
			selectval: "",
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
				shortcuts: [
					{
						text: "今天",
						onClick(picker) {
							picker.$emit("pick", new Date());
						},
					},
					{
						text: "昨天",
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit("pick", date);
						},
					},
					{
						text: "一周前",
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit("pick", date);
						},
					},
				],
			},
			selectopt: [
				{ value: 0, label: "待审核" },
				{ value: 1, label: "已通过" },
				{ value: 2, label: "已驳回" },
				{ value: 3, label: "接收方待确认" },
				{ value: 4, label: "接收方已拒绝" },
			],
			searchin: "",
			searchout: "",
			detailrow: {},
			detailShow: false,
			ruleForm: { totalAmount: "", serviceFee: "" },
			editshow: false,
			deDatas: {},
		};
	},
	created() {},
	computed: {
		...mapState(["userData"]),
	},
	watch: {},
	mounted() {
		this.getlist();
	},

	methods: {
		// 获取列表
		getlist() {
			this.loading = true;
			GetAgreeMana(
				this.currentPage,
				this.searchin,
				this.searchout,
				this.choosedate,
				this.selectval
			).then((res) => {
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
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getlist();
		},
		// 驳回
		openReject(row) {
			this.$prompt("请输入驳回原因", "驳回", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				inputPlaceholder: "请输入驳回原因",
				beforeClose: (action, instance, done) => {
					if (action === "confirm") {
						if (!instance.inputValue) {
							this.$message.error("请输入驳回原因");
						} else if (instance.inputValue.length > 50) {
							this.$message.error(
								`最多输入50个字；当前${instance.inputValue.length}个字`
							);
						} else {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = "";
							RejectAgreeMana(row.id, 2, instance.inputValue)
								.then((res) => {
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = "确定";
									if (res.code == 0) {
										this.$message.success("操作成功");
										this.detailShow = false;
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
					this.getlist();
				})
				.catch(() => {});
		},
		// 打开详情
		openDetail(row) {
			this.detailrow = row;
			GetAgreeManaData(row.id).then((res) => {
				if (res.code == 0) {
					this.deDatas = res.data;
				} else {
					this.$message.error(res.msg);
				}
			});
			this.detailShow = true;
		},
		// 通过
		passRow(row) {
			this.$confirm("确定通过该用户的协议转让申请？")
				.then(() => {
					RejectAgreeMana(row.id, 1, "").then((res) => {
						if (res.code == 0) {
							this.$message.success("操作成功");
							this.getlist();
							setTimeout(() => {
								this.detailShow = false;
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
		openReason(row) {
			this.$alert(`驳回原因：${row.reject}`, "驳回", {
				confirmButtonText: "确定",
			});
		},
		// 打开编辑
		openedit(row) {
			this.detailrow = row;
			this.ruleForm.totalAmount = row.totalAmount ? row.totalAmount : "";
			this.ruleForm.serviceFee = row.serviceFee ? row.serviceFee : "";
			this.editshow = true;
		},
		// 编辑保存
		editBtn() {
			this.ruleForm.id = this.detailrow.id;
			this.ruleForm.status = this.detailrow.status;
			EditAgreeData(this.ruleForm).then((res) => {
				if (res.code == 0) {
					this.$message.success("操作成功");
					this.getlist();
					setTimeout(() => {
						done();
					}, 400);
				} else {
					this.$message.error(res.msg);
				}
			});
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
.table-search {
	margin: 20px 0;
}
.date-choose {
	display: inline-block;
	vertical-align: middle;
	font-size: 0;
}
/deep/ .el-input__icon {
	line-height: 1;
}
/deep/ .el-form-item__span {
	line-height: 36px;
}
/deep/ .el-input__inner {
	height: 36px;
	line-height: 36px;
}
/deep/ .el-date-editor .el-range-separator {
	line-height: 28px;
}
/deep/ .el-date-editor .el-range__icon {
	line-height: 28px;
}
/deep/ .el-select {
	width: 180px;
}
.el-input {
	width: 220px;
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
	a {
		color: #606266;
	}
}
._h4 {
	font-size: 16px;
	font-weight: 600;
}
/deep/ .el-card__header {
	padding: 8px 20px;
}

.card-item {
	display: inline-block;
	vertical-align: middle;
	min-width: 33%;
	font-size: 0;
	margin-bottom: 12px;
	span {
		display: inline-block;
		vertical-align: top;
		font-size: 14px;
		line-height: 20px;
		color: #606266;
	}
	img {
		width: 100px;
		cursor: zoom-in;
	}
}
.w50 {
	width: 48%;
}
.w100 {
	width: 100%;
	span {
		max-width: calc(100% - 80px);
	}
}

.el-table tr {
	.edit-btn {
		color: #fff !important;
		text-decoration: none !important;
	}
}
.el-table tr:hover {
	.cell {
		a {
			text-decoration: underline;
			color: #1a8cff;
		}
	}
}
/deep/ .el-dialog {
	width: 34%;
	.el-select {
		margin: 20px auto;
	}
	.el-input {
		width: 300px;
	}
	.input-txt {
		display: inline-block;
	}
}
/deep/ .el-dialog__body {
	padding: 10px 20px 0;
}
</style>
