<template>
	<div class="echart-box clearfix" v-loading="loading">
		<Appecharts
			:domid="'echart-show'"
			:option="optionShow"
			width="100%"
		></Appecharts>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
	GetProductDetail
} from "../../api/apis";
let Echarts = require("echarts/lib/echarts");
export default {
	name: "AppHome",
	data() {
		return {
			optionShow: {
				title: {
					text: "30天内搜索展示趋势",
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
		};
	},

	created() {},
	mounted() {
		
	},
	computed: {
		...mapState(["companyData"]),
	},
	destroyed() {
		
	},
	methods: {
		...mapActions(["getCompanyData"]),
		// 设置图表数据
		setData(data) {
			this.optionShow.xAxis.data = data.dates;
			this.optionShow.series[0].data = data.y_show_value;
			if (document.getElementById("echart-show")) {
				this.loading = false;
				Echarts.init(document.getElementById("echart-show")).setOption(
					this.optionShow
				);
			}
		},
		getChartInfo() {
			this.loading = true;
			GetShopChart(this.$tools.pastDate(31), this.$tools.pastDate(1))
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						if (res.body && res.body.dates) {
							this.formData.total_show = res.body.total_show;
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
	},
};
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
