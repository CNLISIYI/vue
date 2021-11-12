<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="setrole" :asideIdx="['4']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>系统设置</el-breadcrumb-item>
						<el-breadcrumb-item>角色管理</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="table-operate">
						<el-button
							type="primary"
							@click="
								addShow = true;
								ruleForm = {};
							"
							>新增角色</el-button
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
						<el-table-column :resizable="false" label="角色名称" align="center">
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
						:title="editid ? '编辑角色' : '新增角色'"
						:visible.sync="addShow"
						size="35%"
					>
						<el-form
							:model="ruleForm"
							ref="form"
							label-width="100px"
							class="demo-ruleForm"
						>
							<el-form-item label="角色名称" required>
								<el-input
									v-model="ruleForm.roleName"
									placeholder="请输入角色名称"
								></el-input>
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
					<el-dialog title="删除" :visible.sync="deleteshow">
						<p>
							该角色下有人员关联，请先将管理人员转移至其他角色中，才可进行删除
						</p>
						<el-form :model="form">
							<el-form-item label="">
								<el-select v-model="form.roleId" placeholder="请选择转移的角色">
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
						<div slot="footer" class="dialog-footer">
							<el-button @click="deleteshow = false">取 消</el-button>
							<el-button type="primary" @click="deleteBtn">确 定</el-button>
						</div>
					</el-dialog>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetRoleList, DelRole, EditRoleData } from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppSetRole",

	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [
				{
					roleId: -1, //角色id
					roleName: "admin", //角色名称
					status: 0,
					createTime: "2021-11-09 10:54:54", //创建时间
					remark: "交易系统用户角色【预置】",
					flag: true, //角色是否有关联:true - 有关联 ,false -无关联
				},
				{
					roleId: 31, //角色id
					roleName: "admin1111", //角色名称
					createTime: "2021-11-08 13:20:50", //创建时间
					flag: true, //角色是否有关联:true - 有关联 ,false -无关联
				},
				{
					roleId: 32, //角色id
					roleName: "管理员2", //角色名称
					createTime: "2021-11-08 17:08:34", //创建时间
					flag: false, //角色是否有关联:true - 有关联 ,false -无关联
				},
				{
					roleId: 33, //角色id
					roleName: "管理员3", //角色名称
					createTime: "2021-11-08 17:08:47", //创建时间
					flag: false, //角色是否有关联:true - 有关联 ,false -无关联
				},
			],
			editid: "",
			addShow: false,
			ruleForm: {},
			uploading: false,
			deleteshow: false,
			deleteId: "",
			roleId: "",
			form:{}
		};
	},
	created() {},
	computed: {
		...mapState(["userData"]),
	},
	watch: {},
	mounted() {
		this.getList();
	},

	methods: {
		// 获取列表
		getList() {
			this.loading = true;
			GetRoleList(this.currentPage).then((res) => {
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
		// 无关联删除
		deleteRow(row) {
			if (row.flag) {
				this.deleteId = row.id;
				this.deleteshow = true;
			} else {
				this.$confirm("确定删除此角色么？", "删除", {
					beforeClose: (action, instance, done) => {
						if (action === "confirm") {
							this.deleteFunc(row.id, -1, false);
							done();
						}
					},
				})
					.then(() => {
						done();
					})
					.catch(() => {});
			}
		},
		deleteBtn() {
			if (!this.form.roleId) {
				this.$message.error("请选择角色");
			} else {
				this.deleteFunc(this.deleteId, this.form.roleId, true);
			}
		},
		// 删除接口
		deleteFunc(roleId, roleIdTN, flag) {
			DelRole(roleId, roleIdTN, flag)
				.then((res) => {
					if (res.code == 0) {
						this.$message.success("删除成功");
						this.getList();
						this.deleteshow = false;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
		},
		// 编辑
		openDetail(row) {
			this.editid = row.roleId;
			this.ruleForm.roleName = row.roleName;
			this.addShow = true;
		},
		// 新增保存
		addSubmit() {
			if (!this.ruleForm.roleName) {
				this.$message.error("请输入角色名称");
			} else {
				this.uploading = true;
				EditRoleData(this.ruleForm.roleName, this.$state.allIds).then((res) => {
					if (res.code == 0) {
						this.uploading = false;
						this.$message.success("保存成功");
						this.ruleForm = {};
						this.addShow = false;
						this.getList();
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
	margin: 20px 0 20px;
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
/deep/ .el-dialog {
	width: 34%;
	.el-select {
		margin: 20px auto;
	}
	.el-input {
		width: 300px;
	}
}
/deep/ .el-dialog__body {
	padding: 10px 20px 0;
}
</style>
