<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="shoprank" :asideIdx="['2']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 商品排名变化 </span>
							<!-- 页面内容 -->
							<el-radio-group v-model="dateradio" @change="chooseRadio">
								<el-radio-button label="0">昨天</el-radio-button>
								<el-radio-button label="7">近7天</el-radio-button>
								<el-radio-button label="15">近15天</el-radio-button>
								<el-radio-button label="30">近30天</el-radio-button>
							</el-radio-group>
							<Appkeytable
								:tableData="tableData"
								pagename="shoprank"
								:total="total"
								:currentPage="currentPage"
								:loading="loading"
								@handleChange="handleChange"
							></Appkeytable>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetRankList } from "../../api/apis";
import { mapState } from "vuex";

export default {
	name: "AppShopRank",
	data() {
		return {
			loading: false, //表格loading
			dateradio: "0",
			total: 0,
			currentPage: 1,
			tableData: [], //数据列表
		};
	},
	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},

	mounted() {
		this.getShowList();
	},
	destroyed() {
		this.tableData = [];
	},

	methods: {
		chooseRadio(label) {
			this.getShowList(this.$tools.pastDate(parseInt(label) + 1));
		},
		// 分页
		handleChange(val) {
			this.getShowList(this.$tools.pastDate(parseInt(this.dateradio) + 1), val);
		},
		// 获取列表
		getShowList(start, page) {
			this.loading = true;
			let _start = start ? start : this.$tools.pastDate(1),
				_page = page ? page : 1;
			// GetRankList('2020-10-17', _page).then((res) => {
			GetRankList(_start, _page).then((res) => {
				if (res.code == 0) {
					this.loading = false;
					if (res.body) {
						this.tableData = res.body.list;
						this.total = res.body.page ? res.body.page.count : 0;
					} else {
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
.el-radio-group {
	margin: 20px 0;
}
</style>
