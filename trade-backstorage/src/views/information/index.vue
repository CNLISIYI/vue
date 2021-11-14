<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="information" :asideIdx="['information']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>行情信息录入</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="table-search">
						<div class="date-choose">
							<el-date-picker
								v-model="choosedate"
								align="right"
								type="date"
								placeholder="选择录入时间"
								:picker-options="pickerOptions"
								:clearable="false"
							>
							</el-date-picker>
						</div>
						<el-select v-model="selectval" placeholder="请选择所属交易所">
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
					<div class="table-operate">
						<el-button type="primary" @click="addInfos">录入信息</el-button>
						<el-button type="primary">导入</el-button>
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
							label="所属交易所"
							align="center"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.exchangeName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="开盘价" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.openingPrice }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="成交价" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.tradedPrice }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="成交量（吨）"
							align="center"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.tradedQuantity }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="日期" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.infoTime }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="录入时间" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.createTime }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="操作"
							fixed="right"
							align="center"
							width="180px"
						>
							<template slot-scope="scope">
								<el-button
									size="mini"
									type="warning"
									@click="openEditPop(scope.row)"
									>编辑</el-button
								>
								<el-button
									@click.native.prevent="deleteRow(scope.row)"
									type="danger"
									size="mini"
								>
									删除
								</el-button>
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
						:title="editid ? '编辑行情信息' : '新增行情信息'"
						:visible.sync="addinfoShow"
						size="50%"
					>
						<el-form
							:model="ruleForm"
							ref="form"
							label-width="100px"
							class="demo-ruleForm"
						>
							<el-form-item label="所属交易所" required>
								<el-input
									v-model="ruleForm.exchangeName"
									placeholder="请输入所属交易所"
								></el-input>
							</el-form-item>
							<el-form-item label="开盘价" required>
								<el-input
									v-model="ruleForm.openingPrice"
									placeholder="请输入开盘价"
									type="number"
								></el-input>
							</el-form-item>
							<el-form-item label="成交价" required>
								<el-input
									v-model="ruleForm.tradedPrice"
									placeholder="请输入成交价"
									type="number"
								></el-input>
							</el-form-item>
							<el-form-item label="成交量" required>
								<el-input
									v-model="ruleForm.tradedQuantity"
									placeholder="请输入成交量"
									type="number"
								></el-input>
							</el-form-item>
							<el-form-item label="日期" required>
								<el-date-picker
									v-model="ruleForm.infoTime"
									align="right"
									type="date"
									placeholder="请选择日期"
									:picker-options="pickerOptions"
									:clearable="false"
								>
								</el-date-picker>
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
	GetInfoData,
	PostInfoData,
	GetInfoDetail,
	DelInfo,
} from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppInformation",
	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [
				{
					id: 5099, //行情信息录入id
					exchangeCode: "GD", //交易所code
					exchangeName: "广东交易所", //交易所名称
					openingPrice: 36.06, //开盘价
					closingPrice: 36.41, //收盘价
					tradedQuantity: 55857, //成交量
					tradedPrice: 2032470, //成交总金额
					highestPrice: 36.5, //最高价
					lowestPrice: 33, //最低价
					infoTime: "2021-03-23", //时间
					createTime: "2021-11-11", //录入时间
				},
				{
					id: 5100, //行情信息录入id
					exchangeCode: "GD", //交易所code
					exchangeName: "广东交易所", //交易所名称
					openingPrice: 35.53, //开盘价
					closingPrice: 36.06, //收盘价
					tradedQuantity: 4977, //成交量
					tradedPrice: 177908, //成交总金额
					highestPrice: 36.15, //最高价
					lowestPrice: 32.55, //最低价
					infoTime: "2021-03-22", //时间
					createTime: "2021-11-11", //录入时间
				},
			],
			addinfoShow: false, //新增弹窗
			ruleForm: {
				id: 18664,
				exchangeCode: "OM", //交易所code
				exchangeName: "11111111", //交易所名称
				openingPrice: 11.11, //开盘价
				closingPrice: 11.11, //收盘价
				tradedQuantity: 55857, //成交量
				tradedPrice: 2032470, //成交总金额
				highestPrice: 36.5, //最高价
				lowestPrice: 33, //最低价
				infoTime: "2021-11-12", //时间
				createTime: "2021-11-11", //录入时间
			},
			editid: 0,
			uploading: false,
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
				{ value: 0, label: "欧盟交易所" },
				{ value: 1, label: "已通过" },
			],
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
			GetInfoData(this.currentPage)
				.then((res) => {
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
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 新增保存
		addSubmit() {
			if (!this.ruleForm.exchangeName) {
				this.$message.error("请输入交易所名称");
			} else if (!this.ruleForm.infoTime) {
				this.$message.error("请选择日期");
			} else if (
				!this.ruleForm.openingPrice ||
				!this.ruleForm.tradedPrice ||
				!this.ruleForm.tradedQuantity
			) {
				this.$message.error("请输入数字格式的价格和成交量");
			} else {
				this.uploading = true;
				this.ruleForm.id = this.ruleForm.id ? this.ruleForm.id : "";
				PostInfoData(this.ruleForm).then((res) => {
					if (res.code == 0) {
						this.uploading = false;
						this.$message.success("保存成功");
						this.ruleForm = {};
						this.addinfoShow = false;
						this.getlist();
					} else {
						this.uploading = false;
						this.$message.error(res.msg);
					}
				});
			}
		},
		// 编辑
		openEditPop(row) {
			this.addinfoShow = true;
			this.editid = row.id;
			GetInfoDetail(row.id).then((res) => {
				if (res.code == 0) {
					this.ruleForm = res.data;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 新增
		addInfos() {
			this.addinfoShow = true;
			this.ruleForm = {};
			this.editid = ""
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getlist();
		},
		// 删除
		deleteRow(row) {
			this.$confirm("确定删除该行情信息么？")
				.then(() => {
					DelInfo(row.id).then((res) => {
						if (res.code == 0) {
							this.$message.success("删除成功");
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
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-button--mini,
.el-button--mini.is-round {
	padding: 6px;
}
.table-operate {
	margin: 0 0 10px;
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
/deep/ .el-select,
.el-input {
	width: 220px;
}
/deep/.el-table .cell {
	span {
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>
