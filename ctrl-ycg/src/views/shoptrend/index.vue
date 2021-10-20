<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="shoptrend" :asideIdx="['2']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 询盘及流量趋势变化 </span>
							<!-- 页面内容 -->
							<div class="date-choose">
								<el-radio-group v-model="dateradio" @change="chooseRadio">
									<el-radio-button label="7">近7天</el-radio-button>
									<el-radio-button label="15">近15天</el-radio-button>
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
									<p>询盘量</p>
									<span>{{ formData.inquiry_all }}</span>
								</li>
								<li>
									<p>IM询盘量</p>
									<span>{{ formData.inquiry_im }}</span>
								</li>
								<li>
									<p>电话按钮询盘量</p>
									<span>{{ formData.inquiry_call }}</span>
								</li>
							</ul>
							<div class="chart-box" v-loading="loading">
								<Appecharts
									:domid="'echart-all'"
									:option="optionShowxp"
									width="100%"
								></Appecharts>
							</div>
							<!-- 流量 -->
							<div class="chart-box" v-loading="loading">
								<Appecharts
									:domid="'echart-show'"
									:option="optionShowll"
									width="50%"
								></Appecharts>
								<Appecharts
									:domid="'echart-click'"
									:option="optionClick"
									width="50%"
								></Appecharts>
							</div>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetShopChart } from "../../api/apis";
import { mapState } from "vuex";
let Echarts = require("echarts/lib/echarts");
export default {
	name: "AppShopTrend",
	data() {
		var _minTime = null;
		var _maxTime = null;
		return {
			choosedate: "", //选择日期
			dateradio: "7", //日期按钮
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
				inquiry_all: 0,
				inquiry_im: 0,
				inquiry_call: 0,
			}, //询盘数据
			loading: false,
			optionShowll: {
				title: {
					text: "搜索展示趋势",
				},
				tooltip: {
					show: true,
					trigger: "axis",
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
				],
				series: [
					{
						name: "展示量",
						data: [],
						symbol: "none",
						type: "line",
					},
				],
			},
			optionClick: {
				title: {
					text: "搜索点击趋势",
					x: "center",
				},
				tooltip: {
					show: true,
					trigger: "axis",
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
				],
				series: [
					{
						name: "点击量",
						data: [],
						symbol: "none",
						type: "line",
					},
				],
			},
			optionShowxp: {
				title: {
					text: "询盘数据趋势变化",
				},
				tooltip: {
					show: true,
					trigger: "axis",
				},
				legend: {
					right: "10%",
					data: ["总询盘", "IM询盘", "电话按钮询盘"],
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
						name: "总询盘",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "IM询盘",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "电话按钮询盘",
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
		this.optionShowll = {};
		this.optionClick = {};
		this.optionShowxp = {};
	},
	mounted() {
		this.choosedate = [this.$tools.pastDate(8), this.$tools.pastDate(1)];
		this.getChartInfo();
	},

	methods: {
		// 选择radio
		chooseRadio(label) {
			this.getChartInfo(
				this.$tools.pastDate(parseInt(label) + 1),
				this.$tools.pastDate(1)
			);
		},
		// 选择日期
		handleChooseDate() {
			this.getChartInfo();
		},
		// 设置图表数据
		setData(data) {
			this.optionShowll.xAxis.data = data.dates;
			this.optionClick.xAxis.data = data.dates;
			this.optionShowxp.xAxis.data = data.dates;
			this.optionShowll.series[0].data = data.y_show_value;
			this.optionClick.series[0].data = data.y_click_value;
			this.optionShowxp.series[0].data = data.y_inquiry_value;
			this.optionShowxp.series[1].data = data.y_im_click_value;
			this.optionShowxp.series[2].data = data.y_call_click_value;
			if (document.getElementById("echart-show")) {
				this.loading = false;
				Echarts.init(document.getElementById("echart-show")).setOption(
					this.optionShowll
				);
				Echarts.init(document.getElementById("echart-click")).setOption(
					this.optionClick
				);
				Echarts.init(document.getElementById("echart-all")).setOption(
					this.optionShowxp
				);
			}
		},
		getChartInfo(start, end) {
			this.loading = true;
			let _start = start ? start : this.$tools.pastDate(8),
				_end = end ? end : this.$tools.pastDate(1);
			GetShopChart(_start, _end).then((res) => {
				// GetShopChart("2020-10-04", "2020-10-10").then((res) => {
				if (res.code == 0) {
					if (res.body) {
						this.setData(res.body);
						this.formData.inquiry_all = res.body.inquiry_all;
						this.formData.inquiry_im = res.body.inquiry_im;
						this.formData.inquiry_call = res.body.inquiry_call;
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
