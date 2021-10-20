<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="productlow" :asideIdx="['1']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs
						type="border-card"
						id="el-main"
						:value="tabnum"
						@tab-click="handleClick"
					>
						<el-tab-pane class="low-pro" name="1">
							<!-- 标签标题 -->
							<span slot="label"> 低质商品 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>
									为了提升产品服务，我们将您的商品根据不同的维度进行了综合分析，您可以从下表中查看您的产品问题。
								</p>
								<p>
									请根据问题提示进行整改商品；低质商品将拉低您的整体店铺分，也将会影响到您的商品展示。
								</p>
								<p>
									标题为<span class="orange">黄色</span
									>的商品为会员已设置的爆款商品
								</p>
							</div>
							<Appprotable
								pagename="prolow"
								:tableData="tableData"
								:total="total"
								@searchProduct="searchProduct"
								@handleChange="handleChange"
								@handleSizeChange="handleSizeChange"
								@clearSearch="clearSearch"
								:currentPage="currentPage"
								:loading="loading"
								@managePro="getLowPro()"
								@chooseShow="chooseShow"
								ref="lowlist"
							></Appprotable>
						</el-tab-pane>
						<el-tab-pane class="low-pro" name="2">
							<!-- 标签标题 -->
							<span slot="label"> 重复商品 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>
									为了提升产品服务，我们将您的商品根据不同的维度进行了综合分析，您可以从下表中查看您的产品问题。
								</p>
								<p>
									请根据问题提示进行整改商品；低质商品将拉低您的整体店铺分，也将会影响到您的商品展示。
								</p>
								<p>重复组中的数据编号，编号相同的数据为一组重复数据。</p>
								<p>
									重复程度：重度重复是指，同一个重复组内的商品高度相似。
									恶劣重复是指，同一个重复组内的商品极度相似，商品内容基本一致。
								</p>
								<p>
									标题为<span class="orange">黄色</span
									>的商品为会员已设置的爆款商品
								</p>
							</div>
							<Appprotable
								pagename="prolow"
								:tableData="tableData"
								:total="total"
								@searchProduct="searchProduct"
								@handleChange="handleChange"
								@handleSizeChange="handleSizeChange"
								@clearSearch="clearSearch"
								:currentPage="currentPage"
								:loading="loading"
								@managePro="getLowPro()"
								@chooseShow="chooseShow"
								:repeat="true"
								ref="repeatlist"
							></Appprotable>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetLowProduct } from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppProductLow",
	data() {
		return {
			tabnum: "1",
			tableData: [],
			loading: false,
			keyword: "",
			currentPage: 1,
			infotype: "", //问题类型
			displayed: -1, //30天数据
			repeatid: "", //重复组
			repeatlevel: "", //重复级别
			starlevel: 0, //星级
			total: 0,
			formsl: "",
			pagesize: 20, //每页条数
		};
	},
	created() {
		this.currentPage = this.$route.params.pagenum
			? this.$route.params.pagenum
			: 1;
		this.tabnum = this.$route.params.repeat ? "2" : "1";
	},
	computed: {
		...mapState(["vipUseData"]),
	},

	mounted() {
		this.getLowPro();
	},
	destroyed() {
		this.tableData = [];
	},
	methods: {
		handleClick(tab) {
			this.tabnum = tab.name;
			this.$refs.lowlist.searchwords = "";
			this.$refs.repeatlist.searchwords = "";
			this.keyword = "";
			this.$refs.lowlist.showval = -1;
			this.$refs.repeatlist.showval = -1;
			this.displayed = -1;
			this.currentPage = 1;
			this.getLowPro();
		},
		searchProduct(data) {
			this.keyword = data;
			this.getLowPro();
		},
		// 获取低质商品
		getLowPro() {
			let _repeat = this.tabnum == "1" ? 0 : 1,
				_persize = this.pagesize ? this.pagesize : 20;
			this.loading = true;
			document.getElementById("el-main").scrollTop = 0;
			GetLowProduct(
				_repeat,
				this.infotype,
				this.displayed,
				this.repeatid,
				this.repeatlevel,
				this.starlevel,
				this.currentPage,
				this.keyword,
				_persize
			).then((res) => {
				this.loading = false;
				if (res.code == 0) {
					this.total = res.body.page.count;
					this.tableData = res.body.list;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 选择页码
		handleChange(val) {
			this.currentPage = val;
			this.getLowPro();
		},
		// 选择页条数
		handleSizeChange(val) {
			this.currentPage = 1;
			this.pagesize = val;
			this.getLowPro();
		},
		// 清空搜索
		clearSearch() {
			this.currentPage = 1;
			this.keyword = "";
			this.getLowPro();
		},
		// 筛选
		chooseShow(data) {
			this.displayed = data.show; //30天数据
			if (this.tabnum == "1") {
				this.infotype = data.ques; //问题类型
				this.starlevel = data.star; //星级
				this.repeatid = "";
				this.repeatlevel = -1;
			} else {
				this.infotype = "";
				this.repeatid = data.repeat; //重复组
				this.repeatlevel = data.repeatl; //重复级别
			}
			this.getLowPro();
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-alert {
	margin-bottom: 20px;
}
/deep/ .el-table th {
	text-align: center;
}

/deep/ .el-table .cell {
	white-space: nowrap;

	a:hover {
		color: #1a8cff;
		text-decoration: underline !important;
	}
}

/deep/ .is-disabled .el-input__inner {
	cursor: pointer;
	color: #606266;
}
.low-pro {
	/deep/ .el-input-group {
		max-width: 192px !important;
	}
}
</style>
