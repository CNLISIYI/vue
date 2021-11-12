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
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetHomeData } from "../../api/apis";
export default {
	name: "AppHome",
	data() {
		return {
			userinfo: {}, //用户账户
			loading: false,
			datas: {
				underReview: 1, //待审批用户
				carbonRemitQty: 8, //待审批碳汇项目
				agreementApproval: 1, //待审批协议转让
				settlementApproval: 1, //待审批项目结算
			},
			topdata: {
				userQty: 3, //用户总数量
				approvedUserQty: 1, //已审核用户
				agreementQty: 1, //协议成交单总数量
				agreementMoney: 1, //协议成交总金额
				listingQty: 2, //挂牌成交单总数量
				listingMoney: 2, //挂牌成交总金额
				declareQty: 9, //项目申报单总数量
				gertQty: 40202, //项目减排总数量
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
