<template>
	<div>
		<div class="table-operate" v-if="pagename == 'keywords'">
			<el-button
				type="primary"
				v-if="tableData.length > 0"
				@click="exportTable"
				v-loading="exportload"
				element-loading-spinner="el-icon-loading"
				>全部导出</el-button
			>
		</div>
		<div class="date-choose" v-if="pagename == 'keywords'">
			<span class="el-form-item__label">选择日期范围</span>
			<el-date-picker
				v-model="choosedate"
				type="daterange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:picker-options="pickerOptions"
				@change="handleChooseDate"
				:clearable="false"
				format="yyyy年MM月dd日"
				value-format="yyyy-MM-dd"
				:editable="false"
			>
			</el-date-picker>
		</div>
		<el-table
			:data="tableData"
			border
			style="width: 100%"
			v-loading="loading"
			:default-sort="{ prop: 'show_cnt', order: 'ascending' }"
		>
			<el-table-column
				:resizable="false"
				fixed
				label="关键词"
				align="center"
				v-if="pagename == 'keywords'"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.keywords }}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				fixed
				label="标题"
				v-else
			>
				<template slot-scope="scope">
					<a @click="$tools.openProduct(scope.row.sku.id)">
						<span>{{ scope.row.sku.title }}</span>
					</a>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="平台"
				width="160"
				align="center"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.info_type }}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="展示次数"
				width="160"
				align="center"
				sortable
				prop="show_cnt"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.show_cnt }}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="点击次数"
				width="160"
				align="center"
				sortable
				prop="click_cnt"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.click_cnt }}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="数据日期"
				width="200"
				align="center"
				v-if="pagename == 'keywords'"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.info_date }}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="创建时间"
				width="200"
				align="center"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.create_time }}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@current-change="handleChange"
			:current-page="currentPage"
			:page-size="20"
			background
			layout="total, prev, pager, next, jumper"
			:total="total"
			:hide-on-single-page="true"
		>
		</el-pagination>
	</div>
</template>

<script>
import { GetKeywordList } from "../api/apis";
export default {
	name: "AppKeyTabel",
	data() {
		var _minTime = null;
		var _maxTime = null;
		return {
			exportload: false, //导出loading
			choosedate: [],
			pickerOptions: {
				onPick(time) {
					if (!time.maxDate) {
						let timeRange = 7 * 24 * 60 * 60 * 1000; // 7天
						_minTime = time.minDate.getTime() - timeRange; // 最小时间
						_maxTime = time.minDate.getTime() + timeRange; // 最大时间
					} else {
						_minTime = _maxTime = null;
					}
				},
				disabledDate(time) {
					if (_minTime && _maxTime) {
						return (
							time.getTime() < _minTime ||
							time.getTime() > _maxTime ||
							time.getTime() > Date.now() - 24 * 60 * 60 * 1000
						);
					} else {
						return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
					}
				},
			},
		};
	},
	props: {
		tableData: {
			type: Array,
			default: () => [],
		},
		pagename: {
			type: String,
			default: "",
		},
		total: {
			type: Number,
			default: 0,
		},
		currentPage: {
			type: Number,
			default: 1,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		this.choosedate = [this.$tools.pastDate(1), this.$tools.pastDate(1)];
	},
	computed: {},
	methods: {
		// 选择日期
		handleChooseDate() {
			this.$emit("handleChooseDate", this.choosedate);
		},
		// 翻页
		handleChange(val) {
			this.$emit("handleChange", val);
		},
		// 导出
		exportTable() {
			this.exportload = true;
			if (this.total) {
				GetKeywordList(this.choosedate[0], this.choosedate[1], 1, 99999).then(
					(res) => {
						this.exportload = false;
						if (res.code == 0) {
							let _data = [];
							res.body.list.map((item) => {
								let _item = {
									关键词: item.keywords,
									平台: item.info_type,
									展示次数: item.show_cnt,
									点击次数: item.click_cnt,
									数据日期: item.info_date,
									创建时间: item.create_time,
								};
								_data.push(_item);
							});
							this.$tools.exportCSV(_data, `关键词.csv`);
						} else {
							this.$message.error(res.msg);
						}
					}
				);
			} else {
				this.exportload = false;
				this.$message.error("没有可以导出的数据");
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.date-choose {
	float: right;
	margin-bottom: 10px;
}
/deep/ .el-form-item__label {
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
</style>
