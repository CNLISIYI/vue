<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="solescore" :asideIdx="['2']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<span slot="label"> 搜了网店铺分 </span>
							<el-table
								:data="tableData"
								border
								style="width: 100%"
								v-loading="loading"
							>
								<el-table-column
									:resizable="false"
									fixed
									label="每年第几周"
									align="center"
								>
									<template slot-scope="scope">
										<span>第 {{ scope.row.week }} 周</span>
									</template>
								</el-table-column>
								<el-table-column :resizable="false" label="得分" align="center">
									<template slot-scope="scope">
										<span>{{ scope.row.score ? scope.row.score : 0 }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="运营得分"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{
											scope.row.operation_score ? scope.row.operation_score : 0
										}}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="行业排名百分比"
									align="center"
								>
									<template slot-scope="scope">
										<span
											>{{
												scope.row.industry_rank ? scope.row.industry_rank : 0
											}}%</span
										>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="质量分"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.quality_score }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="服务分"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.service_score }}</span>
									</template>
								</el-table-column>
							</el-table>
							<div class="chart-box" v-loading="chartloading">
								<Appecharts
									:domid="'echart-show'"
									:option="optionShow"
									width="100%"
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
import { GetSoleScore } from "../../api/apis";
import { mapState } from "vuex";
let Echarts = require("echarts/lib/echarts");

export default {
	name: "AppSoleScore",
	data() {
		return {
			loading: false, //loading
			tableData: [], //表格数据
			chartloading: false,
			optionShow: {
				title: {
					text: "最近四周内展现数据",
					left: "10%",
				},
				tooltip: {
					show: true,
					trigger: "axis",
				},
				legend: {
					right: "10%",
					data: ["得分", "运营得分", "行业排名百分比", "质量分", "服务分"],
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
						name: "得分",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "运营得分",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "行业排名百分比",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "质量分",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "服务分",
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
		this.getstarInfo();
	},

	methods: {
		// 获取店铺分
		getstarInfo() {
			this.loading = true;
			this.chartloading = true;
			GetSoleScore()
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.tableData = res.body.list;
						if (!res.body.week) {
							this.chartloading = false;
							this.$message.error("暂无数据");
						} else {
							this.setData(res.body);
						}
					} else {
						this.chartloading = false;
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.chartloading = false;
					this.$message.error(err);
				});
		},
		// 设置图表数据
		setData(data) {
			this.optionShow.xAxis.data = data.week;
			this.optionShow.series[0].data = data.score;
			this.optionShow.series[1].data = data.operation_score;
			this.optionShow.series[2].data = data.industry_rank;
			this.optionShow.series[3].data = data.quality_score;
			this.optionShow.series[4].data = data.service_score;
			if (document.getElementById("echart-show")) {
				this.chartloading = false;
				Echarts.init(document.getElementById("echart-show")).setOption(
					this.optionShow
				);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.el-table {
	margin: 10px auto 60px;
}
</style>
