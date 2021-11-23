<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="manageuser" :asideIdx="['manageuser']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>用户管理</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="tips" v-if="$tools.isMenus(9)">
						<p>点击标题可查看内容详情</p>
					</div>
					<div class="table-search">
						<el-input
							placeholder="请输入标题"
							v-model="searchwords"
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
						<el-select v-model="typeId" placeholder="请选择身份类型">
							<el-option
								v-for="(item, index) in typeopt"
								:key="index"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
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
							label="序号"
							type="index"
							width="50"
							align="center"
							fixed
						>
							<template slot-scope="scope">
								{{ (currentPage - 1) * 20 + scope.$index + 1 }}
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="企业名称" align="center">
							<template slot-scope="scope">
								<a
									href="javascript:;"
									@click="openDetail(scope.row)"
									v-if="$tools.isMenus(9)"
								>
									{{ scope.row.entName }}
								</a>
								<span v-else>{{ scope.row.entName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="身份类型" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.role == 0">项目业主</span>
								<span v-else-if="scope.row.role == 1">排放单位</span>
								<span v-else-if="scope.row.role == 2">项目代理人</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="经办人姓名"
							align="center"
							width="100px"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.operator }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="经办人手机号码"
							align="center"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.operatorMobile }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="所在地区" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.cityStr }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="状态"
							align="center"
							width="80px"
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
									>已冻结</span
								>
								<span v-else-if="scope.row.status == 4" class="blue"
									>已开启</span
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
							width="140px"
						>
							<template slot-scope="scope">
								<el-button
									@click.native.prevent="openReject(scope.row)"
									type="danger"
									size="mini"
									v-if="scope.row.status == 1 || scope.row.status == 4"
								>
									冻结
								</el-button>
								<el-button
									@click.native.prevent="passRow(scope.row)"
									type="success"
									size="mini"
									v-if="scope.row.status == 3"
								>
									开启
								</el-button>
								<el-button
									size="mini"
									type="success"
									@click.native.prevent="passRow(scope.row)"
									v-if="scope.row.status == 0 && $tools.isMenus(10)"
									>通过</el-button
								>
								<el-button
									size="mini"
									type="info"
									@click.native.prevent="openReject(scope.row)"
									v-if="scope.row.status == 0 && $tools.isMenus(11)"
									>驳回</el-button
								>
								<el-button
									size="mini"
									type="primary"
									@click="openReason(scope.row)"
									v-if="
										$tools.isMenus(12) &&
										(scope.row.status == 2 || scope.row.status == 3)
									"
									>原因</el-button
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
					<el-drawer title="内容详情" :visible.sync="detailShow" size="70%">
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">基础信息</span>
							</div>
							<div class="card-item">
								<span>企业名称：</span>
								<span>{{ deDatas.entName }}</span>
							</div>
							<div class="card-item">
								<span>登录名称：</span>
								<span>{{ deDatas.userName }}</span>
							</div>
							<div class="card-item">
								<span>支付密码：</span>
								<span>{{ deDatas.payPassword }}</span>
							</div>
							<div class="card-item">
								<span>身份类型：</span>
								<span>{{ $tools.roleToLabel(deDatas.role) }}</span>
							</div>
						</el-card>
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">身份信息</span>
							</div>
							<div class="card-item w100">
								<span>三证合一证件号码：</span>
								<span>{{ deDatas.licenseNumber }}</span>
							</div>
							<div class="card-item">
								<span>法定代表姓名：</span>
								<span>{{ deDatas.legalPerson }}</span>
							</div>
							<div class="card-item">
								<span>法人性质：</span>
								<span>{{ deDatas.legalPersonType }}</span>
							</div>
							<div class="card-item">
								<span>所属行业：</span>
								<span>{{ deDatas.industryName }}</span>
							</div>
							<div class="card-item w100">
								<span>营业执照照片：</span>
								<img
									:src="deDatas.licenseUrl"
									@click="$tools.openUrl(deDatas.licenseUrl)"
								/>
							</div>
						</el-card>
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">联系信息</span>
							</div>
							<div class="card-item">
								<span>经办人姓名：</span>
								<span>{{ deDatas.operator }}</span>
							</div>
							<div class="card-item">
								<span>经办人手机号码：</span>
								<span>{{ deDatas.operatorMobile }}</span>
							</div>
							<div class="card-item">
								<span>经办人身份证号码：</span>
								<span>{{ deDatas.operatorId }}</span>
							</div>
							<div class="card-item">
								<span>电子邮箱：</span>
								<span>{{ deDatas.mail }}</span>
							</div>
							<div class="card-item">
								<span>固定电话：</span>
								<span>{{ deDatas.telephone }}</span>
							</div>
							<div class="card-item w50">
								<span>所在地区：</span>
								<span
									>{{ deDatas.provinceStr }} {{ deDatas.cityStr }}
									{{ deDatas.districtStr }}</span
								>
							</div>
							<div class="card-item w50">
								<span>详细地址：</span>
								<span>{{ deDatas.address }}</span>
							</div>
						</el-card>
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">银行信息</span>
							</div>
							<div class="card-item w50">
								<span>开户银行：</span>
								<span>{{ deDatas.bankKey }}</span>
							</div>
							<div class="card-item w50">
								<span>银行账号：</span>
								<span>{{ deDatas.bankNumber }}</span>
							</div>
						</el-card>
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">保证金信息</span>
							</div>
							<div class="card-item w50">
								<span>缴纳金额：</span>
								<span>{{ deDatas.premiumReceived }}</span>
							</div>
							<div class="card-item w50">
								<span>剩余保证金金额：</span>
								<span>{{ deDatas.deposit }}</span>
							</div>
							<div class="card-item w100">
								<span>缴纳凭证：</span>
								<img
									:src="deDatas.depositProof"
									@click="$tools.openUrl(deDatas.depositProof)"
								/>
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
										>已冻结</span
									>
									<span v-else-if="deDatas.status == 4" class="blue"
										>已开启</span
									>
								</div>
								<div v-if="deDatas.status == 0" class="btn-box">
									<el-button
										size="small"
										type="success"
										v-if="$tools.isMenus(10)"
										@click.native.prevent="passRow(deDatas)"
										>通过</el-button
									>
									<el-button
										size="small"
										type="info"
										v-if="$tools.isMenus(11)"
										@click.native.prevent="openReject(deDatas)"
										>驳回</el-button
									>
								</div>
								<div v-else>
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
									<div class="card-item" v-if="deDatas.status == 4">
										<span>冻结原因：</span>
										<span>{{ deDatas.reject }}</span>
									</div>
								</div>
								<div v-if="deDatas.status == 3" class="btn-box">
									<el-button
										size="small"
										type="success"
										@click.native.prevent="passRow(deDatas)"
										>开启</el-button
									>
								</div>
								<div v-if="deDatas.status == 4" class="btn-box">
									<el-button
										size="small"
										type="danger"
										@click.native.prevent="openReject(deDatas)"
										>冻结</el-button
									>
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
import { GetUserMana, RejectUserMana, GetUserManaData } from "../../api/apis";
export default {
	name: "AppManageUser",

	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [],
			choosedate: "",
			selectval: "",
			typeId: "",
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
			typeopt: [
				{ value: 0, label: "项目业主" },
				{ value: 1, label: "排放单位" },
				{ value: 2, label: "项目代理人" },
			],
			selectopt: [
				{ value: 0, label: "待审核" },
				{ value: 1, label: "已通过" },
				{ value: 2, label: "已驳回" },
				{ value: 3, label: "已冻结" },
				{ value: 4, label: "已开启" },
			],
			searchwords: "",
			detailrow: {},
			detailShow: false,
			deDatas: {},
		};
	},
	created() {},

	watch: {},
	mounted() {
		this.getlist();
	},

	methods: {
		// 获取列表
		getlist() {
			this.loading = true;
			GetUserMana(
				this.currentPage,
				this.searchwords,
				this.choosedate,
				this.typeId,
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
		// 驳回冻结
		openReject(row) {
			let state = row.status;
			this.$prompt(
				state == 0
					? "请输入驳回原因"
					: "冻结后不可进行交易，并撤单所有挂牌信息",
				state == 0 ? "驳回" : "冻结",
				{
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					inputPlaceholder: state == 0 ? "" : "请输入冻结原因",
					beforeClose: (action, instance, done) => {
						if (action === "confirm") {
							if (!instance.inputValue) {
								if (state == 0) {
									this.$message.error("请输入驳回原因");
								} else {
									this.$message.error("请输入冻结原因");
								}
							} else if (instance.inputValue.length > 50) {
								this.$message.error(
									`最多输入50个字；当前${instance.inputValue.length}个字`
								);
							} else {
								instance.confirmButtonLoading = true;
								instance.confirmButtonText = "";
								let _stu = state == 0 ? "2" : "3";
								RejectUserMana(row.id, _stu, instance.inputValue)
									.then((res) => {
										instance.confirmButtonLoading = false;
										instance.confirmButtonText = "确定";
										if (res.code == 0) {
											this.$message.success("操作成功");
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
				}
			)
				.then(({ value }) => {
					this.getlist();
				})
				.catch(() => {});
		},
		// 打开详情
		openDetail(row) {
			this.detailrow = row;
			GetUserManaData(row.id).then((res) => {
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
			let state = row.status;
			this.$confirm(
				state == 0
					? "确定审核通过该内容么？"
					: "确定开启该用户么？开启后用户可再次进行交易"
			)
				.then(() => {
					let _s = state == 0 ? 1 : 4;
					RejectUserMana(row.id, _s, "").then((res) => {
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
				})
				.catch(() => {});
		},
		// 驳回原因
		openReason(row) {
			let state = row.status;
			this.$alert(
				state == "3" ? `冻结原因：${row.reject}` : `驳回原因：${row.reject}`,
				state == "3" ? "冻结" : "驳回",
				{
					confirmButtonText: "确定",
				}
			);
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
	a,
	span {
		white-space: nowrap;
		text-overflow: ellipsis;
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
</style>
