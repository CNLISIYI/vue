<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="productedit" :asideIdx="['0']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 批量编辑产品 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p class="red">
									请慎重使用此功能；此功能使用后对产品的最终修改将无法挽回，使用前请反复确认确保产品无误！
								</p>
								<p>请先选择产品类型，再按步进行操作。</p>
								<p>
									主图图片的修改中，若只填写了旧URL（或关键词），新URL（或关键词）留空，则会<span
										class="red"
										>删除</span
									>旧URL（或关键词）。标题关键词、详情关键词的修改同理
								</p>
							</div>
							<el-form
								:model="ruleForm"
								ref="form"
								label-width="100px"
								class="demo-ruleForm"
							>
								<!-- 产品类型 -->
								<el-form-item label="产品类型">
									<el-radio-group
										v-model="ruleForm.sell_type"
										@change="chooseSellType"
									>
										<el-radio label="1">上架产品</el-radio>
										<el-radio label="0">下架产品</el-radio>
									</el-radio-group>
								</el-form-item>
								<!-- 产品数量 -->
								<el-form-item label="产品数量" v-if="productshow">
									<el-radio-group
										v-model="ruleForm.sell_all"
										@change="chooseType"
									>
										<el-radio label="1">全部产品</el-radio>
										<el-radio label="0">选择产品</el-radio>
									</el-radio-group>
									<div v-if="ruleForm.sell_all == 1">
										<p class="input-txt" v-loading="loading">
											已选<span class="red">{{ total }}</span
											>条
										</p>
									</div>
									<div v-if="ruleForm.sell_all == 0">
										<div class="table-operate">
											<p class="input-txt" v-loading="loading">
												已选<span class="red">{{ sell_ids.length }}</span
												>条
											</p>
										</div>
										<!-- 搜索产品 -->
										<div class="table-search">
											<el-input
												placeholder="请搜索产品关键词"
												v-model="searchword"
												class="input-with-select"
											>
												<el-button
													slot="append"
													icon="el-icon-search"
													@click="getAllProduct(1, searchword)"
												></el-button>
											</el-input>
											<el-button
												class="clear-search"
												slot="append"
												@click="clearSearch"
												>清空搜索</el-button
											>
										</div>
										<!-- 表格 -->
										<el-table
											:data="tableData"
											border
											style="width: 100%"
											@selection-change="handleSelectionChange"
											v-loading="loading"
											ref="multipleTable"
										>
											<el-table-column
												:resizable="false"
												type="selection"
												width="50"
												align="center"
											></el-table-column>
											<el-table-column
												:resizable="false"
												fixed
												label="产品ID"
												width="100"
												align="center"
											>
												<template slot-scope="scope">
													<span>{{ scope.row.id }}</span>
												</template>
											</el-table-column>
											<el-table-column :resizable="false" label="标题">
												<template slot-scope="scope">
													<el-popover placement="top-end" trigger="hover">
														<div class="img-box">
															<img :src="scope.row.picture" />
														</div>
														<a
															slot="reference"
															@click="$tools.openProduct(scope.row.id)"
														>
															<span>{{ scope.row.title }}</span>
														</a>
													</el-popover>
												</template>
											</el-table-column>
											<el-table-column
												:resizable="false"
												label="更新时间"
												width="180"
												align="center"
											>
												<template slot-scope="scope">
													<span>{{ scope.row.update_time }}</span>
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
									</div>
								</el-form-item>
								<div v-if="ruleForm.sell_all == 1 || sell_ids.length > 0">
									<!-- 产品分类 -->
									<el-form-item label="主营分类">
										<div class="dis-inline">
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
											<p class="input-txt">如果不修改分类请不要选择</p>
										</div>
									</el-form-item>
									<!-- 品牌 -->
									<el-form-item label="品牌">
										<el-input
											v-model="ruleForm.brand"
											placeholder="品牌出现在标题中可以增加产品质量分"
										></el-input>
									</el-form-item>
									<!-- 供货总量 -->
									<el-form-item label="供货总量">
										<el-input
											v-model="ruleForm.maxamount"
											type="number"
											placeholder="请输入供货总量数字"
											class="widsmall"
										></el-input>
									</el-form-item>
									<!-- 计量单位 -->
									<el-form-item label="计量单位">
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
									<!-- 报价方式 -->
									<el-form-item label="报价方式">
										<el-radio-group v-model="quoteway" @change="choosequote">
											<el-radio label="1">按产品数量报价</el-radio>
											<el-radio label="0">面议</el-radio>
										</el-radio-group>
									</el-form-item>
									<!-- 价格区间 -->
									<el-form-item label="价格区间" v-if="quoteway == '1'">
										<div
											class="el-button el-button--primary is-plain"
											@click="addPriceItem"
										>
											添加价格区间
										</div>
										<p class="input-txt">
											第一条为最小起订量，即买家购买商品数量的最低门槛；一旦修改价格不论是否是区间都将受影响
										</p>
										<div
											v-for="(item, index) in priceitem"
											:key="index"
											class="param-item"
										>
											<el-input
												v-model="item.n"
												placeholder="请输入起订量"
												class="line-input"
											></el-input>
											<el-input
												v-model="item.v"
												class="line-input"
												placeholder="请输入区间单价"
											></el-input>
											<el-button
												v-if="index > 0"
												@click.prevent="removePriceItem(index)"
												>删除</el-button
											>
										</div>
									</el-form-item>
									<div v-else>
										<!-- 产品单价 -->
										<el-form-item label="产品单价">
											<el-input
												v-model="ruleForm.price"
												type="number"
												placeholder="请输入产品单价数字"
												class="widsmall"
											></el-input>
										</el-form-item>
										<!-- 最小起订 -->
										<el-form-item label="最小起订">
											<el-input
												v-model="ruleForm.minamount"
												type="number"
												placeholder="请输入最小起订数字"
												class="widsmall"
											></el-input>
										</el-form-item>
									</div>
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
									<!-- 主图图片 -->
									<el-form-item label="主图图片">
										<el-input
											v-model="ruleForm.picture_old"
											placeholder="请填写【旧】主图图片URL"
										></el-input>
										<p class="input-txt">
											替换主图中某一张图片，如果不需要修改则留空
										</p>
										<el-input
											v-model="ruleForm.picture_new"
											placeholder="请填写【新】主图图片URL"
											class="mt6"
										></el-input>
									</el-form-item>
									<!-- 标题关键词 -->
									<el-form-item label="标题关键词">
										<el-input
											v-model="ruleForm.title_old"
											placeholder="请填写标题中的【旧】关键词"
										></el-input>
										<p class="input-txt">
											替换标题中的某些词，如果不需要修改则留空
										</p>
										<el-input
											v-model="ruleForm.title_new"
											placeholder="请填写标题中的【新】关键词"
											class="mt6"
										></el-input>
									</el-form-item>
									<!-- 详情关键词 -->
									<el-form-item label="详情关键词">
										<el-input
											v-model="ruleForm.detail_old"
											placeholder="请填写详情中的【旧】关键词"
										></el-input>
										<p class="input-txt">
											替换详情中的某些词，如果不需要修改则留空
										</p>
										<el-input
											v-model="ruleForm.detail_new"
											placeholder="请填写详情中的【新】关键词"
											class="mt6"
										></el-input>
									</el-form-item>

									<div class="submit-btn">
										<el-button
											type="primary"
											@click="submitForm"
											v-loading="subloading"
											element-loading-spinner="el-icon-loading"
											>确定执行</el-button
										>
									</div>
								</div>
							</el-form>
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
	GetVideoList,
	GetCategorys,
	GetAllProduct,
	PostSellBatch,
} from "../../api/apis";
import { mapState } from "vuex";

export default {
	name: "AppProductEdit",
	inject: ["reload"],
	data() {
		return {
			loading: false, //分类loading
			subloading: false, //提交loading
			videoload: false, //视频loading
			classOption: [], //常用类别
			classify: "", //分类
			videoOption: [], //视频列表
			videoUrl: "", //视频url
			ruleForm: {},
			priceitem: [{}], //价格区间
			tableData: [], //商品列表
			total: 0,
			currentPage: 1,
			productshow: false, //选择产品
			sell_ids: [], //选中产品id
			searchword: "", //搜索关键词
			quoteway: "1", //报价方式
		};
	},

	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},

	mounted() {
		this.getVideolist();
		this.getCategory();
	},
	destroyed() {
		this.tableData = [];
	},

	methods: {
		// 获取常用分类
		getCategory() {
			this.classOption = [];
			GetCategorys()
				.then((res) => {
					if (res.code == 0) {
						res.body.map((item) => {
							let i = 1,
								_res = item[0].catname,
								_val = [item[0].catid];
							while (i < item.length) {
								if (item[i].catname) {
									_res += `/${item[i].catname}`;
									_val.push(item[i].catid);
								} else {
									_val.push(item[i].catid);
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
		// 选择产品类型
		chooseSellType() {
			if (this.productshow) {
				this.getAllProduct();
			}
			this.productshow = true;
		},
		chooseType() {
			this.getAllProduct();
		},
		// 获取视频列表
		getVideolist() {
			this.videoload = true;
			GetVideoList()
				.then((res) => {
					this.videoload = false;
					if (res.code == 0) {
						this.videoOption = res.body;
						this.videoOption.unshift({
							id: -1,
							title: "随机视频",
							video: "",
						});
					} else {
						this.videoload = false;
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.videoload = false;
					this.$message.error(err);
				});
		},
		// 选择视频
		videoSelect(value) {
			this.videoOption.map((item) => {
				if (value == item.id) {
					this.videoUrl = item.video;
				}
			});
		},
		// 设置价格区间
		addPriceItem() {
			this.priceitem.length < 5
				? this.priceitem.push({
						n: "",
						v: "",
				  })
				: this.$message.error("最多只能设置5个价格区间！");
		},
		removePriceItem(index) {
			this.priceitem.splice(index, 1);
		},
		// 选择产品
		handleSelectionChange(val) {
			this.sell_ids = [];
			val.map((item) => {
				this.sell_ids.push(item.id);
			});
		},
		// 选择报价方式
		choosequote(value) {
			if (value == "1") {
				this.ruleForm.minamount = "";
				this.ruleForm.price = "";
			} else {
				this.priceitem = [{}];
			}
		},
		// 获取全部商品
		getAllProduct(page, keyword) {
			let _keyword = keyword ? keyword : "",
				_page = page ? page : 1,
				_status = this.ruleForm.sell_type == 1 ? 3 : 0;
			this.loading = true;
			this.tableData = [];
			GetAllProduct(_status, _page, _keyword).then((res) => {
				this.loading = false;
				if (res.code == 0) {
					this.total = res.body.page.count;
					this.tableData = res.body.list;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 清空搜索
		clearSearch() {
			this.searchword = "";
			this.currentPage = 1;
			this.getAllProduct();
		},
		// 选择页码
		handleChange(val) {
			this.currentPage = val;
			this.getAllProduct(val, this.searchword);
		},
		// 提交表单
		submitForm() {
			let _p = true,
				_form = JSON.parse(JSON.stringify(this.ruleForm));
			this.priceitem.map((item, index) => {
				if (index > 0 && !item.n && !item.v) {
					this.priceitem.splice(index, 1);
				}
				if (item.n && item.v) {
					item.n = item.n.toString();
					item.v = item.v.toString();
				} else {
					_p = false;
				}
			});
			if (
				!this.classify &&
				!_form.brand &&
				!_form.maxamount &&
				!_form.unit &&
				!this.videoUrl &&
				!_form.price &&
				!_form.minamount &&
				!_p &&
				!_form.picture_old &&
				!_form.picture_new &&
				!_form.title_old &&
				!_form.title_new &&
				!_form.detail_old &&
				!_form.detail_new
			) {
				this.$message.error("请至少修改一个信息后再提交");
			}
			// else if (
			// 	(_form.minamount && !_form.price) ||
			// 	(!_form.minamount && _form.price) ||
			// 	!_p
			// ) {
			// 	this.$message.error("请填写单价和最小起订，或完整的价格区间");
			// }
			else {
				_form.category_id = this.classify;
				_form.sell_all = this.ruleForm.sell_all == 1 ? 1 : this.keyword ? 2 : 0;
				_form.sell_ids = JSON.stringify(this.sell_ids);
				if (this.quoteway == "1") {
					_form.minamount = this.priceitem[0].n
						? parseInt(this.priceitem[0].n)
						: 0;
					_form.price = this.priceitem[0].v
						? parseInt(this.priceitem[0].v)
						: "";
					_form.priceitem = this.priceitem[0].v
						? JSON.stringify(this.priceitem)
						: "";
				} else {
					_form.priceitem = _form.price
						? JSON.stringify([
								{
									n: _form.minamount.toString(),
									v: _form.price.toString(),
								},
						  ])
						: "";
				}
				this.subloading = true;
				PostSellBatch(_form)
					.then((res) => {
						this.subloading = false;
						if (res.code == 0) {
							this.$message.success("批量操作成功");
							this.reload();
						} else {
							this.subloading = false;
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
.el-pagination {
	margin-bottom: 20px !important;
}
/deep/ .el-input {
	max-width: 276px;
}
/deep/ .el-input__inner {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	display: inline-block;
	max-width: 276px;
}

.line-input {
	display: inline-block;
	max-width: 193px;
	vertical-align: middle;
}

.input-txt {
	display: inline-block;
	vertical-align: middle;
	margin-left: 5px;
	font-size: 14px;
	color: #909399;
	margin-right: 20px;
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
.block {
	display: block;
}

.param-item {
	margin-top: 6px;
}

.submit-btn {
	text-align: center;
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

.el-input-group {
	max-width: 300px !important;
	vertical-align: middle;
}
.el-table .cell a {
	text-overflow: ellipsis;
	white-space: nowrap;
}
.el-table tr:hover {
	.edit-btn {
		color: #fff !important;
		text-decoration: none !important;
	}
}
/deep/ .el-form-item__content .el-input-group {
	vertical-align: middle !important;
}
/deep/ .el-drawer__header {
	padding-bottom: 20px;
}
.img-box {
	width: 125px;
	height: 125px;
	img {
		width: 100%;
		height: 100%;
	}
}
.mt6 {
	margin-top: 6px;
	display: block;
}
</style>
