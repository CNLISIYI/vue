<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="managedone" :asideIdx="['managedone']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>成交单管理</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="table-search">
						<el-select v-model="typeId" placeholder="请选择交易类型">
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
						<el-input
							placeholder="请输入项目名称"
							v-model="searchname"
							class="input-with-select"
						>
						</el-input>
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
								<span>{{ scope.row.projectName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="交易数量" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.quantity }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="交易金额" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.totalAmount }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="交易单价" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.price }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="交易类型"
							align="center"
							width="120px"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.type == '0'">挂牌成交单</span>
								<span v-else-if="scope.row.type == '1'">协议转让成交单</span>
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
						<el-table-column :resizable="false" label="卖方企业" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.sellEntName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="买方企业" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.buyEntName }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="状态"
							align="center"
							width="80px"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.status == 0">待结算</span>
								<span v-else-if="scope.row.status == 1" class="green"
									>已结算</span
								>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="交易时间" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.createTime }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="操作"
							fixed="right"
							align="center"
							width="100px"
						>
							<template slot-scope="scope">
								<el-button
									size="mini"
									type="warning"
									@click.native.prevent="openedit(scope.row)"
									v-if="scope.row.status == 0"
									>编辑</el-button
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
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetDoneMana, EditDoneData } from "../../api/apis";
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
			typeId: "",
			typeopt: [
				{ value: 0, label: "挂牌" },
				{ value: 1, label: "协议转让" },
			],
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
				{ value: 0, label: "待结算" },
				{ value: 1, label: "已结算" },
			],
			searchin: "",
			searchout: "",
			searchname: "",
			detailrow: {},
			ruleForm: { totalAmount: "", serviceFee: "" },
			editshow: false,
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
			GetDoneMana(
				this.currentPage,
				this.typeId,
				this.selectval,
				this.choosedate,
				this.searchname,
				this.searchin,
				this.searchout
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
		// 打开编辑
		openedit(row) {
			this.detailrow = row;
			this.ruleForm.totalAmount = row.totalAmount;
			this.ruleForm.serviceFee = row.serviceFee;
			this.editshow = true;
		},
		// 编辑保存
		editBtn() {
			this.ruleForm.id = this.detailrow.id;
			this.ruleForm.serviceFee = parseInt(this.ruleForm.serviceFee);
			this.ruleForm.totalAmount = parseInt(this.ruleForm.totalAmount);
			EditDoneData(this.ruleForm).then((res) => {
				if (res.code == 0) {
					this.$message.success("操作成功");
					this.getlist();
					this.editshow = false;
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
	width: 150px;
}
.el-input {
	width: 200px;
}

._h4 {
	font-size: 16px;
	font-weight: 600;
}
/deep/ .el-card__header {
	padding: 8px 20px;
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
