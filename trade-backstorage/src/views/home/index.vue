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
					<div class="echart-box clearfix" v-loading="loading">
						<Appecharts
							:domid="'echart-show'"
							:option="optionShow"
							width="50%"
						></Appecharts>
						<Appecharts
							:domid="'echart-click'"
							:option="optionClick"
							width="50%"
						></Appecharts>
					</div>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetHomeData } from "../../api/apis";
let Echarts = require("echarts/lib/echarts");
export default {
	name: "AppHome",
	data() {
		return {
			userinfo: {}, //用户账户
			loading: false,
			datas: {
			},
			topdata: {
			},
			optionShow: {
				title: {
					text: "行情信息",
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
						name: "展示量",
						data: [],
						symbol: "none",
						type: "line",
					},
				],
			},
			optionClick: {
				title: {
					text: "成交额统计图",
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
		};
	},

	created() {},
	mounted() {
		this.getDatas();
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
		getChartInfo() {
			this.loading = true;
			GetShopChart(this.$tools.pastDate(31), this.$tools.pastDate(1))
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						if (res.body && res.body.dates) {
							this.formData.total_show = res.body.total_show;
							this.formData.total_click = res.body.total_click;
							this.setData(res.body);
						} else {
							this.$message.error("暂无数据");
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 设置图表数据
		setData(data) {
			this.optionShow.xAxis.data = data.dates;
			this.optionClick.xAxis.data = data.dates;
			this.optionShow.series[0].data = data.y_show_value;
			this.optionClick.series[0].data = data.y_click_value;
			if (document.getElementById("echart-show")) {
				this.loading = false;
				Echarts.init(document.getElementById("echart-show")).setOption(
					this.optionShow
				);
				Echarts.init(document.getElementById("echart-click")).setOption(
					this.optionClick
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
</style>
