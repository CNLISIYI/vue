<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="message" :asideIdx="['0']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card" :value="tabnum" @tab-click="handleClick">
						<!-- <el-tab-pane name="1">
							<span slot="label"> 询盘消息 </span>
							<el-table
								:data="tableDataxp"
								border
								style="width: 100%"
								v-loading="loading"
								key="xptable"
							>
								<el-table-column
									:resizable="false"
									label="商户公司"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="商品Link"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="询盘人"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="询盘电话"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="询盘数量"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="询盘微信"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="询盘人微信"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="询盘人邮箱"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="询盘时间"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.money }}</span>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination
								@current-change="handleChange"
								:current-page="currentPage"
								:page-size="20"
								background
								layout="total, prev, pager, next, jumper"
								:total="totalxp"
								:hide-on-single-page="true"
							>
							</el-pagination>
						</el-tab-pane> -->
						<el-tab-pane name="1">
							<!-- 标签标题 -->
							<span slot="label"> 问价消息 </span>
							<div class="table-operate" @click="$tools.openUrl('https://b2bwork.baidu.com/serv_message')">
								<el-button type="primary">前往爱采购消息中心</el-button>
							</div>
							<el-table
								:data="tableData"
								border
								style="width: 100%"
								v-loading="loading"
								key="wjtable"
							>
								<el-table-column
									:resizable="false"
									label="求购链接"
									align="center"
									width="240px"
								>
									<template slot-scope="scope">
										<a @click="$tools.openUrl(scope.row.company.linkurl)">{{
											scope.row.company.linkurl
										}}</a>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="来源企业"
									align="center"
									width="240px"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.company.company }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="联系人"
									align="center"
									width="100px"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.from_truename }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="联系电话"
									align="center"
									width="120px"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.from_mobile }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="报价"
									align="center"
									width="100px"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.from_price }}</span>
									</template>
								</el-table-column>
								<el-table-column :resizable="false" label="内容" align="center">
									<template slot-scope="scope">
										<span>{{
											scope.row.content ? scope.row.content : "-"
										}}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="提交时间"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ $tools.timeToDate(scope.row.create_time) }}</span>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination
								@current-change="handleChange"
								:current-page="currentPage"
								:page-size="20"
								background
								layout="total, prev, pager, next, jumper"
								:total="total"
								:hide-on-single-page="true"
							>
							</el-pagination>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { getMessageList } from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppMessage",
	data() {
		return {
			tabnum: "1", //标签页
			loading: false, //loading
			tableData: [], //问价消息
			currentPage: 1, //页码
			total: 0, //数量
		};
	},
	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},
	
	mounted() {
		this.getMessage();
	},
	destroyed() {
		this.tableData = [];
	},

	methods: {
		handleClick(tab) {
			// this.tabnum = tab.name;
		},

		// 获取问价消息
		getMessage(page) {
			this.loading = true;
			let _page = page ? page : 1;
			getMessageList(_page).then((res) => {
				this.loading = false;
				if (res.code == 0) {
					if (res.body) {
						this.tableData = res.body.list;
						this.total = res.body.page.count;
					} else {
						this.$message.error("暂无数据");
					}
				} else {
					this.loading = false;
					this.$message.error(res.msg);
				}
			});
		},
		// 翻页
		handleChange(val) {
			this.getMessage(val);
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .cell a {
	text-overflow: ellipsis;
	white-space: nowrap;
}
.table-operate {
	margin: 10px 0 10px;
}
</style>
