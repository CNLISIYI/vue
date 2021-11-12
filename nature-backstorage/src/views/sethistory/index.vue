<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="sethistory" :asideIdx="['4']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>系统设置</el-breadcrumb-item>
						<el-breadcrumb-item>操作记录</el-breadcrumb-item>
					</el-breadcrumb>
					<el-table
						:data="tableData"
						border
						style="width: 100%"
						v-loading="loading"
						key="table"
					>
						<el-table-column
							type="index"
							width="50"
							align="center"
						></el-table-column>
						<el-table-column :resizable="false" label="操作功能" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.title }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="操作按钮"
							align="center"
							width="120px"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.businessType == '0'">其他</span>
								<span v-else-if="scope.row.businessType == '1'">新增</span>
								<span v-else-if="scope.row.businessType == '2'">修改</span>
								<span v-else-if="scope.row.businessType == '3'">删除</span>
								<span v-else-if="scope.row.businessType == '4'">通过</span>
								<span v-else-if="scope.row.businessType == '5'">驳回</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="操作人员" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.operName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="操作时间" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.operTime }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="操作IP" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.operIp }}</span>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-size="20"
						background
						layout="total, prev, pager, next"
						:total="total"
						:hide-on-single-page="true"
					>
					</el-pagination>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetHistory } from "../../api/apis";
export default {
	name: "AppHistory",

	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [
				{
					operId: 2, //日志id
					title: "操作功能", //操作功能
					businessType: "1", //操作按钮:0其它 1新增 2修改 3删除 4通过 5驳回
					operName: "操作人员", //操作人员
					status: "0",
					operTime: "2021-11-09 14:34:39", //操作时间
					operIp: "127.0.0.1", //操作IP
				},
			],
		};
	},
	created() {},
	computed: {},
	watch: {},
	mounted() {
		this.getList();
	},

	methods: {
		// 获取列表
		getList() {
			this.loading = true;
			GetHistory(this.currentPage).then((res) => {
				if (res.code == 0) {
					this.loading = false;
					if (res.data) {
						this.tableData = res.data.records;
						this.total = res.data.total;
					} else {
						this.$message.error("暂无数据");
					}
				} else {
					this.loading = false;
					this.$message.error(res.msg);
				}
			});
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getList();
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-table {
	margin-top: 20px;
}
</style>
