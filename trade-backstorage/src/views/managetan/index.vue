<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="managetan" :asideIdx="['managetan']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>碳汇项目管理</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="tips"><p>点击项目名称可查看内容详情</p></div>
					<div class="table-search">
						<el-input
							placeholder="请输入企业名称"
							v-model="searchcom"
							class="input-with-select"
						>
						</el-input>
						<el-input
							placeholder="请输入项目名称"
							v-model="searchpro"
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
							fixed
						></el-table-column>
						<el-table-column
							:resizable="false"
							label="项目名称"
							align="center"
							fixed
						>
							<template slot-scope="scope">
								<a href="javascript:;" @click="openDetail(scope.row)">
									{{ scope.row.name }}
								</a>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="申报企业" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.entName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="项目地址" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.address }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="备案号" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.recordNumber }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="备案时间" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.recordTime }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="项目类型" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.type }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="预计减排数量"
							align="center"
							width="120px"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.preEmissionReduction }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="已审批减排数量"
							align="center"
							width="120px"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.certifiedEmissionReduction }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="状态"
							align="center"
							width="100px"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.status == 0">项目待审批</span>
								<span v-else-if="scope.row.status == 1" class="green"
									>项目已通过</span
								>
								<span v-else-if="scope.row.status == 2" class="red"
									>项目已驳回</span
								>
								<span v-else-if="scope.row.status == 3">结算待审批</span>
								<span v-else-if="scope.row.status == 4" class="green"
									>结算已通过</span
								>
								<span v-else-if="scope.row.status == 5" class="red"
									>结算已驳回</span
								>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="申报时间" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.declareTime }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="操作"
							fixed="right"
							align="center"
							width="120px"
						>
							<template slot-scope="scope">
								<el-button
									size="mini"
									type="success"
									@click.native.prevent="passRow(scope.row)"
									v-if="scope.row.status == 0 || scope.row.status == 3"
									>通过</el-button
								>
								<el-button
									size="mini"
									type="info"
									@click.native.prevent="openReject(scope.row)"
									v-if="scope.row.status == 0 || scope.row.status == 3"
									>驳回</el-button
								>
								<el-button
									size="mini"
									type="primary"
									@click="openReason(scope.row)"
									v-if="scope.row.status == 2 || scope.row.status == 5"
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
					<el-drawer title="内容详情" :visible.sync="detailShow" size="80%">
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">项目信息</span>
							</div>
							<div class="card-item">
								<span>项目名称：</span>
								<span>{{ deDatas.name }}</span>
							</div>
							<div class="card-item">
								<span>项目业主：</span>
								<span>{{ deDatas.owner }}</span>
							</div>
							<div class="card-item">
								<span>项目地址：</span>
								<span>{{ deDatas.address }}</span>
							</div>
							<div class="card-item">
								<span>备案号：</span>
								<span>{{ deDatas.recordNumber }}</span>
							</div>
							<div class="card-item">
								<span>备案时间：</span>
								<span>{{ deDatas.recordTime }}</span>
							</div>
							<div class="card-item">
								<span>地理位置：</span>
								<span>{{ deDatas.location }}</span>
							</div>
							<div class="card-item">
								<span>项目类型：</span>
								<span>{{ deDatas.type }}</span>
							</div>
							<div class="card-item">
								<span>项目类别：</span>
								<span>{{ deDatas.category }}</span>
							</div>
							<div class="card-item">
								<span>方法学：</span>
								<span>{{ deDatas.methodology }}</span>
							</div>
							<div class="card-item">
								<span>计入期：</span>
								<span>{{ deDatas.creditingPeriod }}</span>
							</div>
							<div class="card-item">
								<span>预计减排量：</span>
								<span>{{ deDatas.preEmissionReduction }}</span>
							</div>
							<div class="card-item">
								<span>已审批减排量：</span>
								<span>{{ deDatas.certifiedEmissionReduction }}</span>
							</div>
							<div class="card-item">
								<span>预计结算时间：</span>
								<span>{{ deDatas.preBalanceTime }}</span>
							</div>
							<div class="card-item">
								<span>审定机构：</span>
								<span>{{ deDatas.accreditedInstitutions }}</span>
							</div>
							<div class="card-item">
								<span>审定报告：</span>
								<span>{{ deDatas.accreditedReport }}</span>
								<el-link
									target="_blank"
									:href="deDatas.accreditedReport"
									:underline="false"
								>
									下载没有
								</el-link>
							</div>
							<div class="card-item">
								<span>申报时间：</span>
								<span>{{ deDatas.formatDeclareTime }}</span>
							</div>
							<div class="card-item w100" v-if="deDatas.projectFileList">
								<span>其他相关文件：</span>
								<p
									v-for="(item, index) in deDatas.projectFileList"
									:key="index"
								>
									<span>{{ item.name }}</span>
									<el-link target="_blank" :href="item.url" :underline="false">
										下载
									</el-link>
								</p>
							</div>
						</el-card>
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">审批信息</span>
							</div>
							<div>
								<div class="card-item">
									<span>状态：</span>
									<span v-if="deDatas.status == 0">项目待审批</span>
									<span v-else-if="deDatas.status == 1" class="green"
										>项目已通过</span
									>
									<span v-else-if="deDatas.status == 2" class="red"
										>项目已驳回</span
									>
									<span v-else-if="deDatas.status == 3">结算待审批</span>
									<span v-else-if="deDatas.status == 4" class="green"
										>结算已通过</span
									>
									<span v-else-if="deDatas.status == 5" class="red"
										>结算已驳回</span
									>
								</div>
								<div
									v-if="deDatas.status == 0 || deDatas.status == 3"
									class="btn-box"
								>
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
								<div v-else>
									<div class="card-item" v-if="deDatas.status == 1">
										<span>审批碳汇项目数量：</span>
										<span>{{ deDatas.reject }}</span>
									</div>
									<div class="card-item">
										<span>审批时间：</span>
										<span>{{ deDatas.auditCreateTime }}</span>
									</div>
									<div class="card-item">
										<span>审批人员：</span>
										<span>{{ deDatas.userName }}</span>
									</div>
									<div
										class="card-item"
										v-if="deDatas.status == 2 || deDatas.status == 5"
									>
										<span>驳回原因：</span>
										<span>{{ deDatas.reject }}</span>
									</div>
								</div>
							</div>
						</el-card>
						<el-table
							:data="detableData"
							border
							style="width: 100%"
							key="detable"
							v-if="deDatas.trTradedOrderList"
						>
							<el-table-column
								:resizable="false"
								label="交易时间"
								align="center"
								fixed
							>
								<template slot-scope="scope">
									<span>{{ scope.row.createTime }}</span>
								</template>
							</el-table-column>
							<el-table-column
								:resizable="false"
								label="交易形式"
								align="center"
							>
								<template slot-scope="scope">
									<span v-if="scope.row.type == 0">挂牌成交单</span>
									<span v-if="scope.row.type == 1">协议转让成交单</span>
								</template>
							</el-table-column>
							<el-table-column
								:resizable="false"
								label="交易单价（元）"
								align="center"
							>
								<template slot-scope="scope">
									<span>{{ scope.row.price }}</span>
								</template>
							</el-table-column>
							<el-table-column
								:resizable="false"
								label="交易数量（吨）"
								align="center"
							>
								<template slot-scope="scope">
									<span>{{ scope.row.quantity }}</span>
								</template>
							</el-table-column>
							<el-table-column
								:resizable="false"
								label="交易总金额（元）"
								align="center"
							>
								<template slot-scope="scope">
									<span>{{ scope.row.totalAmount }}</span>
								</template>
							</el-table-column>
							<el-table-column
								:resizable="false"
								label="交易服务费（元）"
								align="center"
							>
								<template slot-scope="scope">
									<span>{{ scope.row.serviceFee }}</span>
								</template>
							</el-table-column>
							<el-table-column :resizable="false" label="状态" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.status == 0">待结算</span>
									<span v-else-if="scope.row.status == 1" class="green"
										>已结算</span
									>
								</template>
							</el-table-column>
						</el-table>
					</el-drawer>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetTanMana, RejectTanMana, GetTanManaData } from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppManageTan",

	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [
				{
					id: 1, //碳汇id
					reject: "reject", //处理原因
					userName: null,
					entName: "1", //申报企业
					entId: null,
					name: "项目名称", //项目名称
					address: "项目地址", //项目地址
					recordNumber: "备案号", //备案号
					recordTime: "2021-11-02 10:35:08", //备案时间
					owner: null,
					location: null,
					category: null,
					type: "项目类型",
					methodology: null,
					creditingPeriod: null,
					preBalanceTime: null,
					accreditedInstitutions: null,
					accreditedReport: null,
					preEmissionReduction: 100, //预计减排数量
					certifiedEmissionReduction: 100, //已审批减排数量
					lockedEmissionReduction: null,
					tradedEmissionReduction: null,
					remainEmissionReduction: null,
					status: 0, //状态: 0-项目待审批、1-项目已通过、2-项目已驳回、3-结算待审批、4-结算已通过、5-结算已驳回
					declareTime: "2021-11-02 10:35:08", //申报时间
					description: null,
					auditType: null,
					otherFile: null,
				},
			],
			detableData: [
				{
					id: 1, //碳汇id
					type: 1, //项目类型
					transferId: 1,
					projectId: 1, //项目id
					projectName: "1",
					projectAddress: "1",
					projectType: 11,
					sellEntId: 1,
					sellEntName: "1",
					buyEntId: 1,
					buyEntName: "1",
					sellSellingCode: "1",
					buySellingCode: "1",
					quantity: 1, //交易数量(吨)
					price: 1, //交易单价(元)
					totalAmount: 1, //交易总金额(元)
					serviceFee: 1, //交易服务费(元)
					status: 1, //状态:0-项目待审批、1-项目已通过、2-项目已驳回、3-结算待审批、4-结算已通过、5-结算已驳回
					createTime: "2021-11-02 10:35:00", //交易时间
				},
			],
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
			selectopt: [
				{ value: 0, label: "项目待审批" },
				{ value: 1, label: "项目已通过" },
				{ value: 2, label: "项目已驳回" },
				{ value: 3, label: "结算待审批" },
				{ value: 4, label: "结算已通过" },
				{ value: 5, label: "结算已驳回" },
			],
			searchpro: "",
			searchcom: "",
			detailrow: {},
			detailShow: false,
			deDatas: {
				id: 1, //碳汇id
				name: "项目名称", //项目名称
				address: "项目地址", //项目地址
				owner: "项目业主", //项目业主
				location: "地址位置", //地理位置
				category: "项目类别", //项目类别
				type: "项目类型", //项目类型
				recordNumber: "备案号", //备案号
				recordTime: "2021年11月02日", //备案时间
				methodology: "方法学", //方法学
				creditingPeriod: "计入期", //计入期
				accreditedInstitutions: "审定机构", //审定机构
				accreditedReport: "审定报告文件", //审定报告
				description: "项目描述",
				preEmissionReduction: 100, //预计减排量
				lockedEmissionReduction: null,
				tradedEmissionReduction: null,
				remainEmissionReduction: null,
				status: 0, //状态:0-项目待审批、1-项目已通过、2-项目已驳回、3-结算待审批、4-结算已通过、5-结算已驳回
				declareTime: "2021-11-02 10:35:08",
				formatDeclareTime: "2021年11月02日", //申报时间
				preBalanceTime: "2021-11-02", //预计结算时间
				certifiedEmissionReduction: 100, //已审批减排量
				projectFileList: [
					{
						id: 1, //碳汇id
						projectId: 1, //项目id
						name: "2", //项目名称
						url: "http://image.yuncaigou.net/newyuncaigou/images/1630658468_160.jpg", //文件地址
						type: 4, //项目类型
					},
				],
				trTradedOrderList: [
					{
						id: 1, //碳汇id
						type: 1, //项目类型
						transferId: 1,
					},
				],
				userId: null,
				userName: "1", //审批人员
				auditCreateTime: "2021-11-02 23:17:10", //审批时间
				reject: "reject", //驳回原因
			},
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
			GetTanMana(
				this.currentPage,
				this.searchcom,
				this.searchpro,
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
							let _stu = row.status == 0 ? "2" : "5";
							RejectTanMana(row.id, _stu, instance.inputValue)
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
			})
				.then(({ value }) => {
					this.getlist();
				})
				.catch(() => {});
		},
		// 打开详情
		openDetail(row) {
			this.detailrow = row;
			GetTanManaData(row.id).then((res) => {
				if (res.code == 0) {
					this.deDatas = res.data;
					this.detableData = this.deDatas.trTradedOrderList;
				} else {
					this.$message.error(res.msg);
				}
			});
			this.detailShow = true;
		},
		// 通过
		passRow(row) {
			this.$prompt(`申请项目数量：${row.preEmissionReduction}吨`, "通过", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				inputPlaceholder: "请输入通过数量",
				inputType: "number",
				beforeClose: (action, instance, done) => {
					if (action === "confirm") {
						if (!instance.inputValue) {
							this.$message.error("请输入纯数字的通过数量");
						} else {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = "";
							let _s = row.status == 0 ? 1 : 4;
							RejectTanMana(row.id, _s, instance.inputValue).then((res) => {
								instance.confirmButtonLoading = false;
								instance.confirmButtonText = "确定";
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
		// 驳回原因
		openReason(row) {
			this.$alert(`驳回原因：${row.reject}`, "驳回", {
				confirmButtonText: "确定",
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
	a {
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
	p {
		display: inline-block;
		font-size: 0;
	}
	.el-link {
		color: #1a8cff;
		cursor: pointer;
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
