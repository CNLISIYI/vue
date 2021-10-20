<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="populardata" :asideIdx="['2']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card" :value="tabnum" @tab-click="handleClick">
						<el-tab-pane name="1">
							<!-- 标签标题 -->
							<span slot="label"> 推广数据 </span>
							<!-- 页面内容 -->
							<div class="date-choose">
								<el-radio-group v-model="dateradio" @change="chooseRadio">
									<!-- <el-radio-button label="0">今日</el-radio-button> -->
									<el-radio-button label="1">昨日</el-radio-button>
									<el-radio-button label="7">近7天</el-radio-button>
									<el-radio-button label="30">近30天</el-radio-button>
								</el-radio-group>
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
								<p class="input-txt">最多选择31天</p>
							</div>
							<!-- 询盘 -->
							<ul class="table-box">
								<li>
									<p>消费</p>
									<span>{{ formData.cons_money }}元</span>
								</li>
								<li>
									<p>展示</p>
									<span>{{ formData.view }}次</span>
								</li>
								<li>
									<p>点击</p>
									<span>{{ formData.click }}次</span>
								</li>
								<li>
									<p>点击转化</p>
									<span
										>{{
											formData.click
												? ((formData.view / formData.click) * 100).toFixed(2)
												: 0
										}}%</span
									>
								</li>
								<li>
									<p>均价消费</p>
									<span
										>{{
											formData.view
												? ((formData.cons_moeny / formData.view) * 100).toFixed(
														2
												  )
												: 0
										}}元</span
									>
								</li>
							</ul>
							<div class="chart-box" v-loading="loading">
								<Appecharts
									:domid="'echart-show'"
									:option="optionShow"
									width="100%"
								></Appecharts>
							</div>
						</el-tab-pane>
						<el-tab-pane name="2">
							<!-- 标签标题 -->
							<span slot="label"> 扣费记录 </span>
							<el-table
								:data="tableData"
								border
								style="width: 100%"
								v-loading="tableload"
							>
								<el-table-column :resizable="false" label="金额" align="center">
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="扣费时间"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.updated_at }}</span>
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
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetSpreadFee, GetPopularInfo } from "../../api/apis";
import { mapState } from "vuex";
let Echarts = require("echarts/lib/echarts");
export default {
	name: "AppPopularData",
	data() {
		var _minTime = null;
		var _maxTime = null;
		return {
			tabnum: "1", //标签页
			choosedate: "", //选择日期
			dateradio: "1", //日期按钮
			pickerOptions: {
				onPick(time) {
					if (!time.maxDate) {
						let timeRange = 31 * 24 * 60 * 60 * 1000; // 31天
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
			formData: {
				cons_moeny: 0,
				click: 0,
				view: 0,
			}, //询盘数据
			loading: false, //图表loading
			tableload: false, //表格loading
			tableData: [],
			currentPage: 1, //页码
			total: 0, //数量
			optionShow: {
				title: {
					text: "推广统计数据",
					x: "center",
				},
				tooltip: {
					show: true,
					trigger: "axis",
				},
				legend: {
					right: "10%",
					data: ["消费", "点击", "展示"],
				},
				xAxis: {
					type: "category",
					data: [],
					boundaryGap: false,
					splitLine: {
						show: true,
						lineStyle: {
							color: ["#F6F6F6"],
							width: 1,
							type: "solid",
						},
					},
					axisLine: {
						lineStyle: {
							color: ["#F6F6F6"],
							width: 1,
							type: "solid",
						},
					},
					axisLabel: {
						show: true,
						textStyle: {
							color: "#90A1B8",
						},
					},
				},
				yAxis: [
					{
						type: "value",
						name: "",
					},
					{
						type: "value",
						name: "",
					},
					{
						type: "value",
						name: "",
					},
				],
				series: [
					{
						name: "消费",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "点击",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "展示",
						data: [],
						symbol: "none",
						type: "line",
					},
				],
			},
		};
	},
	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},
	destroyed() {
		this.optionShow = {};
	},
	mounted() {
		this.choosedate = [
			this.$tools.pastDate(1),
			this.$tools.StoYMDDate(new Date()),
		];
		this.getChartInfo();
	},

	methods: {
		handleClick(tab) {
			this.tabnum = tab.name;
			if (tab.name == "2") {
				this.getTabledata(1);
			}
		},
		// 选择radio
		chooseRadio(label) {
			// if (label == "0") {
			// 	this.choosedate = [
			// 		this.$tools.StoYMDDate(new Date()),
			// 		this.$tools.StoYMDDate(new Date()),
			// 	];
			// } else {
			this.choosedate = [
				this.$tools.pastDate(parseInt(label)),
				this.$tools.pastDate(0),
			];
			// }
			this.getChartInfo(
				this.$tools.pastDate(parseInt(label)),
				this.$tools.pastDate(0)
			);
		},
		// 选择日期
		handleChooseDate() {
			this.getChartInfo();
		},
		// 设置图表数据
		setData(data) {
			this.optionShow.xAxis.data = data.dates;
			this.optionShow.series[0].data = data.y_cons;
			this.optionShow.series[1].data = data.y_clicks;
			this.optionShow.series[2].data = data.y_views;
			if (document.getElementById("echart-show")) {
				this.loading = false;
				Echarts.init(document.getElementById("echart-show")).setOption(
					this.optionShow
				);
			}
		},
		// 获取推广数据
		getChartInfo(start, end) {
			this.loading = true;
			let _start = start ? start : this.$tools.pastDate(1),
				_end = end ? end : this.$tools.StoYMDDate(new Date());
			GetPopularInfo(_start, _end).then((res) => {
				// GetPopularInfo("2021-05-18", "2021-05-20").then((res) => {
				if (res.code == 0) {
					if (res.body && res.body.dates) {
						this.setData(res.body);
						this.formData.cons_money = res.body.cons_money;
						this.formData.click = res.body.click;
						this.formData.view = res.body.view;
					} else {
						this.loading = false;
						this.$message.error("暂无数据");
					}
				} else {
					this.loading = false;
					this.$message.error(res.msg);
				}
			});
		},
		// 获取消费记录
		getTabledata(page) {
			this.tableload = true;
			let _page = page ? page : 1;
			GetSpreadFee(_page).then((res) => {
				this.tableload = false;
				if (res.code == 0) {
					if (res.body) {
						this.tableData = res.body.list;
						this.total = res.body.page.count;
					} else {
						this.$message.error("暂无数据");
					}
				} else {
					this.tableload = false;
					this.$message.error(res.msg);
				}
			});
		},
		// 翻页
		handleChange(val) {
			this.getTabledata(val);
		},
	},
};
</script>

<style lang="scss" scoped>
.score-ul {
	display: flex;
	flex-flow: nowrap;
	margin-bottom: 20px;
	li {
		flex: 1;
	}
	li + li {
		margin-left: 10px;
	}
	p {
		font-size: 14px;
		line-height: 24px;
		color: #333;
	}
	p:first-child {
		font-weight: 600;
	}
	.on {
		.el-card {
			background: #ecf5ff;
			border-color: #b3d8ff;
		}
		/deep/ .el-card__header {
			border-bottom: 1px solid #b3d8ff;
		}
	}
}
.el-card__header {
	span {
		color: #1a8cff;
		font-size: 14px;
		font-weight: 600;
	}
}
/deep/ .el-card__header {
	padding: 12px 20px;
}
/deep/ .el-card__body {
	padding: 12px 20px;
}
/deep/ .el-table td,
.el-table th {
	padding: 10px 0px;
}
/deep/ .el-table th {
	background-color: #fafafa;
}

.date-choose {
	margin: 20px 0 40px;
	font-size: 0;
	.el-date-editor {
		margin-left: 20px;
	}
	.el-radio-group {
		vertical-align: middle;
	}
	.el-date-editor {
		vertical-align: middle;
	}
}
.chart-box {
	height: 400px;
}

.input-txt {
	display: inline-block;
	vertical-align: middle;
	margin-left: 5px;
	font-size: 14px;
	color: #909399;
	margin-right: 20px;
}
</style>
