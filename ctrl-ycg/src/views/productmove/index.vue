<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="productmove" :asideIdx="['1']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<span slot="label"> 搬家优化 </span>
							<div class="table-operate">
								<div v-if="!haskey">
									<p>您尚未配置相关信息，请点击配置。</p>
									<el-button type="primary" @click="keyshow = true"
										>配置密钥</el-button
									>
								</div>
								<div v-else>
									<el-button type="primary" @click="keyshow = true"
										>查看配置</el-button
									>
									<el-button
										type="primary"
										@click="navicheck"
										v-loading="checkload"
										element-loading-spinner="el-icon-loading"
										>同步授权</el-button
									>
									<el-button type="primary" @click="openMovepop"
										>产品搬家</el-button
									>
								</div>
							</div>
							<el-table
								:data="tableData"
								border
								style="width: 100%"
								v-loading="loading"
							>
								<el-table-column
									:resizable="false"
									fixed
									label="产品ID"
									width="140"
									align="center"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.productId }}</span>
									</template>
								</el-table-column>
								<el-table-column :resizable="false" label="标题">
									<template slot-scope="scope">
										<a
											slot="reference"
											@click="$tools.open1688Pro(scope.row.productId)"
										>
											<span>{{ scope.row.subject }}</span>
										</a>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="状态"
									width="100"
									align="center"
								>
									<template slot-scope="scope">
										<span v-if="scope.row.status == 0" class="green">可用</span>
										<span v-else-if="scope.row.status == 1" class="orange"
											>已使用</span
										>
										<span v-else-if="scope.row.status == 2">发布中</span>
									</template>
								</el-table-column>
								<el-table-column
									:resizable="false"
									label="更新时间"
									align="center"
									width="200px"
								>
									<template slot-scope="scope">
										<span>{{ scope.row.updated_at }}</span>
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
							<el-drawer title="配置密钥" :visible.sync="keyshow" size="80%">
								<div class="tips">
									<p>注意：配置成功后将不可再次修改</p>
								</div>
								<el-form
									:model="userForm"
									ref="form"
									label-width="100px"
									class="demo-ruleForm"
								>
									<el-form-item label="APP_KEY">
										<el-input
											v-model="userForm.userkey"
											placeholder="请填写APP_KEY"
											class="mid-input"
											:disabled="haskey ? true : false"
										></el-input>
									</el-form-item>
									<el-form-item label="SECRET">
										<el-input
											v-model="userForm.usersecret"
											placeholder="请填写SECRET"
											class="mid-input"
											:disabled="haskey ? true : false"
										></el-input>
									</el-form-item>
								</el-form>
								<div class="sub-btn">
									<el-button
										type="primary"
										@click="keySubmit"
										v-loading="keyloading"
										element-loading-spinner="el-icon-loading"
										v-if="!haskey"
										>保存配置</el-button
									>
								</div>
							</el-drawer>
							<el-drawer
								title="选择迁移产品，补充产品信息"
								:visible.sync="moveshow"
								size="80%"
							>
								<div class="tips">
									<p>
										若您的商品属于
										<span class="red"
											>医疗器械、兽药、危险化学品、农药、保健品</span
										>
										这五大类需要进行行业资质备案，否则商品不予展现，详情点击
										<a
											@click="
												$tools.openUrl('http://yuncaigou.net/help.html?id=5')
											"
											>《特殊行业资质备案规范》</a
										>
									</p>
								</div>
								<el-form
									:model="ruleForm"
									ref="form"
									label-width="100px"
									class="demo-ruleForm"
								>
									<!-- 产品分类 -->
									<el-form-item label="产品分类" required>
										<!-- 产品分类 搜索 -->
										<div v-if="sClassShow" class="dis-inline">
											<el-select
												v-model="classify"
												filterable
												remote
												placeholder="请输入关键词"
												:remote-method="remoteMethod"
												:loading="searchloading"
											>
												<el-option
													v-for="(item, index) in searchList"
													:key="index"
													:label="item.label"
													:value="item.value"
												>
												</el-option>
											</el-select>
											<p class="input-txt">
												点击<a
													@click="
														sClassShow = false;
														classify = '';
													"
													>选择常用分类</a
												>
											</p>
										</div>
										<!-- 产品分类 常用 -->
										<div class="dis-inline" v-else>
											<el-select
												v-model="classify"
												placeholder="请选择常用分类"
											>
												<el-option
													v-for="(item, index) in classOption"
													:key="index"
													:label="item.label"
													:value="item.value"
												>
												</el-option>
											</el-select>
											<p class="input-txt">
												没找到？点击<a
													@click="
														sClassShow = true;
														classify = '';
													"
													>搜索全部分类</a
												>
											</p>
										</div>
									</el-form-item>
									<!-- 产品关键词 -->
									<el-form-item label="产品关键词" required>
										<el-input
											v-model="keywords[0]"
											placeholder="输入第一个核心关键词"
											class="line-input"
										></el-input>
										<el-input
											v-model="keywords[1]"
											class="line-input"
											placeholder="输入第二个核心关键词"
										></el-input>
										<div
											class="el-button el-button--primary is-plain ml26"
											@click="morekeyshow = !morekeyshow"
										>
											点击填写更多关键词
										</div>
									</el-form-item>
									<!-- 产品关键词 更多 -->
									<el-form-item label="" v-if="morekeyshow">
										<el-input
											v-model="keywords[2]"
											class="line-input"
											placeholder="输入第三个核心关键词"
										></el-input>
										<el-input
											v-model="keywords[3]"
											class="line-input"
											placeholder="输入第四个核心关键词"
										></el-input>
										<el-input
											v-model="keywords[4]"
											class="line-input"
											placeholder="输入第五个核心关键词"
										></el-input>
									</el-form-item>
									<!-- 品牌 -->
									<el-form-item label="品牌" required>
										<el-input
											v-model="ruleForm.brand"
											placeholder="品牌出现在标题中可以增加产品质量分"
										></el-input>
									</el-form-item>
									<!-- 计量单位 -->
									<el-form-item label="计量单位" required>
										<el-select
											v-model="ruleForm.unit"
											placeholder="请选择计量单位"
											filterable
										>
											<el-option
												v-for="(item, index) in $state.unitOption"
												:key="index"
												:label="item.label"
												:value="item.label"
											>
											</el-option>
										</el-select>
									</el-form-item>
									<!-- 选择产品 -->
									<el-form-item label="迁移产品" required>
										<el-transfer
											filterable
											:filter-method="filterMethod"
											filter-placeholder="请输入产品名称"
											v-model="moveList"
											:data="moveData"
											:props="{
												key: 'id',
												label: 'subject',
											}"
											v-loading="moveloading"
											:titles="[
												'可迁移产品（点击全部迁移）',
												'选中产品（点击全部移出）',
											]"
											@left-check-change="selectMove"
											@right-check-change="deleteMove"
										>
										</el-transfer>
									</el-form-item>
									<!-- 选填 -->
									<p class="input-txt showmore-txt">
										<a>以下为选填内容</a>
									</p>
									<div>
										<!-- 特性词 -->
										<el-form-item label="特性词">
											<el-input
												v-model="ruleForm.character"
												placeholder="填写产品特性词，最多8个汉字"
												maxlength="8"
												@input="
													ruleForm.character = $tools.onlyChinese(
														ruleForm.character
													)
												"
											></el-input>
										</el-form-item>
										<!-- 主推理由 -->
										<el-form-item label="主推理由">
											<el-input
												class="mid-input"
												v-model="ruleForm.selling_point1"
												placeholder="推荐词1，输入6到10个汉字"
												minlength="6"
												maxlength="10"
												@input="
													ruleForm.selling_point1 = $tools.onlyChinese(
														ruleForm.selling_point1
													)
												"
											></el-input>
											<el-input
												class="mid-input"
												v-model="ruleForm.selling_point2"
												placeholder="推荐词2，输入6到10个汉字"
												minlength="6"
												maxlength="10"
												@input="
													ruleForm.selling_point2 = $tools.onlyChinese(
														ruleForm.selling_point2
													)
												"
											></el-input>
											<el-input
												class="mid-input"
												v-model="ruleForm.selling_point3"
												placeholder="推荐词3，输入6到10个汉字"
												minlength="6"
												maxlength="10"
												@input="
													ruleForm.selling_point3 = $tools.onlyChinese(
														ruleForm.selling_point3
													)
												"
											></el-input>
											<div class="xt-txt">
												<p class="input-txt">
													1.禁止对商品进行夸大性评价，客观陈述商品亮点信息；
												</p>
												<p class="input-txt">
													2.请勿对商品进行正品、包邮、最低价等承诺；
												</p>
												<p class="input-txt">
													3.注意是对商品的亮点进行陈述，而非介绍商家；
												</p>
												<p class="input-txt">
													4.对于不同商品，请根据商品特点填写不同的亮点。
												</p>
											</div>
										</el-form-item>
										<!-- 产品视频 -->
										<el-form-item label="产品视频">
											<el-select
												v-model="ruleForm.video_id"
												filterable
												placeholder="请选择产品视频"
												@change="videoSelect"
											>
												<el-option
													v-for="item in videoOption"
													:key="item.id"
													:label="item.title"
													:value="item.id"
												>
												</el-option>
											</el-select>
											<p class="input-txt">请先去视频管理中上传视频</p>
											<div class="video-box" v-if="videoUrl">
												<video :src="videoUrl" controls="controls"></video>
											</div>
										</el-form-item>
									</div>
								</el-form>
								<div class="submit-btn">
									<el-button
										type="primary"
										@click="submitForm"
										v-loading="subloading"
										element-loading-spinner="el-icon-loading"
										>保存信息</el-button
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
	getAliList,
	getAliUser,
	PostAliKey,
	getAliCheck,
	PostAliToken,
	getAliSync,
	GetCategorys,
	GetVideoList,
	getAliMovelist,
	PostAliMove,
	GetCateSearch,
} from "../../api/apis";
import { mapState } from "vuex";

export default {
	name: "AppProductMove",
	data() {
		return {
			loading: false, //loading
			tableData: [], //问价消息
			currentPage: 1, //页码
			total: 0, //数量
			userkey: "", //appkey
			usersecret: "", //secret
			keyshow: false, //打开配置
			userForm: {}, //user表单
			ruleForm: {}, //key表单
			keyloading: false, //配置loading
			haskey: true, //是否配置
			checkload: false, //授权loading
			code: "", //授权code
			token: "", //授权token
			backurl: window.location.href + "&state=return", //返回url
			moveshow: false, //迁移产品弹窗
			keywords: [], //关键词
			formCopy: {}, //提交表单
			classOption: [], //常用类别
			videoOption: [], //视频列表
			videoUrl: "", //选中视频
			classify: "", //分类
			morekeyshow: false, //更多关键词
			moveData: [], //可迁移列表
			moveList: [], //选中迁移列表
			moveloading: false, //迁移loading
			subloading: false, //提交loading
			sClassShow: false, //显示搜索分类
			searchList: [], //搜索分类列表
			searchloading: false,
		};
	},
	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},

	mounted() {
		this.getuserKey();
		this.get1688list();
		if (this.$route.query.state == "return") {
			this.code = this.$route.query.code;
			this.getToken();
		}
	},
	destroyed() {
		this.tableData = [];
		this.classOption = [];
		this.videoOption = [];
		this.moveData = [];
	},

	methods: {
		// 获取用户配置
		getuserKey() {
			getAliUser().then((res) => {
				if (res.code == 0) {
					this.haskey = res.body.app_key ? true : false;
					if (res.body.app_key) {
						this.userForm.userkey = res.body.app_key;
						this.userForm.usersecret = res.body.secret;
					}
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 配置key
		keySubmit() {
			this.$confirm("确定保存配置信息吗？")
				.then(() => {
					this.keyloading = true;
					PostAliKey(this.userForm.userkey, this.userForm.usersecret)
						.then((res) => {
							this.keyloading = false;
							if (res.code == 0) {
								this.$message.success("保存成功");
								this.keyshow = false;
								this.haskey = true;
								this.get1688list();
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((err) => {
							this.keyloading = false;
							this.$message.error(err);
						});
				})
				.catch(() => {});
		},
		// 获取产品列表
		get1688list(page) {
			this.loading = true;
			let _page = page ? page : 1;
			getAliList(_page).then((res) => {
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
		// 授权
		navicheck() {
			this.checkload = true;
			getAliCheck()
				.then((res) => {
					if (res.code == 0) {
						if (res.body) {
							this.token = res.body.refresh_token;
							this.productSync();
						} else {
							window.location.href = `https://auth.1688.com/oauth/authorize?client_id=${this.userForm.userkey}&site=1688&redirect_uri=${this.backurl}`;
						}
					} else {
						this.checkload = false;
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.checkload = false;
					this.$message.error(err);
				});
		},
		// 获取token
		getToken() {
			this.loading = true;
			this.checkload = false;
			PostAliToken(this.code, this.backurl)
				.then((res) => {
					if (res.code == 0) {
						this.token = res.body.refresh_token;
						this.productSync();
					} else {
						this.loading = false;
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 同步请求
		productSync() {
			this.loading = true;
			this.checkload = false;
			getAliSync()
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 打开产品搬家
		openMovepop() {
			this.moveshow = true;
			if (this.classOption.length == 0) {
				this.getCategory();
			}
			if (this.videoOption.length == 0) {
				this.getVideolist();
			}
			this.getmovelist();
		},
		// 获取常用分类
		getCategory() {
			this.classOption = [];
			GetCategorys()
				.then((res) => {
					if (res.code == 0) {
						res.body.map((item) => {
							let i = 1,
								_res = item[0].catname,
								_val = [item[0].catid.toString()];
							while (i < item.length) {
								if (item[i].catname) {
									_res += `/${item[i].catname}`;
									_val.push(item[i].catid.toString());
								} else {
									_val.push(item[i].catid.toString());
								}
								i++;
							}
							this.classOption.push({
								value: JSON.stringify(_val),
								label: _res,
							});
						});
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
		},
		// 搜索分类
		remoteMethod(query) {
			if (query !== "") {
				this.searchloading = true;
				this.searchList = [];
				GetCateSearch(query)
					.then((res) => {
						if (res.code == 0) {
							this.searchloading = false;
							res.body.map((item) => {
								let _val = [],
									_res = item._source.category_name;
								_val.push(item._source.category_1.toString());
								_val.push(item._source.category_2.toString());
								_val.push(item._source.category_3.toString());
								this.searchList.push({
									value: JSON.stringify(_val),
									label: _res,
								});
							});
						} else {
							this.$message.error(res.msg);
						}
					})
					.catch((err) => {});
			} else {
				this.searchList = [];
			}
		},
		// 获取视频列表
		getVideolist() {
			GetVideoList()
				.then((res) => {
					if (res.code == 0) {
						this.videoOption = res.body;
						this.videoOption.unshift({
							id: 0,
							title: "不选择视频",
							video: "",
						});
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
		},
		// 搜索产品
		filterMethod(query, item) {
			return item.subject.indexOf(query) > -1;
		},
		// 获取迁移列表
		getmovelist() {
			this.moveloading = true;
			getAliMovelist()
				.then((res) => {
					this.moveloading = false;
					if (res.code == 0) {
						this.moveData = res.body;
					} else {
						this.moveloading = false;
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
		},
		// 选中左侧
		selectMove(value, movedKeys) {
			movedKeys.map((item) => {
				this.moveList.push(item.toString());
			});
		},
		// 删除右侧
		deleteMove(value, movedKeys) {
			value.map((vitem) => {
				this.moveList.map((item, index) => {
					if (item == vitem.toString()) {
						this.moveList.splice(index, 1);
					}
				});
			});
		},
		// 选择视频
		videoSelect(value) {
			this.videoOption.map((item) => {
				if (this.ruleForm.video_id == item.id) {
					this.videoUrl = item.video;
				}
			});
		},
		// 翻页
		handleChange(val) {
			this.get1688list(val);
		},
		// 保存
		submitForm() {
			let arr = [];
			this.keywords.map((item) => {
				arr.unshift(item);
			});
			if (
				!this.classify ||
				!this.keywords[0] ||
				!this.keywords[1] ||
				!this.ruleForm.brand ||
				!this.ruleForm.unit
			) {
				this.$message.error("请补充产品相关信息");
			} else if (this.moveList.length == 0) {
				this.$message.error("请选择迁移产品");
			} else {
				let _form = JSON.parse(JSON.stringify(this.ruleForm));
				// 迁移产品类别
				_form.category_id = this.classify;
				// 迁移产品keywords
				_form.hide_keyword = {};
				arr.map((item, index) => {
					_form.hide_keyword[index + 1] = item;
				});
				// 迁移产品ids
				_form.ids = JSON.stringify(this.moveList);
				this.subloading = true;
				PostAliMove(_form)
					.then((res) => {
						this.subloading = false;
						if (res.code == 0) {
							this.$message.success("保存成功");
							this.moveshow = false;
							this.ruleForm = {};
							this.classify = "";
							this.keywords = [];
							this.moveList = [];
							this.videoUrl = "";
						} else {
							this.$message.error(res.msg);
						}
					})
					.catch((err) => {
						this.subloading = false;
						this.$message.error(err);
					});
			}
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
	margin-bottom: 10px;
	p {
		font-weight: 600;
		margin: 15px auto;
		font-size: 16px;
		text-align: center;
	}
}
/deep/ .el-input__inner {
	max-width: 564px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.line-input {
	display: inline-block;
	max-width: 193px;
	vertical-align: middle;
}
.dis-inline {
	display: inline-block;

	.el-button.is-round {
		margin-right: 2px;
		padding: 12px 18px;
	}

	.el-select {
		width: 276px;
	}

	.el-input__inner {
		max-width: 276px;
	}
}
.mid-input {
	max-width: 276px;
}
.showmore-txt {
	margin: 20px 0;
}
/deep/ .el-form {
	padding-bottom: 20px;
}
.submit-btn {
	position: fixed;
	bottom: 20px;
	width: 80%;
	right: 0;
	background: #fff;
	padding: 10px 0px;
	text-align: center;
	z-index: 9999;
}
.video-box {
	max-width: 300px;
	max-height: 300px;
	margin-top: 10px;

	video {
		max-width: 300px;
		max-height: 300px;
	}
}
/deep/ .el-transfer-panel {
	width: 45%;
	margin-right: 20px;
}
/deep/ .el-transfer__buttons,
/deep/ .el-checkbox__input {
	display: none;
}
/deep/ .el-transfer-panel__item {
	display: block;
}
/deep/ .el-checkbox__label {
	padding-left: 4px;
}
/deep/
	.el-transfer-panel
	.el-transfer-panel__header
	.el-checkbox
	.el-checkbox__label {
	font-size: 14px;
}
</style>
