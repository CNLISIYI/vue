<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="manageclass" :asideIdx="['3']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<span slot="label"> 自定义分类 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>调整分类前请先确认当前分类下没有发布的信息</p>
							</div>
							<div class="mt20">
								<!-- 页面内容 -->
								<div class="table-operate">
									<el-button
										type="primary"
										plain
										@click="deleteClasses"
										v-if="tableData.length > 1"
										>批量删除</el-button
									>
									<el-button type="primary" @click="addNewCategary"
										>添加分类</el-button
									>
								</div>
								<el-table
									:data="tableData"
									border
									style="width: 100%"
									v-loading="loading"
									@selection-change="handleSelectionChange"
								>
									<el-table-column
										:resizable="false"
										type="selection"
										width="50"
										align="center"
									></el-table-column>
									<el-table-column
										:resizable="false"
										label="一级分类"
										align="center"
									>
										<template slot-scope="scope">
											<span>{{ scope.row.first }}</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="二级分类"
										align="center"
									>
										<template slot-scope="scope">
											<span>{{ scope.row.second }}</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="三级分类"
										align="center"
									>
										<template slot-scope="scope">
											<span>{{ scope.row.third }}</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="操作"
										fixed="right"
										align="center"
										width="120"
									>
										<template slot-scope="scope">
											<div>
												<el-button
													@click="deleteClass(scope.row.id)"
													type="danger"
													size="mini"
												>
													删除
												</el-button>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
							<!-- 添加分类 -->
							<el-drawer
								title="添加自定义分类"
								:visible.sync="addClassShow"
								size="70%"
							>
								<div class="tips">
									<p>自定义分类的使用如下：</p>
									<p>
										1.
										如果不选择任何一级分类，直接填写分类名称；则该分类名称将自动为一级分类
									</p>
									<p>
										2.
										如果不选择二级分类；则分类名称将直接是二级分类；分类最大支持三级。
									</p>
									<p class="red">3. 分类名称必填</p>
								</div>
								<div class="class-box">
									<div class="class-item">
										<label class="el-form-item__label">选择一级分类</label>
										<el-select
											v-model="firValue"
											placeholder="请选择一级分类"
											@change="chooseFirClass"
										>
											<el-option
												v-for="item in optionsfir"
												:key="item.id"
												:label="item.typename"
												:value="item.id"
											>
											</el-option>
										</el-select>
									</div>
									<div class="class-item" v-if="firValue">
										<label class="el-form-item__label">选择二级分类</label>
										<el-select v-model="secValue" placeholder="请选择二级分类">
											<el-option
												v-for="item in optionssec"
												:key="item.id"
												:label="item.typename"
												:value="item.id"
											>
											</el-option>
										</el-select>
									</div>
									<div class="class-item">
										<label class="el-form-item__label">分类名称</label>
										<el-input
											v-model="thiValue"
											placeholder="请输入最小级分类名"
											maxlength="50"
											@input="thiValue = $tools.inputLimit(thiValue)"
										></el-input>
									</div>
								</div>
								<div class="sub-btn">
									<el-button
										type="primary"
										@click="saveSubmit"
										v-loading="subloading"
										element-loading-spinner="el-icon-loading"
										>保存分类</el-button
									>
								</div>
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
	GetOwnCategory,
	GetCategory,
	DelCategory,
	PostCategory,
} from "../../api/apis";
export default {
	name: "AppManageClass",
	data() {
		return {
			loading: false, //loading
			tableData: [],
			alldelload: false, //批量删除loading
			addClassShow: false, //显示添加分类
			firValue: "", //一级分类
			secValue: "", //二级分类
			thiValue: "", //三级分类
			optionsfir: [], //一级分类列表
			optionssec: [], //二级分类列表
			multipleSelection: [], //选中项
		};
	},
	created() {},
	computed: {},
	
	mounted() {
		this.getClasslist();
	},
	

	methods: {
		// 获取分类列表
		getClasslist() {
			this.loading = true;
			this.tableData = [];
			GetOwnCategory()
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						res.body.map((item) => {
							let _item = {
								first: item[0].typename ? item[0].typename : "-",
								second: item[1].typename ? item[1].typename : "-",
								third: item[2].typename ? item[2].typename : "-",
								id: item[2].id
									? item[2].id
									: item[1].id
									? item[1].id
									: item[0].id,
							};
							this.tableData.push(_item);
						});
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 删除分类
		deleteClass(id) {
			this.$confirm("确定删除此视频吗？")
				.then(() => {
					this.loading = true;
					this.delCaetgorys([id]);
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 批量删除
		deleteClasses() {
			let _data = [];
			this.multipleSelection.map((item) => {
				_data.push(item.id);
			});
			this.$confirm("确定删除选中的视频吗？")
				.then(() => {
					this.alldelload = true;
					this.delCaetgorys(_data);
				})
				.catch(() => {
					this.alldelload = false;
				});
		},
		// 删除接口
		delCaetgorys(ids) {
			DelCategory(ids).then((res) => {
				this.loading = false;
				this.alldelload = false;
				if (res.code == 0) {
					this.$message.success("操作成功");
					setTimeout(() => {
						this.getClasslist();
					}, 1000);
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 添加分类弹窗
		addNewCategary() {
			this.addClassShow = true;
			this.getCategarys(0);
		},
		// 获取分类接口
		getCategarys(id) {
			GetCategory(id).then((res) => {
				if (res.code == 0) {
					if (id == 0) {
						this.optionsfir = res.body;
					} else {
						this.optionssec = res.body;
					}
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 选择一级分类
		chooseFirClass(value) {
			this.getCategarys(value);
		},
		saveSubmit() {
			if (this.thiValue) {
				this.$confirm("确定新增本条自定义分类吗？")
					.then(() => {
						this.subloading = true;
						let _id = this.secValue
							? this.secValue
							: this.firValue
							? this.firValue
							: 0;
						PostCategory(_id, this.thiValue).then((res) => {
							this.subloading = false;
							if (res.code == 0) {
								this.$message.success("保存成功！");
								this.thiValue = "";
								this.addClassShow = false;
								this.getClasslist();
							} else {
								this.$message.error(res.msg);
							}
						});
					})
					.catch((err) => {
						this.subloading = false;
						this.$message.error(err);
					});
			} else {
				this.$message.error("请输入分类名称");
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.table-operate {
	margin-bottom: 10px;
}
.class-box {
	height: calc(100% - 186px);
}

.class-item {
	margin-bottom: 15px;
	.el-form-item__label {
		width: 100px;
		text-align: right;
	}
	.el-input {
		width: 30%;
		max-width: 193px;
	}
}
</style>
