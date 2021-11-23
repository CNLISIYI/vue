<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="/" :asideIdx="['/']"></Appaside>
			<el-container>
				<el-main>
					<h4 class="_h4">数据统计概览</h4>
					<div class="tips">
						<ul>
							<li v-loading="loading">
								<a>{{ topdata.userQty }}</a>
								<p>用户总数量</p>
							</li>
							<li v-loading="loading">
								<a>{{ topdata.approvedUserQty }}</a>
								<p>已审核用户</p>
							</li>
							<li v-loading="loading">
								<a>{{ topdata.agreementQty }}</a>
								<p>协议成交单总数量</p>
							</li>
							<li v-loading="loading">
								<a>{{ topdata.agreementMoney }}</a>
								<p>协议成交总金额</p>
							</li>
							<li v-loading="loading">
								<a>{{ topdata.listingQty }}</a>
								<p>挂牌成交单总数量</p>
							</li>
							<li v-loading="loading">
								<a>{{ topdata.listingMoney }}</a>
								<p>挂牌成交总金额</p>
							</li>
							<li v-loading="loading">
								<a>{{ topdata.declareQty }}</a>
								<p>项目申报单总数量</p>
							</li>
							<li v-loading="loading">
								<a>{{ topdata.gertQty }}</a>
								<p>项目减排总数量</p>
							</li>
						</ul>
					</div>
					<h4 class="_h4 mt20">待办事项</h4>
					<div class="tips">
						<ul>
							<li v-loading="loading">
								<a>{{ datas.underReview }}</a>
								<p>待审批用户</p>
							</li>
							<li v-loading="loading">
								<a>{{ datas.carbonRemitQty }}</a>
								<p>待审批碳汇项目</p>
							</li>
							<li v-loading="loading">
								<a>{{ datas.agreementApproval }}</a>
								<p>待审批协议转让</p>
							</li>
							<li v-loading="loading">
								<a>{{ datas.settlementApproval }}</a>
								<p>待审批项目结算</p>
							</li>
						</ul>
					</div>
					<h4 class="_h4 mt20">行情信息</h4>
					<div class="date-choose">
						<el-radio-group v-model="chartradio" @change="chooseChart">
							<el-radio-button label="1">本交所行情</el-radio-button>
							<el-radio-button label="2">国内行情</el-radio-button>
							<el-radio-button label="3">国外行情</el-radio-button>
						</el-radio-group>
					</div>
					<div class="echart-box clearfix">
						<div class="little-box">
							<p class="text" v-if="chartradio == '1'">
								<span>今日开盘价：{{ chartnums.todayOpeningPrice }}元/吨</span>
								<span>涨跌幅：{{ chartnums.riseAndFallRange }}</span>
								<span>当前价：{{ chartnums.currentPrice }}元/吨</span>
							</p>
							<el-radio-group
								v-model="timeradio"
								@change="choosetimeRadio"
								v-if="chartradio == '1'"
							>
								<el-radio-button label="0">日</el-radio-button>
								<el-radio-button label="1">时</el-radio-button>
								<el-radio-button label="2">分</el-radio-button>
							</el-radio-group>
						</div>
						<div v-loading="showloading">
							<Appecharts
								:domid="'echart-show'"
								:option="optionShow"
								width="100%"
							></Appecharts>
						</div>
					</div>
					<div class="echart-box clearfix">
						<h4 class="_h4 mt20">成交额信息</h4>
						<div class="date-choose">
							<el-radio-group v-model="dateradio" @change="chooseRadio">
								<el-radio-button label="1">近一周</el-radio-button>
								<el-radio-button label="2">1个月内</el-radio-button>
								<el-radio-button label="3">90天内</el-radio-button>
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
						</div>
						<div v-loading="feeloading">
							<Appecharts
								:domid="'echart-fee'"
								:option="optionFee"
								width="100%"
							></Appecharts>
						</div>
					</div>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	GetHomeData,
	getFeeChart,
	getMineChart,
	getOutChart,
} from "../../api/apis";
let Echarts = require("echarts/lib/echarts");
export default {
	name: "AppHome",
	data() {
		var _minTime = null;
		var _maxTime = null;
		return {
			userinfo: {}, //用户账户
			loading: false,
			feeloading: false,
			showloading: false,
			datas: {},
			topdata: {},
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
			chartradio: "1",
			timeradio: "0",
			optionShow: {
				title: {
					text: "行情信息统计图",
					x: "center",
				},
				tooltip: {
					show: true,
					trigger: "axis",
				},
				grid: {
					show: false,
					top: "60",
					bottom: "60",
					right: "60",
					left: "60",
				},
				legend: {
					show: true,
					selected: {},
					bottom: 10,
					left: 50,
					textStyle: {
						color: "#666",
						fontSize: 12,
					},
					itemGap: 20,
					data: [],
					inactiveColor: "#ccc",
				},
				xAxis: {
					type: "category",
					data: [],
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
					axisPointer: {
						type: "shadow",
					},
				},
				yAxis: [
					{
						type: "value",
						name: "成交价",
						show: true,
						interval: 100,
					},
					{
						type: "value",
						name: "成交量",
						min: 0,
						interval: 20,
					},
				],
				series: [
					{
						name: "北京交易所",
						data: [],
						symbol: "none",
						type: "bar",
						barWidth: "20%",
						stack: "成交量",
					},
					{
						name: "北京交易所",
						data: [],
						symbol: "none",
						yAxisIndex: 1,
						type: "line",
						symbolSize: 10,
						itemStyle: {
							normal: { color: "#949f82" },
						},
					},
				],
			},
			optionFee: {
				title: {
					text: "成交额统计图",
					x: "center",
				},
				tooltip: {
					show: true,
					trigger: "axis",
				},
				grid: {
					show: false,
					top: "60",
					bottom: "60",
					right: "60",
					left: "60",
				},
				xAxis: {
					type: "category",
					data: [],
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
						name: "成交额", // 序列名称
						type: "bar", // 类型
						legendHoverLink: true, // 是否启用图列 hover 时的联动高亮
						label: {
							show: false,
						},
						barWidth: 20, // 柱形的宽度
						barCategoryGap: "20%", // 柱形的间距
						data: [],
					},
				],
			},
			chartnums: {},
			resdata: [
				{
					name: "北京交易所",
					value: [
						{
							id: 1, //id
							exchangeCode: "BJ", //交易所code
							exchangeName: "北京交易所", //交易所名称
							openingPrice: 40, //开盘价
							tradedPrice: 14, //交易价
							tradedQuantity: 240, //交易量(吨)
							infoTime: "2021-11-02 00:00:00", //时间
							createTime: "2021-11-04 10:57:10", //录入时间
						},
						{
							id: 2, //id
							exchangeCode: "BJ", //交易所code
							exchangeName: "北京交易所", //交易所名称
							openingPrice: 40, //开盘价
							tradedPrice: 13.69, //交易价
							tradedQuantity: 230, //交易量(吨)
							infoTime: "2021-11-03 00:00:00", //时间
							createTime: "2021-11-04 11:00:28", //录入时间
						},
						{
							id: 3, //id
							exchangeCode: "BJ", //交易所code
							exchangeName: "北京交易所", //交易所名称
							openingPrice: 40, //开盘价
							tradedPrice: 16.95, //交易价
							tradedQuantity: 260, //交易量(吨)
							infoTime: "2021-11-01 00:00:00", //时间
							createTime: "2021-11-04 11:01:11", //录入时间
						},
					],
				},
				{
					name: "欧盟交易所",
					value: [
						{
							id: 4, //id
							exchangeCode: "EU", //交易所code
							exchangeName: "欧盟交易所", //交易所名称
							openingPrice: 60, //开盘价
							tradedPrice: 22.12, //交易价
							tradedQuantity: 369, //交易量(吨)
							infoTime: "2021-11-01 00:00:00", //时间
							createTime: "2021-11-04 11:02:51", //录入时间
						},
						{
							id: 5, //id
							exchangeCode: "EU", //交易所code
							exchangeName: "欧盟交易所", //交易所名称
							openingPrice: 60, //开盘价
							tradedPrice: 32.98, //交易价
							tradedQuantity: 442, //交易量(吨)
							infoTime: "2021-11-03 00:00:00", //时间
							createTime: "2021-11-04 11:03:22", //录入时间
						},
					],
				},
				{
					name: "武汉交易所",
					value: [],
				},
				{
					name: "长沙交易所",
					value: [],
				},
				{
					name: "青岛交易所",
					value: [],
				},
				{
					name: "河北交易所",
					value: [],
				},
				{
					name: "上海交易所",
					value: [],
				},
				{
					name: "天津交易所",
					value: [],
				},
				{
					name: "湖南交易所",
					value: [],
				},
				{
					name: "辽宁交易所",
					value: [],
				},
			], //返回数据
			colorlist: [
				"#FF8849",
				"#3FBB49",
				"#DDA0DD",
				"#87CEFA",
				"#CD5C5C",
				"#9669E9",
				"#FEB85C",
				"#FF8291",
				"#45B780",
			],
		};
	},

	created() {},
	mounted() {
		this.getDatas();
		this.getChartInfo();
		this.getMineInfo();
		// this.getOutInfo();
	},
	computed: {},

	methods: {
		getDatas() {
			this.loading = true;
			GetHomeData()
				.then((res) => {
					this.loading = false;
					this.datas = res.data.toDoList;
					this.topdata = res.data.dataStatistics;
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		chooseRadio() {
			this.choosedate = "";
			this.getChartInfo();
		},
		choosetimeRadio() {
			this.getMineInfo();
		},
		chooseChart() {
			if (this.chartradio == "1") {
				this.getMineInfo();
			} else {
				this.getOutInfo();
			}
		},
		handleChooseDate() {
			this.dateradio = "0";
			this.getChartInfo(this.choosedate[0], this.choosedate[1]);
		},
		// 获取本行
		getMineInfo() {
			this.showloading = true;
			getMineChart(this.timeradio)
				.then((res) => {
					this.showloading = false;
					if (res.code == 0) {
						this.chartnums = res.data;
						if (res.data.entMarketInfo) {
							this.setMineData(res.data.entMarketInfo);
						} else {
							this.$message.error("暂无数据");
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.showloading = false;
					this.$message.error(err);
				});
		},
		// 获取其他行
		getOutInfo() {
			this.showloading = true;
			let _flag = this.chartradio == "2" ? true : false;
			// this.setOutData(this.resdata);
			getOutChart(_flag)
				.then((res) => {
					this.showloading = false;
					if (res.code == 0) {
						if (res.data) {
							this.setOutData(res.data);
						} else {
							this.$message.error("暂无数据");
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.showloading = false;
					this.$message.error(err);
				});
		},
		// 成交额
		getChartInfo(start, end) {
			this.feeloading = true;
			let _start = start ? start : "",
				_end = end ? end : "";
			getFeeChart(this.dateradio, _start, _end)
				.then((res) => {
					this.feeloading = false;
					if (res.code == 0) {
						if (res.data) {
							this.setData(res.data);
						} else {
							this.$message.error("暂无数据");
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.feeloading = false;
					this.$message.error(err);
				});
		},
		// 设置成交额数据
		setData(data) {
			let dates = [],
				fees = [];
			data.map((item) => {
				dates.push(item.dealTime);
				fees.push(item.totalAmount);
			});
			this.optionFee.xAxis.data = dates;
			this.optionFee.series[0].data = fees;
			if (document.getElementById("echart-fee")) {
				this.feeloading = false;
				Echarts.init(document.getElementById("echart-fee")).setOption(
					this.optionFee
				);
			}
		},
		// 设置本行数据
		setMineData(data) {
			let dates = [],
				price = [],
				counts = [];
			data.map((item) => {
				dates.push(item.dealTime);
				price.push(item.price);
				counts.push(item.quantity);
			});
			this.optionShow.tooltip = {
				show: true,
				trigger: "axis",
			};
			this.optionShow.legend.show = false;
			this.optionShow.xAxis.data = dates;
			this.optionShow.series[0].data = price;
			this.optionShow.series[0].name = "成交价";
			this.optionShow.series[1].data = counts;
			this.optionShow.series[1].name = "成交量";
			if (document.getElementById("echart-show")) {
				this.showloading = false;
				Echarts.init(document.getElementById("echart-show")).setOption(
					this.optionShow
				);
			}
		},
		// 设置其他行数据
		setOutData(data) {
			this.optionShow.legend.data = [];
			this.optionShow.legend.show = true;
			this.optionShow.tooltip = {
				show: true,
				trigger: "axis",
				triggerOn: "mousemove",
				formatter: (data) => {
					let str = data[0].axisValue + "</br>";
					data.reverse().forEach((item) => {
						let _t = item.seriesIndex == 0
								? "成交量"
								: "成交价"
						str =
							str + item.marker + item.seriesName + _t + " : " + item.data + "</br>";
					});
					return str;
				},
			};
			data.map((item, index) => {
				this.optionShow.legend.data.push(item.name);
				this.optionShow.series.push(
					{
						name: "",
						data: [],
						symbol: "none",
						type: "bar",
						barWidth: "20%",
						stack: "成交量",
						itemStyle: {
							normal: { color: this.colorlist[index] },
						},
					},
					{
						name: "",
						data: [],
						symbol: "none",
						yAxisIndex: 1,
						type: "line",
						symbolSize: 10,
						itemStyle: {
							normal: { color: this.colorlist[index + 1] },
						},
					}
				);
				this.optionShow.legend.selected[item.name] = index < 1 ? true : false;
				let dates = [],
					price = [],
					counts = [];
				item.value.map((citem, cindex) => {
					if (this.optionShow.xAxis.data.indexOf(citem.infoTime) < 0) {
						this.optionShow.xAxis.data.push(citem.infoTime);
					}
					price.push(citem.tradedPrice);
					counts.push(citem.tradedQuantity);
				});
				this.optionShow.series[2 * index].data = counts;
				this.optionShow.series[2 * index].name = item.name;
				this.optionShow.series[2 * index + 1].data = price;
				this.optionShow.series[2 * index + 1].name = item.name;
			});
			if (document.getElementById("echart-show")) {
				this.showloading = false;
				Echarts.init(document.getElementById("echart-show")).setOption(
					this.optionShow
				);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.col-gre {
	color: #008000 !important;
}

.col-red {
	color: #ff0000;
}

._h4 {
	font-size: 18px;
	font-weight: 600;
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
.little-box {
	text-align: right;
	padding-right: 20px;
	/deep/ .el-radio-button__inner {
		padding: 8px 20px;
	}
	.text {
		float: left;
		margin-left: 20px;
		font-size: 14px;
		color: #606266;
		line-height: 32px;
	}
	span + span {
		display: inline-block;
		margin-left: 20px;
	}
}
</style>
