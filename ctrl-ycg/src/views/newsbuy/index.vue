<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="newsbuy" :asideIdx="['5']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card" :value="tabnum" @tab-click="handleClick">
						<el-tab-pane name="1">
							<!-- 标签标题 -->
							<span slot="label"> 求购列表 </span>
							<el-table
								:data="tableData"
								border
								style="width: 100%"
								v-loading="loading"
							>
								<el-table-column
									:resizable="false"
									label="求购名称"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.title }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="添加时间"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ $tools.timeToDate(scope.row.addtime) }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="修改时间"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ $tools.timeToDate(scope.row.edittime) }}</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="操作"
									fixed="right"
									width="140px"
									align="center"
								>
									<template slot-scope="scope">
										<el-button
											size="mini"
											type="warning"
											@click="editNews(scope.row.id)"
											>编辑</el-button
										>
										<el-button
											size="mini"
											type="danger"
											@click="deleteNews(scope.row.id)"
											>删除</el-button
										>
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
						<el-tab-pane name="2">
							<!-- 标签标题 -->
							<span slot="label"> 发布求购 </span>
							<el-form
								:model="ruleForm"
								ref="form"
								label-width="100px"
								class="demo-ruleForm"
							>
								<!-- 求购分类 -->
								<el-form-item label="求购分类" required>
									<el-select
										v-model="ruleForm.catid"
										filterable
										remote
										reserve-keyword
										placeholder="请输入选择求购分类"
										:remote-method="remoteMethod"
										:loading="classload"
									>
										<el-option
											v-for="(item, index) in classOption"
											:key="index"
											:label="item.category_name"
											:value="item.category_id"
										>
										</el-option>
									</el-select>
								</el-form-item>
								<!-- 求购标题 -->
								<el-form-item label="求购标题" required>
									<el-input
										v-model="ruleForm.title"
										class="big-input"
										placeholder="请输入求购标题"
									></el-input>
								</el-form-item>
								<!-- 求购数量 -->
								<el-form-item label="求购数量" v-if="!amountvalid" required>
									<el-input
										v-model="ruleForm.amount"
										placeholder="请填写求购数量；如：100吨"
									></el-input>
								</el-form-item>
								<!-- 不限数量 -->
								<el-form-item label="不限数量">
									<el-switch v-model="amountvalid"></el-switch>
								</el-form-item>
								<!-- 求购价格 -->
								<el-form-item label="求购价格" v-if="!pricevalid" required>
									<el-input
										v-model="ruleForm.price"
										type="number"
										placeholder="请填写求购价格"
									></el-input>
								</el-form-item>
								<!-- 面议 -->
								<el-form-item label="面议">
									<el-switch v-model="pricevalid"></el-switch>
								</el-form-item>
								<!-- 有效期 -->
								<el-form-item label="有效期" v-if="!daysvalid" required>
									<el-input
										v-model="ruleForm.days"
										type="number"
										placeholder="请输入求购过期天数"
									></el-input>
								</el-form-item>
								<!-- 长期有效 -->
								<el-form-item label="长期有效">
									<el-switch v-model="daysvalid"></el-switch>
								</el-form-item>
								<!-- 缩略图 -->
								<el-form-item label="缩略图">
									<Applistupload :max="3" ref="listupload"></Applistupload>
								</el-form-item>
								<!-- 求购详情 -->
								<el-form-item label="求购详情" class="editor-box" required>
									<div id="pro-editor"></div>
									<div class="el-button el-button--primary el-upload el-upload--text _position">
										<input
											type="file"
											name="file"
											accept="image/png, image/jpeg, image/jpg"
											class="file-input"
											@click="handleImage"
											@change="handlefile($event)"
										/>
										<span>插入图片</span>
									</div>
								</el-form-item>
							</el-form>
							<div class="sub-btn">
								<el-button
									type="primary"
									@click="addSubmit"
									v-loading="subloading"
									element-loading-spinner="el-icon-loading"
									>保存信息</el-button
								>
							</div>
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
	getNewsBuyList,
	DelNewsBuy,
	getNewsBuyInfo,
	getNewsBuyClass,
	PostNewsBuy,
	PostNewsBuyedit,
} from "../../api/apis";
import E from "wangeditor";
import { mapState, mapActions } from "vuex";
export default {
	name: "AppNewsBuy",
	data() {
		return {
			tabnum: "1", //标签页
			loading: false, //loading
			subloading: false, //提交loading
			tableData: [], //询盘消息
			currentPage: 1, //页码
			total: 0, //数量
			editloading: false, //编辑获取信息loading
			editor: "", //富文本
			ruleForm: {},
			daysvalid: false, //长期有效按钮
			pricevalid: false, //价格面议按钮
			amountvalid: false, //不限量按钮
			classlist: [], //分类
			classOption: [], //分类
			classload: false, //搜索分类loading
		};
	},
	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},

	mounted() {
		this.creatEditor();
		this.getnewsList();
	},
	destroyed() {
		this.tableData = []
		this.classlist = [];
		this.classOption = [];
	},

	methods: {
		...mapActions(["getUploadSts"]),
		// 选择图片
		handleImage() {
			this.getUploadSts();
		},
		// 上传图片
		handlefile(e) {
			let _file = e.target.files[0];
			if (_file) {
				this.fileData = {
					name: _file.name,
					file: _file,
					url: window.URL.createObjectURL(_file),
					size: _file.size,
					uploadPath: `newyuncaigou/${this.$state.user_id}/${
						this.$state.user_id
					}_${Math.round(new Date().getTime() / 1000).toString()}_${parseInt(
						Math.random() * 999
					)}.${_file.type.substr(6, 4)}`,
				};

				this.$tools
					.getClient(this.$state.uploadSts)
					.put(this.fileData.uploadPath, this.fileData.file)
					.then((res) => {
						if (res.url) {
							let image_url = res.url.replace(
								/ctrlyuncaigou.oss-cn-beijing.aliyuncs.com/g,
								"image.yuncaigou.net"
							);
							this.editor.cmd.do(
								"insertHTML",
								`<img src="${image_url}" style="max-width:100%;"/>`
							);
						}
					});
			}
		},
		// 富文本
		creatEditor() {
			this.editor = new E(document.getElementById("pro-editor"));
			this.editor.config.height = 450;
			this.editor.config.excludeMenus = [
				"backColor",
				"link",
				"list",
				"todo",
				"quote",
				"emoticon",
				"video",
				"table",
				"code",
			];
			this.editor.config.showFullScreen = false;
			this.editor.create(); // 创建富文本实例
		},
		handleClick(tab) {
			this.tabnum = tab.name;
			if (tab.name == "2") {
				this.getnewsClass();
			}
		},
		// 获取求购列表
		getnewsList(page) {
			this.loading = true;
			let _page = page ? page : 1;
			getNewsBuyList(_page).then((res) => {
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
		// 获取求购分类
		getnewsClass() {
			this.classload = true;
			getNewsBuyClass()
				.then((res) => {
					this.classload = false;
					if (res.code == 0) {
						if (res.body) {
							this.classlist = res.body;
						} else {
							this.$message.error("暂无数据");
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.classload = false;
					this.$message.error(err);
				});
		},
		remoteMethod(query) {
			if (query !== "") {
				this.classload = true;
				setTimeout(() => {
					this.classload = false;
					this.classOption = this.classlist.filter((item) => {
						return item.category_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
					});
				}, 200);
			} else {
				this.classOption = [];
			}
		},
		// 删除求购
		deleteNews(id) {
			this.$confirm("确定删除本条信息吗？")
				.then(() => {
					this.loading = true;
					DelNewsBuy(id)
						.then((res) => {
							this.loading = false;
							if (res.code == 0) {
								this.$message.success("操作成功");
								this.getnewsList(this.currentPage);
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
		// 翻页
		handleChange(val) {
			this.getnewsList(val);
		},
		// 获取求购编辑信息
		editNews(id) {
			this.tabnum = "2";
			this.editloading = true;
			getNewsBuyInfo(id)
				.then((res) => {
					this.editloading = false;
					if (res.code == 0) {
						this.ruleForm = res.body;
						if (res.body.amount == "不限") {
							this.amountvalid = true;
						}
						if (res.body.days == 0) {
							this.daysvalid = true;
						}
						if (res.body.price == "面议") {
							this.pricevalid = true;
						}
						this.$refs.listupload.imgList = res.body.thumbs
							? res.body.thumbs.split(",")
							: [];
						this.editor.txt.html(res.body.content);
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.editloading = false;
					this.$message.error(err);
				});
		},
		// 保存求购
		addSubmit() {
			let _form = JSON.parse(JSON.stringify(this.ruleForm));
			_form.amount = this.amountvalid ? "不限" : _form.amount;
			_form.days = this.daysvalid ? 0 : _form.days;
			_form.price = this.pricevalid ? "面议" : _form.price;
			_form.thumbs = JSON.stringify(this.$refs.listupload.imgList);
			_form.content = this.editor.txt.html();
			this.subloading = true;
			if (
				!_form.title ||
				!_form.catid ||
				!_form.content ||
				!_form.amount ||
				!(parseInt(_form.days) >= 0) ||
				!_form.price ||
				!_form.thumbs
			) {
				this.subloading = false;
				this.$message.error("请填写求购相关信息");
			} else {
				if (_form.id) {
					PostNewsBuyedit(_form)
						.then((res) => {
							this.subloading = false;
							if (res.code == 0) {
								this.$message.success("保存成功");
								this.tabnum = "1";
								this.ruleForm = {};
								this.getnewsList(this.currentPage);
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((err) => {
							this.subloading = false;
							this.$message.error(err);
						});
				} else {
					PostNewsBuy(_form)
						.then((res) => {
							this.subloading = false;
							if (res.code == 0) {
								this.$message.success("保存成功");
								this.tabnum = "1";
								this.ruleForm = {};
								this.getnewsList(this.currentPage);
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((err) => {
							this.subloading = false;
							this.$message.error(err);
						});
				}
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
/deep/ .el-input__inner {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	max-width: 300px;
}
.big-input {
	/deep/ .el-input__inner {
		max-width: 500px;
	}
}
/deep/ .el-select {
	width: 300px;
}

.editor-box {
	position: relative;

	._position {
		position: absolute;
		right: 20px;
		top: 8px;
		z-index: 3;
		padding: 6px 15px;
	}
}

#pro-editor {
	height: 500px;
}

/deep/ .w-e-text-container {
	z-index: 1 !important;
}

/deep/ .w-e-toolbar {
	z-index: 2 !important;
}

/deep/ .w-e-panel-container {
	display: none !important;
}
</style>
