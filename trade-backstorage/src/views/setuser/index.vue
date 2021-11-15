<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="setuser" :asideIdx="['4']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>系统设置</el-breadcrumb-item>
						<el-breadcrumb-item>人员管理</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="table-search">
						<el-input
							placeholder="请输入姓名"
							v-model="searchname"
							class="input-with-select"
						>
						</el-input>
						<el-input
							placeholder="请输入手机号码"
							v-model="searchtell"
							class="input-with-select"
							type="number"
						>
						</el-input>
						<el-button
							slot="append"
							type="primary"
							icon="el-icon-search"
							@click="getuserList"
							>搜索</el-button
						>
					</div>
					<div class="table-operate">
						<el-button type="primary" @click="addShow = true"
							>新增人员</el-button
						>
					</div>
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
						<el-table-column :resizable="false" label="姓名" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.nickName }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="手机号码"
							align="center"
							width="120px"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.phone }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="登录名称" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.userName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="登录密码" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.password }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="所属部门" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.deptName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="对应角色" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.roleName }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="创建时间" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.createTime }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="操作"
							fixed="right"
							align="center"
							width="120px"
						>
							<template slot-scope="scope">
								<el-button
									@click="openDetail(scope.row)"
									type="primary"
									size="mini"
								>
									编辑
								</el-button>
								<el-button
									@click.native.prevent="deleteRow(scope.row)"
									type="danger"
									size="mini"
								>
									删除
								</el-button>
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
					<el-drawer
						:title="editid ? '编辑人员' : '新增人员'"
						:visible.sync="addShow"
						size="40%"
					>
						<el-form
							:model="ruleForm"
							ref="form"
							label-width="100px"
							class="demo-ruleForm"
						>
							<el-form-item label="姓名" required>
								<el-input
									v-model="ruleForm.nickName"
									placeholder="请输入姓名"
								></el-input>
							</el-form-item>
							<el-form-item label="手机号码" required>
								<el-input
									v-model="ruleForm.phone"
									placeholder="请输入手机号码"
									type="text"
									maxlength="11"
									@input="ruleForm.phone = $tools.onlyNumber(ruleForm.phone)"
								></el-input>
							</el-form-item>
							<el-form-item label="登录名称" required>
								<el-input
									v-model="ruleForm.userName"
									placeholder="请输入登录名称"
									type="text"
									maxlength="15"
								></el-input>
								<p class="input-txt">
									登录名由字母开头的4到15个字符组成，只能包含数字字母下划线
								</p>
							</el-form-item>
							<el-form-item label="登录密码" required>
								<el-input
									v-model="ruleForm.password"
									placeholder="请输入登录密码"
									type="text"
									maxlength="6"
									@input="
										ruleForm.password = $tools.onlyNumber(ruleForm.password)
									"
								></el-input>
								<p class="input-txt">密码为6位纯数字</p>
							</el-form-item>
							<el-form-item label="所属部门" required>
								<el-input
									v-model="ruleForm.deptName"
									placeholder="请输入所属部门"
								></el-input>
							</el-form-item>
							<el-form-item label="对应角色" required>
								<el-select
									v-model="ruleForm.roleId"
									placeholder="请选择对应角色"
								>
									<el-option
										v-for="item in $state.allRoles"
										:key="item.roleId"
										:label="item.roleName"
										:value="item.roleId"
									>
									</el-option>
								</el-select>
							</el-form-item>
						</el-form>
						<div class="sub-btn">
							<el-button
								type="primary"
								@click="addSubmit"
								v-loading="uploading"
								element-loading-spinner="el-icon-loading"
								>确定保存</el-button
							>
						</div>
					</el-drawer>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetUserList, DelUser, GetUsers, PostUserData } from "../../api/apis";
import { mapState, mapActions } from "vuex";
export default {
	name: "AppSetUser",

	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [],
			searchname: "",
			searchtell: "",
			editid: "",
			addShow: false,
			ruleForm: {},
			uploading: false,
		};
	},
	created() {},
	computed: {
		...mapState(["allRoles"]),
	},
	watch: {},
	mounted() {
		this.getuserList();
		this.getAllRole();
	},

	methods: {
		...mapActions(["getAllRole"]),
		// 获取列表
		getuserList() {
			this.loading = true;
			GetUserList(this.currentPage, this.searchname, this.searchtell).then(
				(res) => {
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
				}
			);
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getuserList();
		},
		// 删除
		deleteRow(row) {
			this.$confirm("确定删除该人员么？删除后将不可再登录此系统")
				.then(() => {
					DelUser(row.id).then((res) => {
						if (res.code == 0) {
							this.$message.success("删除成功");
							this.getuserList();
							setTimeout(() => {
								done();
							}, 400);
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {});
		},
		// 编辑
		openDetail(row) {
			this.editid = row.id;
			GetUsers(this.editid).then((res) => {
				if (res.code == 0) {
					this.ruleForm = res.data;
				} else {
					this.$message.error(res.msg);
				}
			});
			this.addShow = true;
		},
		// 保存
		addSubmit() {
			if (!/^1[3456789]\d{9}$/.test(this.ruleForm.phone)) {
				this.$message.error("请输入正确手机号");
			} else if (!this.ruleForm.nickName || !this.ruleForm.deptName) {
				this.$message.error("请输入姓名和部门");
			} else if (!this.ruleForm.userName || !this.ruleForm.password) {
				this.$message.error("请输入登录名和密码");
			} else if (!this.ruleForm.roleId) {
				this.$message.error("请选择对应角色");
			} else {
				this.uploading = true;
				this.ruleForm.id = this.ruleForm.id ? this.ruleForm.id : "";
				PostUserData(this.ruleForm).then((res) => {
					if (res.code == 0) {
						this.uploading = false;
						this.$message.success("保存成功");
						this.ruleForm = {};
						this.addShow = false;
						this.getuserList();
					} else {
						this.uploading = false;
						this.$message.error(res.msg);
					}
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-button--mini,
.el-button--mini.is-round {
	padding: 6px;
}
.table-operate {
	margin: 0 0 20px;
}
.table-search {
	margin: 20px 0;
}
/deep/ .el-input {
	width: 220px;
}
/deep/ .el-drawer__body {
	.el-input,
	.el-select {
		width: 100%;
	}
}
</style>
