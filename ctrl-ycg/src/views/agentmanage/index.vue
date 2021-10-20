<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="agentmanage" :asideIdx="['6']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 任务列表 </span>
							<div class="tips">
								<p>
									由于百度目前严格检查商品质量，故此代发功能将限制使用，
									<span class="red">每次只允许设置一条代发任务；</span>
								</p>
								<p>
									<router-link
										class="_a el-button el-button--danger el-button--mini"
										:to="{
											name: 'agentpost',
										}"
										>前往创建代发任务</router-link
									>
								</p>
							</div>
							<!-- 页面内容 -->
							<el-table
								:data="tableData"
								border
								style="width: 100%"
								v-loading="loading"
								key="table"
							>
								<el-table-column :resizable="false" label="标题" width="400px">
									<template slot-scope="scope">
										<span>{{ scope.row.crontab_name }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="总条数"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.push_total }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="每日发送"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.day_total }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="频率（秒）"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.req_time }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="发布时间"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.push_time }}:00</span>
									</template>
								</el-table-column>
								<el-table-column :resizable="false" label="状态" align="center">
									<template slot-scope="scope">
										<span class="green" v-if="scope.row.status == '1'"
											>运行中</span
										>
										<span class="red" v-else>已停止</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="操作"
									fixed="right"
									align="center"
									width="200px"
								>
									<template slot-scope="scope">
										<el-button
											size="mini"
											type="danger"
											@click="setAgent(scope.row.id, 0)"
											v-if="scope.row.status == '1'"
											>停止</el-button
										>
										<div v-else>
											<el-button
												size="mini"
												type="warning"
												@click="openeditAgent(scope.row.id)"
												>管理</el-button
											>
											<router-link
												class="
													edit-btn
													el-button el-button--primary el-button--mini
												"
												:to="{
													name: 'agentpost',
													params: {
														cron_id: scope.row.id,
													},
												}"
												>编辑</router-link
											>
											<el-button
												size="mini"
												type="success"
												@click="setAgent(scope.row.id, 1)"
												>开启</el-button
											>
										</div>
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
							<el-drawer
								title="管理标题"
								:visible.sync="editshow"
								size="80%"
								:destroy-on-close="true"
							>
								<div class="tips">
									<p>
										当前任务中未发布的产品标题可以进行修改，已经发布的产品标题不能进行修改；如需修改请移步至【信息管理】->【商品管理】
									</p>
								</div>
								<el-table
									:data="titleData"
									border
									style="width: 100%"
									v-loading="titleload"
									key="titletable"
								>
									<el-table-column
										:resizable="false"
										label="标题"
										width="400px"
									>
										<template slot-scope="scope">
											<span>{{ scope.row.title }}</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="状态"
										align="center"
									>
										<template slot-scope="scope">
											<span class="green" v-if="scope.row.push_time"
												>已发布</span
											>
											<span class="red" v-else>未发布</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="发布时间"
										align="center"
									>
										<template slot-scope="scope">
											<span>{{
												scope.row.push_time ? scope.row.push_time : "-"
											}}</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="操作"
										fixed="right"
										align="center"
										width="140px"
									>
										<template slot-scope="scope">
											<el-button
												size="mini"
												type="warning"
												@click="editTitle(scope.row.id, scope.row.title)"
												>编辑</el-button
											>
											<el-button
												size="mini"
												type="danger"
												@click="delTitle(scope.row.id)"
												>删除</el-button
											>
										</template>
									</el-table-column>
								</el-table>
							</el-drawer>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	GetAgentData,
	SetAgentData,
	getAgentTitle,
	PostAgentTitle,
	delAgentTitle,
} from "../../api/apis";
export default {
	name: "AppAgentManage",
	data() {
		return {
			loading: false, //loading
			titleload: false, //标题表格loading
			tableData: [],
			currentPage: 1,
			total: 0,
			editshow: false, //编辑弹窗
			titleData: [], //标题列表
			agentId: "", //打开的代发id
		};
	},
	created() {},
	mounted() {
		this.getAgentList();
	},
	destroyed() {
		this.tableData = [];
		this.titleData = [];
	},

	methods: {
		// 打开编辑
		openeditAgent(id) {
			this.editshow = true;
			this.agentId = id;
			this.titleData = [];
			this.getTitles(id);
		},
		// 获取标题列表
		getTitles(id) {
			this.titleload = true;
			getAgentTitle(id)
				.then((res) => {
					this.titleload = false;
					if (res.code == 0) {
						this.titleData = res.body;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.titleload = false;
					this.$message.error(err);
				});
		},
		// 删除标题
		delTitle(id) {
			this.$confirm("确定删除本条标题信息吗？")
				.then(() => {
					this.titleload = true;
					delAgentTitle(id)
						.then((res) => {
							this.titleload = false;
							if (res.code == 0) {
								this.$message.success("操作成功");
								this.getTitles(this.agentId);
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((err) => {
							this.titleload = false;
							this.$message.error(err);
						});
				})
				.catch(() => {});
		},
		// 编辑标题
		editTitle(id, title) {
			this.$prompt("商品标题", "编辑", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				inputValue: title,
				beforeClose: (action, instance, done) => {
					if (action === "confirm") {
						if (instance.inputValue == "") {
							this.$message.error("请输入标题名");
						} else {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = "";
							PostAgentTitle(instance.inputValue, id)
								.then((res) => {
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = "确定";
									if (res.code == 0) {
										this.$message.success("保存成功");
										done();
									} else {
										this.$message.error(res.msg);
									}
								})
								.catch((err) => {
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = "确定";
								});
						}
					} else {
						instance.confirmButtonLoading = false;
						instance.confirmButtonText = "确定";
						done();
					}
				},
			})
				.then(({ value }) => {
					this.getTitles(this.agentId);
				})
				.catch(() => {});
		},
		// 操作任务
		setAgent(id, st) {
			this.$confirm(st == 1 ? "确定开启本条任务吗？" : "确定停止本条任务吗？")
				.then(() => {
					this.loading = true;
					SetAgentData(id, st)
						.then((res) => {
							this.loading = false;
							if (res.code == 0) {
								this.$message.success("操作成功");
								this.getAgentList();
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((err) => {
							this.loading = false;
							this.$message.error(err);
						});
				})
				.catch(() => {});
		},
		// 获取任务列表
		getAgentList(page) {
			this.loading = true;
			let _page = page ? page : 1;
			GetAgentData(_page)
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.tableData = res.body.list;
						this.total = res.body.page.count;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		handleChange(val) {
			this.getAgentList(val);
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-button--mini,
.el-button--mini.is-round {
	padding: 6px;
}
.edit-btn {
	display: inline-block;
}
.el-table tr:hover {
	.edit-btn {
		color: #fff !important;
		text-decoration: none !important;
	}
}
._a {
	margin-top: 10px;
}
._a:hover {
	color: #ffffff !important;
}
</style>
