<template>
	<div>
		<Appheader :ishome="true"></Appheader>
		<el-container>
			<Appaside></Appaside>
			<el-container>
				<el-main>
					<div class="home-outer">
						<div class="home-cards">
							<el-card class="box-card">
								<div slot="header" class="clearfix">
									<span>我的信息</span>
									<router-link
										class="el-button el-button--primary"
										style="padding: 4px 20px"
										:to="{ name: 'topup' }"
										>去充值</router-link
									>
								</div>
								<div class="card-item">
									<span>账户状态：</span>
									<p
										class="green"
										v-if="
											$cookies.get('ctrl_cer_user_name') == 1 &&
											$cookies.get('ctrl_cer_company') == 1
										"
									>
										已认证
									</p>
									<p class="red" v-else>未认证</p>
								</div>
								<div class="card-item">
									<span>余额：</span>
									<p v-loading="feeloading">{{ useraccount }}元</p>
								</div>
								<div class="card-item">
									<span>账号：</span>
									<p>
										{{ $state.userData.username }}
										<i class="col-red">（同时为App登录账号）</i>
									</p>
								</div>
								<div class="card-item">
									<span>上架产品数：</span>
									<p v-loading="toploading">{{ putonnum }}</p>
								</div>
								<div class="card-item">
									<span>下架产品数：</span>
									<p v-loading="toploading">{{ putdownnum }}</p>
								</div>
							</el-card>
							<el-card class="box-card">
								<div slot="header" class="clearfix">
									<span>小课堂</span>
									<router-link :to="{ name: 'articlelist' }" class="more-btn"
										>查看更多</router-link
									>
								</div>
								<ul v-loading="artloading">
									<li class="red" @click="$tools.openUrl('https://docs.qq.com/doc/DZEhqZWxibWdrQ0Vm')">云采购新版会员后台使用手册</li>
									<li
										v-for="(item, index) in articleData"
										:key="index"
										@click="
											$tools.openUrl(
												`https://www.yuncaigou.net/news-show-${item.id}.html`
											)
										"
									>
										{{ item.title }}
									</li>
								</ul>
								<ul v-if="articleData.length == 0 && !artloading">
									<li>暂无数据</li>
								</ul>
							</el-card>
						</div>
						<router-link
							:to="{ name: 'productedit' }"
							class="router-link"
						></router-link>
						<router-link
							:to="{ name: 'agentmanage' }"
							class="router-right"
						></router-link>
						<ul class="table-box">
							<li>
								<p>展示量</p>
								<span v-loading="loading">{{
									formData.total_show ? formData.total_show : 0
								}}</span>
							</li>
							<li>
								<p>点击量</p>
								<span v-loading="loading">{{
									formData.total_click ? formData.total_click : 0
								}}</span>
							</li>
							<li>
								<p>转化率</p>
								<span v-loading="loading"
									>{{
										formData.total_click
											? (
													(formData.total_click / formData.total_show) *
													100
											  ).toFixed(2)
											: 0
									}}%</span
								>
							</li>
						</ul>

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
					</div>
				</el-main>
				<Appfooter></Appfooter>
				
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
	GetArticleList,
	GetUserAccount,
	GetAllProduct,
	GetShopChart,
} from "../../api/apis";
let Echarts = require("echarts/lib/echarts");
export default {
	name: "AppHome",
	data() {
		return {
			articleData: [], //小课堂列表
			userinfo: {}, //用户账户
			toploading: false,
			feeloading: false,
			artloading: false,
			loading: false,
			useraccount: 0,
			formData: {},
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
			optionClick: {
				title: {
					text: "30天内搜索点击趋势",
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
			putonnum: 0, //上架商品数
			putdownnum: 0, //上架商品数
		};
	},

	created() {},
	mounted() {
		this.getCompanyData();
		this.getChartInfo();
		this.getArticleList();
		this.getProduct();
		this.getUserAccount();
	},
	computed: {
		...mapState(["companyData"]),
	},
	destroyed() {
		this.optionShow = {};
		this.optionClick = {};
	},
	methods: {
		...mapActions(["getCompanyData"]),
		// 小课堂列表
		getArticleList() {
			this.artloading = true;
			GetArticleList(4)
				.then((res) => {
					this.artloading = false;
					this.articleData = res.body.list;
				})
				.catch((err) => {
					this.artloading = false;
					this.$message.error(err);
				});
		},
		// 用户余额
		getUserAccount() {
			this.feeloading = true;
			GetUserAccount()
				.then((res) => {
					this.feeloading = false;
					this.useraccount = res.body.balance ? res.body.balance : "0";
				})
				.catch((err) => {
					this.feeloading = false;
					this.$message.error(err);
				});
		},
		// 上架下架数
		getProduct() {
			this.getProFunc("3");
			this.getProFunc("0");
		},
		getProFunc(status) {
			this.toploading = true;
			GetAllProduct(status, 1, "").then((res) => {
				this.toploading = false;
				if (res.code == 0) {
					status == "3"
						? (this.putonnum = res.body.page.count)
						: (this.putdownnum = res.body.page.count);
				} else {
					this.$message.error(res.msg);
				}
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
		getChartInfo() {
			this.loading = true;
			GetShopChart(this.$tools.pastDate(31), this.$tools.pastDate(1))
				.then((res) => {
					// GetShopChart("2020-10-04", "2020-10-10")
					// .then((res) => {
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
	},
};
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
