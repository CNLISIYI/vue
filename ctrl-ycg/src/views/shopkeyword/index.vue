<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="shopkeyword" :asideIdx="['2']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 关键词 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>
									可查看指定范围内的产品关键词；该关键词为最终点击行为下的关键词；最大支持导出90万条数据，建议您最大选择7天内的数据导出
								</p>
							</div>
							<Appkeytable
								:tableData="tableData"
								pagename="keywords"
								:total="total"
								:currentPage="currentPage"
								:loading="loading"
								@handleChange="handleChange"
								@handleChooseDate="handleChooseDate"
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
import { GetKeywordList } from "../../api/apis";
import { mapState } from "vuex";

export default {
	name: "AppShopKeyword",
	data() {
		return {
			loading: false, //提交表单loading
			tableData: [],
			total: 0,
			currentPage: 1,
			choosedate: [],
		};
	},
	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},
	destroyed() {
		this.tableData = [];
	},
	mounted() {
		this.getKeyList();
	},

	methods: {
		// 分页
		handleChange(val) {
			this.getKeyList(this.choosedate[0], this.choosedate[1], val);
		},
		// 选择日期
		handleChooseDate(date) {
			this.choosedate = date;
			this.getKeyList(date[0], date[1]);
		},
		// 获取列表
		getKeyList(start, end, page) {
			this.loading = true;
			let _start = start ? start : this.$tools.pastDate(1),
				_end = end ? end : this.$tools.pastDate(1),
				_page = page ? page : 1;
			// GetKeywordList('2020-09-06', '2020-09-13', _page).then((res) => {
			GetKeywordList(_start, _end, _page)
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.tableData = res.body.list;
						this.total = res.body.page ? res.body.page.count : 0;
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
</style>
