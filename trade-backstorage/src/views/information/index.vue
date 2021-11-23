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
								:key="item.id"
								:label="item.name"
								:value="item.id"
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
						<el-button type="primary" @click="addInfos"  v-if="$tools.isMenus(21)">录入信息</el-button>
						<el-button type="primary" @click="downModel" v-if="$tools.isMenus(22)">下载模版</el-button>
						<div class="el-button el-button--primary" v-if="$tools.isMenus(22)">
							<el-upload
								action=""
								:on-change="handleChange"
								:http-request="uploadFile"
								accept=".xlsx, .xls"
								ref="upload"
								:show-file-list="false"
							>
								<span>导入</span>
							</el-upload>
						</div>
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
						<el-table-column :resizable="false" label="收盘价" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.closingPrice }}</span>
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
						<el-table-column :resizable="false" label="最高价" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.highestPrice }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="最低价" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.lowestPrice }}</span>
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
									v-if="$tools.isMenus(23)"
									>编辑</el-button
								>
								<el-button
									@click.native.prevent="deleteRow(scope.row)"
									type="danger"
									size="mini"
									v-if="$tools.isMenus(24)"
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
								<el-select
									v-model="ruleForm.exchangeCode"
									placeholder="请选择所属交易所"
									@change="handleselect"
								>
									<el-option
										v-for="item in selectopt"
										:key="item.id"
										:label="item.name"
										:value="item.id"
									>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="开盘价" required>
								<el-input
									v-model="ruleForm.openingPrice"
									placeholder="请输入开盘价"
									type="number"
								></el-input>
							</el-form-item>
							<el-form-item label="收盘价" required>
								<el-input
									v-model="ruleForm.closingPrice"
									placeholder="请输入收盘价"
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
							<el-form-item label="成交价" required>
								<el-input
									v-model="ruleForm.tradedPrice"
									placeholder="请输入成交价"
									type="number"
								></el-input>
							</el-form-item>
							<el-form-item label="最高价" required>
								<el-input
									v-model="ruleForm.highestPrice"
									placeholder="请输入最高价"
									type="number"
								></el-input>
							</el-form-item>
							<el-form-item label="最低价" required>
								<el-input
									v-model="ruleForm.lowestPrice"
									placeholder="请输入最低价"
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
	GetMarket,
	GetexlModel,
} from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppInformation",
	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [],
			addinfoShow: false, //新增弹窗
			ruleForm: {},
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
			selectopt: [],
		};
	},
	created() {},
	computed: {
		...mapState(["userData"]),
	},
	watch: {},
	mounted() {
		this.getlist();
		this.getmarketlist();
	},

	methods: {
		handleselect(value) {
			this.selectopt.map((item) => {
				if (value == item.id) {
					this.ruleForm.exchangeName = item.name;
				}
			});
		},
		// 下载模版
		downModel() {
			this.$axios
				.post(
					"admin-center/trade/marketInfo/exportTemplate",
					{},
					{
						headers: {
							"Content-Type": "multiple/form-data",
							Accept: "*/*",
							authorization: "Bearer " + this.$cookies.get("authorization"),
						},
						responseType: "arraybuffer",
					}
				)
				.then((res) => {
					this.$tools.export_excel_file(res.data);
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
		// 获取交易所
		getmarketlist() {
			GetMarket()
				.then((res) => {
					if (res.code == 0) {
						if (res.data) {
							this.selectopt = res.data.records;
						} else {
							this.$message.error("暂无数据");
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
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
			if (!this.ruleForm.exchangeCode) {
				this.$message.error("请选择交易所");
			} else if (!this.ruleForm.infoTime) {
				this.$message.error("请选择日期");
			} else if (
				!this.ruleForm.openingPrice ||
				!this.ruleForm.tradedPrice ||
				!this.ruleForm.closingPrice ||
				!this.ruleForm.tradedQuantity ||
				!this.ruleForm.highestPrice ||
				!this.ruleForm.lowestPrice
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
			this.editid = "";
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
		handleChange(file) {},
		// 导入
		uploadFile(param) {
			let formData = new FormData();
			formData.append("file", param.file);
			this.$axios
				.post("admin-center/trade/marketInfo/importExcel", formData, {
					headers: {
						"Content-Type": "multiple/form-data",
						Accept: "*/*",
						authorization: "Bearer " + this.$cookies.get("authorization"),
					},
				})
				.then((res) => {
					if (res.data.code == 0) {
						this.$message.success("导入成功");
						this.getlist();
					} else {
						this.$message.error(res.data.msg);
					}
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
/deep/ .el-upload {
	span {
		color: #fff;
	}
}
</style>
