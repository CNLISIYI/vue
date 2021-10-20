<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="shopscore" :asideIdx="['2']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 店铺质量与店铺分 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>
									爱采购系统每周一早上10:00左右产出新的店铺分报告，每天更新一次
								</p>
							</div>
							<ul class="score-ul">
								<li
									:class="index == topidx ? 'on' : ''"
									v-for="(item, index) in topData"
									:key="index"
									@click="chooseDate(index)"
								>
									<el-card class="box-card" shadow="hover" v-loading="loading">
										<div slot="header" class="clearfix">
											<span>{{ item.info_date }}</span>
										</div>
										<p>
											综合得分：{{
												item.shop_member_score ? item.shop_member_score : 0
											}}
										</p>
										<p>店铺星级：{{ item.shop_star ? item.shop_star : 0 }}</p>
										<p>
											服务能力分：{{
												item.service_capab ? item.service_capab : 0
											}}分
										</p>
										<p>
											商品能力分：{{ item.sku_capab ? item.sku_capab : 0 }}分
										</p>
										<p>
											商家能力分：{{ item.shop_capab ? item.shop_capab : 0 }}分
										</p>
										<p>
											运营能力分：{{
												item.opert_capab ? item.opert_capab : 0
											}}分
										</p>
										<p>
											违规行为个数：{{
												item.irregular_behavior ? item.irregular_behavior : 0
											}}个
										</p>
									</el-card>
								</li>
							</ul>
							<ul class="table-box" v-loading="loading">
								<li>
									<p>在线商品数</p>
									<span>{{ Datas.sku_cunt ? Datas.sku_cunt : 0 }}</span>
								</li>
								<li>
									<p>＜3星的商品数</p>
									<span>{{
										Datas.sku_quality_case_cunt_v2
											? Datas.sku_quality_case_cunt_v2
											: 0
									}}</span>
								</li>
								<li>
									<p>≥4星的商品数</p>
									<span>{{
										Datas.sku_quality_advance_cunt_v2
											? Datas.sku_quality_advance_cunt_v2
											: 0
									}}</span>
								</li>
								<li>
									<p>主推商品数</p>
									<span>{{
										Datas.sku_item_count ? Datas.sku_item_count : 0
									}}</span>
								</li>
								<li>
									<p>订单数</p>
									<span>{{
										Datas.order_subtrade_cunt_month
											? Datas.order_subtrade_cunt_month
											: 0
									}}</span>
								</li>
								<li>
									<p>销售额</p>
									<span>{{
										Datas.order_payment_amount_month
											? Datas.order_payment_amount_month
											: 0
									}}</span>
								</li>
							</ul>
							<div
								class="
									el-table
									el-table--fit
									el-table--border
									el-table--enable-row-hover
								"
								style="width: 100%"
							>
								<div class="el-table__header-wrapper">
									<table class="el-table__header">
										<colgroup>
											<col />
											<col />
											<col />
											<col />
											<col />
										</colgroup>
										<thead>
											<tr>
												<th class="is-center is-leaf">
													<div class="cell"></div>
												</th>
												<th class="is-leaf">
													<div class="cell">评分项</div>
												</th>
												<th class="is-center is-leaf">
													<div class="cell">百分率/数值</div>
												</th>
												<th class="is-center is-leaf">
													<div class="cell">行业得分</div>
												</th>
												<th class="is-center is-leaf">
													<div class="cell">行业表现</div>
												</th>
											</tr>
										</thead>
									</table>
								</div>
								<div
									class="el-table__body-wrapper is-scrolling-none"
									v-loading="loading"
								>
									<table class="el-table__body">
										<colgroup>
											<col />
											<col />
											<col />
											<col />
											<col />
										</colgroup>
										<tbody>
											<Appstartr
												head="咨询体验"
												title="24小时响应率"
												:addnum="2"
												:rate="Datas.inq_resp_intime_rate"
												:score="Datas.inq_resp_intime_score"
												:cons="Datas.inq_24h_resp_cate_cons"
											></Appstartr>
											<Appstartr
												title="IM消息3分钟响应率"
												:rate="Datas.im_resp_intime_rate"
												:score="Datas.im_resp_intime_score"
												:cons="Datas.im_3min_resp_cate_cons"
											></Appstartr>
											<Appstartr
												head="商品体验"
												title="品质退款率"
												:rate="Datas.refund_order_quality_rate"
												:score="Datas.refund_order_quality_score"
												:cons="Datas.refund_order_quality_cate_cons"
											></Appstartr>
											<Appstartr
												head="物流体验"
												title="发货履约率"
												:rate="Datas.trade_intime_rate"
												:score="Datas.trade_intime_resp_score"
												:cons="Datas.trade_intime_resp_cate_cons"
											></Appstartr>
											<Appstartr
												head="售后体验"
												title="退款时长"
												:addnum="2"
												:percent="'sz'"
												unit="小时"
												:rate="Datas.refund_order_time_avg"
												:score="Datas.refund_order_time_score"
												:cons="Datas.refund_order_time_cate_cons"
											></Appstartr>
											<Appstartr
												title="交易纠纷率"
												:rate="Datas.trade_order_dispute_rate"
												:score="Datas.trade_order_dispute_score"
												:cons="Datas.trade_order_dispute_cate_cons"
											></Appstartr>
											<Appstartr
												head="商品信息"
												title="≥4星的商品占比"
												:addnum="3"
												:rate="Datas.sku_quality_rate_advance_v2"
												:score="Datas.sku_quality_advance_indicator_v2"
												:cons="Datas.sku_quality_advance_cate_cons_v2"
											></Appstartr>
											<Appstartr
												title="≥3星的商品占比"
												:rate="Datas.sku_quality_rate_base_v2"
												:score="Datas.sku_quality_score_indicator_v2"
												:cons="Datas.sku_quality_base_cate_cons_v2"
											></Appstartr>
											<Appstartr
												title="主推商品视频覆盖率"
												:rate="Datas.item_video_rate"
												:score="Datas.item_video_score"
												:cons="Datas.item_video_cate_cons"
											></Appstartr>
											<Appstartr
												head="商家资质"
												title="店龄"
												:addnum="8"
												unit="年"
												:percent="'sz'"
												:rate="Datas.memberinfo_prov_year"
												:score="Datas.shop_year_score"
												cons="-"
											></Appstartr>
											<Appstartr
												title="商家真实性认证"
												:rate="Datas.memberinfo_realcheck"
												:score="Datas.shop_real_score"
												:cons="Datas.shop_real_cate_cons"
											></Appstartr>
											<Appstartr
												title="商家深度认证"
												:percent="'rz'"
												:shop="Datas"
												:score="Datas.super_shop_cert_score"
												:cons="Datas.super_shop_cert_cate_cons"
											></Appstartr>
											<Appstartr
												title="买家服务保障"
												:percent="'kt'"
												:rate="Datas.buyer_protect"
												:score="Datas.trade_protect_score"
												:cons="Datas.buyer_protect_cate_cons"
											></Appstartr>
											<Appstartr
												title="特色服务保障商品占比"
												:rate="Datas.sku_particular_pct"
												:score="Datas.sku_particular_score"
												:cons="Datas.sku_particular_cate_cons"
											></Appstartr>
											<Appstartr
												title="提交优质答案数"
												:percent="'sz'"
												unit="个"
												:rate="Datas.wenda_month_add_cunt"
												:score="Datas.shop_wenda_score"
												:cons="Datas.shop_wenda_cate_cons"
											></Appstartr>
											<Appstartr
												title="是否存在重复行为"
												:percent="'cz'"
												:rate="Datas.sku_cluster_rate_v2"
												:score="0"
												cons="-"
											></Appstartr>
											<Appstartr
												title="重复铺货扣分"
												:percent="'-'"
												:score="Datas.sku_cluster_score"
												cons="-"
											></Appstartr>
										</tbody>
									</table>
								</div>
							</div>

							<p class="tip-txt">
								注：重复商品总数仅供参考，详情请查看<router-link
									:to="{ name: 'productlow' }"
									>低质商品</router-link
								>
							</p>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { getShopStar } from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppShopScore",
	data() {
		return {
			loading: false, //loading
			topData: [{}, {}, {}, {}], //顶部数据
			Datas: {}, //表格数据
			topidx: 0, //顶部选中idx
		};
	},
	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},

	mounted() {
		this.getstarInfo();
	},
	destroyed() {
		this.Datas = {};
	},

	methods: {
		// 获取店铺分
		getstarInfo() {
			this.loading = true;
			getShopStar()
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						if (res.body.length > 0) {
							this.topData = res.body;
							this.Datas = res.body[this.topidx];
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
		// 选择顶部日期
		chooseDate(idx) {
			this.topidx = idx;
			this.Datas = this.topData[idx];
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
		cursor: pointer;
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
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
.tip-txt {
	margin-top: 20px;
	font-size: 14px;
	color: #606266;
	a {
		color: #1a8cff;
	}
	a:hover {
		text-decoration: underline !important;
	}
}
.el-table__body,
.el-table__header {
	width: 100%;
	colgroup {
		width: 100%;
		col {
			width: 25%;
		}
		col:first-child {
			width: 160px;
		}
	}
}
</style>
