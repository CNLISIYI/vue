<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="productpost" :asideIdx="['1']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 发布商品信息 </span>
							<!-- 页面内容 -->
							<div class="tips">
								<p>产品关键词最少填写2个，最多填写5个，不能包含英文逗号","</p>
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
								<router-link
									class="el-button el-button--danger is-round"
									:to="{ name: 'myability' }"
									>去上传我的行业资质</router-link
								>
							</div>
							<el-form
								:model="ruleForm"
								ref="form"
								label-width="100px"
								class="demo-ruleForm"
								:v-loading="isedit ? editloading : ''"
							>
								<!-- 产品标题 -->
								<el-form-item label="产品标题" required>
									<el-input
										v-model="ruleForm.title"
										placeholder="请按照 ‘产品品牌+产品名称+型号+产品特性及描述’ 填写标题，标题质量高才能实现展示"
										maxlength="100"
									></el-input>
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
											:loading="loading"
											@change="selectClass"
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
									<div v-else class="dis-inline">
										<el-select
											v-model="classify"
											placeholder="请选择常用分类"
											@change="selectClass"
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
									<!-- <div
										class="el-button el-button--primary is-plain"
										@click="addOwnClass"
									>
										点击添加自定义分类
									</div> -->
								</el-form-item>
								<!-- 自定义分类 暂时不用-->
								<!-- <el-form-item
									label="自定义分类"
									v-if="ownClassShow"
									class="dis-inline"
								>
									<el-select
										v-model="ruleForm.classifyown"
										placeholder="请选择常用分类"
									>
										<el-option
											v-for="(item, index) in classOwnOption"
											:key="index"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
									<p class="input-txt">
										如果没有您的分类，点击这里去<router-link
											:to="{ name: 'manageclass' }"
											target="_blank"
											>设置我的分类</router-link
										>
									</p>
								</el-form-item> -->
								<!-- 品牌 -->
								<el-form-item label="品牌" required>
									<el-input
										v-model="ruleForm.brand"
										placeholder="品牌出现在标题中可以增加产品质量分"
									></el-input>
								</el-form-item>
								<!-- 参数 -->
								<el-form-item label="产品参数" required>
									<div
										class="el-button el-button--primary is-plain"
										@click="addParamsItem"
									>
										点击添加更多参数
									</div>
									<p class="input-txt">
										参数至少要填写5个，不要重复使用，否则会对您的产品质量造成很大的影响
									</p>
									<div
										v-for="(item, index) in formParams"
										:key="index"
										class="param-item"
									>
										<el-input
											v-model="item.n"
											:placeholder="`请输入参数名${index + 1}`"
											class="line-input"
										></el-input>
										<el-input
											v-model="item.v"
											class="line-input"
											:placeholder="`请输入参数值${index + 1}`"
										></el-input>
										<el-button
											v-if="index > 4"
											@click.prevent="removeParamsItem(index)"
											>删除</el-button
										>
									</div>
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
								<!-- 报价方式 -->
								<el-form-item label="报价方式" required>
									<el-radio-group v-model="quoteway">
										<el-radio label="1">按产品数量报价</el-radio>
										<el-radio label="0">面议</el-radio>
									</el-radio-group>
								</el-form-item>
								<!-- 价格区间 -->
								<el-form-item label="价格区间" required v-if="quoteway == '1'">
									<div
										class="el-button el-button--primary is-plain"
										@click="addPriceItem"
									>
										添加价格区间
									</div>
									<p class="input-txt">
										可根据买家采购的不同数量设置不同价格；第一条为最小起订量，即买家购买商品数量的最低门槛
									</p>
									<div
										v-for="(item, index) in priceitem"
										:key="index"
										class="param-item"
									>
										<el-input
											v-model="item.n"
											:placeholder="`请输入起订量`"
											class="line-input"
										></el-input>
										<el-input
											v-model="item.v"
											class="line-input"
											:placeholder="`请输入区间单价`"
										></el-input>
										<el-button
											v-if="index > 0"
											@click.prevent="removePriceItem(index)"
											>删除</el-button
										>
										<p class="input-txt" v-if="item.n && item.v">
											≥{{ item.n
											}}{{ ruleForm.unit ? ruleForm.unit : "个" }}：{{
												item.v
											}}元
										</p>
									</div>
								</el-form-item>
								<div v-else>
									<!-- 产品单价 -->
									<el-form-item label="产品单价" required>
										<el-input
											v-model="ruleForm.price"
											type="number"
											placeholder="请输入产品单价数字"
											class="widsmall"
										></el-input>
									</el-form-item>
									<!-- 最小起订 -->
									<el-form-item label="最小起订" required>
										<el-input
											v-model="ruleForm.detail.minamount"
											type="number"
											placeholder="请输入最小起订数字"
											class="widsmall"
										></el-input>
									</el-form-item>
								</div>
								<!-- 供货总量 -->
								<el-form-item label="供货总量" required>
									<el-input
										v-model="ruleForm.detail.maxamount"
										type="number"
										placeholder="请输入供货总量数字"
										class="widsmall"
									></el-input>
								</el-form-item>
								<!-- 产品图片 -->
								<el-form-item label="产品图片" required>
									<div
										class="el-button el-button--primary is-plain"
										@click="choosePicShow = true"
									>
										选择产品图片
									</div>
									<p class="input-txt">
										至少选择3张图片，最多选择9张图片；不可重复；最佳建议为5张。
									</p>
									<draggable
										v-if="imgList.length > 0"
										:list="imgList"
										:disabled="!enabled"
										class="list-group"
										ghost-class="ghost"
										:move="checkMove"
										@start="dragging = true"
										@end="dragging = false"
									>
										<div
											class="list-group-item"
											v-for="(item, index) in imgList"
											:key="index"
										>
											<img :src="item" />
											<i class="iconfont" @click="deleteImg(index)">&#xe633;</i>
										</div>
										<p class="input-txt">（可拖拽图片进行排序）</p>
									</draggable>
								</el-form-item>
								<!-- 产品描述 -->
								<el-form-item label="产品描述" class="editor-box" required>
									<div id="pro-editor"></div>
									<el-button
										type="primary"
										size="mini"
										@click="addPicShow = true"
										>插入图片</el-button
									>
								</el-form-item>

								<!-- 选填 -->
								<p class="input-txt showmore-txt" @click="xtShow = !xtShow">
									<a>以下信息为选填内容 <i class="iconfont">&#xe60a;</i></a>
								</p>
								<div v-if="xtShow">
									<!-- 特性词 -->
									<el-form-item label="特性词">
										<el-input
											v-model="otherForm.character"
											placeholder="填写产品特性词，最多8个汉字"
											maxlength="8"
											@input="
												otherForm.character = $tools.onlyChinese(
													otherForm.character
												)
											"
										></el-input>
									</el-form-item>
									<!-- 主推理由 -->
									<el-form-item label="主推理由">
										<el-input
											class="mid-input"
											v-model="otherForm.selling_point.selling_point1"
											placeholder="推荐词1，输入6到10个汉字"
											minlength="6"
											maxlength="10"
										></el-input>
										<el-input
											class="mid-input"
											v-model="otherForm.selling_point.selling_point2"
											placeholder="推荐词2，输入6到10个汉字"
											minlength="6"
											maxlength="10"
										></el-input>
										<el-input
											class="mid-input"
											v-model="otherForm.selling_point.selling_point3"
											placeholder="推荐词3，输入6到10个汉字"
											minlength="6"
											maxlength="10"
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
											v-model="ruleForm.detail.video_id"
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

								<div class="submit-btn">
									<el-button
										type="primary"
										@click="submitForm"
										v-loading="soleloading"
										element-loading-spinner="el-icon-loading"
										>保存信息并发布</el-button
									>
									<el-button
										type="primary"
										@click="saveNewForm"
										v-if="isedit"
										v-loading="newloading"
										>新增保存信息</el-button
									>
								</div>
							</el-form>

							<!-- 选择产品图片 -->
							<el-drawer
								title="产品图片至少3张图片；最多9张图片且不重复；最佳建议为5张。"
								:visible.sync="choosePicShow"
								size="70%"
								@close="closeDrawer"
							>
								<Apppicchoose
									:maxlength="9"
									@chooseSubmit="chooseSubmit"
									ref="choosepic"
								></Apppicchoose>
							</el-drawer>
							<!-- 富文本添加图片 -->
							<el-drawer
								title="添加图片至产品描述"
								:visible.sync="addPicShow"
								size="70%"
								@close="closeDrawer"
							>
								<Apppicchoose
									:maxlength="999"
									@chooseSubmit="chooseEditSubmit"
									ref="chooseedit"
								></Apppicchoose>
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
	GetProductDetail,
	GetVideoList,
	GetCategorys,
	GetCateSearch,
	GetOwnCategory,
	PostSellInfo,
	GetCateParams,
	PostSoleSellInfo,
} from "../../api/apis";
import { mapState } from "vuex";
import draggable from "vuedraggable";
import E from "wangeditor";

export default {
	name: "AppProductPost",
	inject:['reload'], 
	components: {
		draggable,
	},
	data() {
		return {
			editloading: false, //编辑loading
			loading: false, //提交表单loading
			newloading: false, //新增loading
			morekeyshow: false, //显示更多关键词框
			sClassShow: false, //显示搜索分类
			searchList: [], //搜索分类列表
			ownClassShow: false, //显示自定义分类
			xtShow: true, //显示选填部分
			choosePicShow: false, //显示选择图片
			isedit: false, //是否为编辑
			videoUrl: "", //视频url
			addPicShow: false, //富文本添加图片
			enabled: true,
			dragging: false,
			imgList: [], //选择的图片
			editor: "", //富文本
			keywords: [], // 关键词
			formParams: [{}, {}, {}, {}, {}], //参数
			quoteway: "1", //报价方式
			priceitem: [{}], //价格区间
			otherForm: {
				//选填
				selling_point: {},
			},
			ruleForm: {
				attr: {},
				detail: {
					video_id: "",
				},
			},
			formCopy: {}, //提交表单
			classOption: [], //常用类别
			classOwnOption: [], //自定义类别
			videoOption: [], //视频列表
			classify: "", //分类
			pagenum: 1, //返回页码
			pagename: "puton",
			soleloading: false,
		};
	},

	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},
	destroyed() {
		this.classOption = [];
		this.searchList = [];
	},
	mounted() {
		this.creatEditor();
		this.pagenum = this.$route.params.pagenum ? this.$route.params.pagenum : 1;
		this.pagename = this.$route.params.page ? this.$route.params.page : "puton";
		if (this.$route.params.pro_id) {
			this.getProductDetail(this.$route.params.pro_id);
			this.isedit = true;
		} else {
			this.getVideolist();
			this.getCategory();
		}
	},

	methods: {
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
			this.editor.config.showLinkImg = false;
			this.editor.config.uploadImgShowBase64 = true;
			this.editor.create(); // 创建富文本实例
		},
		// 富文本选择图片确认按钮
		chooseEditSubmit(data) {
			data.map((item) => {
				this.editor.cmd.do(
					"insertHTML",
					`<img src="${item}" style="max-width:100%"/>`
				);
			});
			this.$refs.chooseedit.chooselist = [];
			this.addPicShow = false;
		},
		closeDrawer() {
			this.choosePicShow = false;
			this.addPicShow = false;
		},
		// 选择视频
		videoSelect(value) {
			// this.videoUrl = value.video;
			this.videoOption.map((item) => {
				if (this.ruleForm.detail.video_id == item.id) {
					this.videoUrl = item.video;
				}
			});
		},
		// 设置参数
		addParamsItem() {
			this.formParams.length < 15
				? this.formParams.push({
						n: "",
						v: "",
				  })
				: this.$message.error("最多只能添加15个参数！");
		},
		removeParamsItem(index) {
			this.formParams.splice(index, 1);
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
		// 拖拽图片
		checkMove(e) {
			window.console.log("index: " + e.draggedContext.futureIndex);
		},
		// 删除图片
		deleteImg(idx) {
			this.imgList.splice(idx, 1);
			this.$refs.choosepic.chooselist.splice(idx, 1);
		},
		// 选择图片确认按钮
		chooseSubmit(data) {
			data.map((item) => {
				if (this.imgList.indexOf(item) == -1) {
					this.imgList.push(item);
				}
			});
			this.choosePicShow = false;
		},
		// 选择分类
		selectClass(value) {
			if (!this.isedit) {
				// GetCateParams("19437,19492,21193")
				GetCateParams(value)
					.then((res) => {
						if (res.code == 0) {
							if (res.body.length > 0) {
								this.formParams = [];
								let _list =
									res.body.length > 15 ? res.body.slice(0, 15) : res.body;
								_list.map((item) => {
									this.formParams.push({ n: item.attr, v: "" });
								});
							} else {
								this.formParams = [{}, {}, {}, {}, {}];
							}
						} else {
							this.$message.error(res.msg);
						}
					})
					.catch((err) => {});
			}
		},
		// 获取产品详情
		getProductDetail(id) {
			this.editloading = true;
			GetProductDetail(id)
				.then((res) => {
					this.editloading = false;
					if (res.code == 0) {
						this.ruleForm = res.body;
						this.getVideolist();
						this.getCategory();
						this.getownclass();
						// 关键词
						let _key = res.body.detail.keywords
							? JSON.parse(res.body.detail.keywords)
							: {};
						if (_key) {
							for (let key in _key) {
								this.keywords.push(_key[key]);
							}
							if (this.keywords.length > 2) {
								this.morekeyshow = true;
							}
						}
						// 参数
						this.formParams = res.body.attr
							? JSON.parse(res.body.attr.attribute)
							: [{}, {}, {}, {}, {}];
						// 图片
						this.imgList = res.body.detail.thumbs
							? JSON.parse(res.body.detail.thumbs)
							: [];
						// 富文本
						if (res.body.detail.content) {
							this.editor.txt.html(res.body.detail.content);
						}
						// 价格区间
						this.priceitem = res.body.detail.priceitem
							? JSON.parse(res.body.detail.priceitem)
							: [{}];
						// 报价方式
						this.quoteway =
							res.body.detail.priceitem &&
							JSON.parse(res.body.detail.priceitem).length > 1
								? "1"
								: "0";
						// 视频
						this.ruleForm.detail.video_id = this.ruleForm.detail.video_id
							? parseInt(this.ruleForm.detail.video_id)
							: "";
						// 选填
						this.otherForm = res.body.detail.other
							? JSON.parse(res.body.detail.other)
							: {
									selling_point: {},
							  };
						// // 自定义分类
						// if (res.body.my_category_id) {
						// 	this.ownClassShow = true;
						// }
					} else {
						this.$message.error(err);
					}
				})
				.catch((err) => {
					this.editloading = false;
					this.$message.error(err);
				});
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
						res.body.map((item) => {
							if (this.ruleForm.detail.video_id == item.id) {
								this.videoUrl = item.video;
							}
						});
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
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
							let cate1 = this.ruleForm.category_1,
								cate2 = this.ruleForm.category_2,
								cate3 = this.ruleForm.category_id;
							this.classify = cate1
								? cate2
									? cate3
										? JSON.stringify([cate1, cate2, cate3])
										: JSON.stringify([cate1, cate2])
									: JSON.stringify([cate1])
								: "";
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
				this.loading = true;
				this.searchList = [];
				GetCateSearch(query)
					.then((res) => {
						if (res.code == 0) {
							this.loading = false;
							res.body.map((item) => {
								let _val = [],
									_res = item._source.category_name;
								_val.push(item._source.category_1);
								_val.push(item._source.category_2);
								_val.push(item._source.category_3);
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
		// 添加自定义分类
		addOwnClass() {
			this.ownClassShow = !this.ownClassShow;
			if (this.classOwnOption.length == 0) {
				this.getownclass();
			}
		},
		// 获取自定义分类
		getownclass() {
			GetOwnCategory()
				.then((res) => {
					if (res.code == 0) {
						res.body.map((item) => {
							let i = 1,
								_res = item[0].typename;
							while (i < item.length) {
								if (item[i].typename) {
									_res += `/${item[i].typename}`;
									_val = item[i].id;
								}
								i++;
							}
							this.classOwnOption.push({ value: parseInt(_val), label: _res });
						});
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
		},
		// 提交表单弹窗
		openConfirm(score, mes) {
			this.$confirm(
				`<div class="lh26">
        <p class="pop-p">您发布的商品质量存在问题</p>
        <span>商品质量总分为：<i class="red">10</i>分；得分：<i class="red">${score}</i>分；</span>
        <p class="pop-p">如下为问题点：</p>
        <p class="red">${mes}</p>
        </div>`,
				"商品质量确认",
				{
					dangerouslyUseHTMLString: true,
					confirmButtonText: "确定发布",
					cancelButtonText: "取消整改",
					showCancelButton: true,
				}
			)
				.then(() => {
					this.formCopy.push_type = 1;
					this.postSellFun(this.formCopy);
				})
				.catch(() => {
					this.formCopy.push_type = 0;
				});
		},
		// 提交表单
		submitForm() {
			this.setSellInfo(this.ruleForm.id);
		},
		saveNewForm() {
			this.setSellInfo();
		},
		setSellInfo(id) {
			this.formCopy = JSON.parse(JSON.stringify(this.ruleForm));
			let _param = true,
				_p = true;
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
			this.formParams.map((item) => {
				if (item.n == "" || item.v == "") {
					_param = false;
				}
			});
			if (this.editor.txt.html() == "") {
				this.$message.error("请填写产品描述");
			} else if (this.imgList.length < 3) {
				this.$message.error("请上传至少三张产品图片");
			} else if (
				this.quoteway == "0" &&
				(!this.formCopy.detail.minamount || !this.formCopy.price)
			) {
				this.$message.error("请填写单价和最小起订");
			} else if (this.quoteway == "1" && !_p) {
				this.$message.error("请填写完整的价格区间");
			} else if (
				!this.classify ||
				!this.keywords[0] ||
				!this.keywords[1] ||
				!this.formCopy.brand ||
				!this.formCopy.unit ||
				!this.formCopy.detail.maxamount
			) {
				this.$message.error("请完善产品的相关信息");
			} else if (!_param) {
				this.$message.error("请检查产品参数是否符合要求");
			} else {
				this.formCopy.id = id ? id : 0;
				this.formCopy.category_id = this.classify;
				this.formCopy.my_category_id = this.ruleForm.classifyown
					? this.ruleForm.classifyown[this.ruleForm.classifyown.length - 1]
					: "";
				this.formCopy.detail.other = this.otherForm;
				this.formCopy.detail.keywords = this.keywords.toString();
				this.formCopy.detail.thumbs = this.imgList.toString();
				this.formCopy.detail.content = this.editor.txt.html();
				if (this.quoteway == "1") {
					this.formCopy.detail.minamount = parseInt(this.priceitem[0].n);
					this.formCopy.price = parseInt(this.priceitem[0].v);
					this.formCopy.detail.priceitem = JSON.stringify(this.priceitem);
				} else {
					this.formCopy.detail.priceitem = this.ruleForm.price
						? JSON.stringify([
								{
									n: this.formCopy.detail.minamount.toString(),
									v: this.ruleForm.price.toString(),
								},
						  ])
						: "";
				}
				this.formCopy.attr.attribute = JSON.stringify(this.formParams);
				this.formCopy.price_type = this.quoteway;
				this.formCopy.detail.video_id = this.formCopy.detail.video_id
					? parseInt(this.formCopy.detail.video_id)
					: 0;
				this.formCopy.push_type = 0;
				this.formCopy.hot_index = this.formCopy.hot_index
					? this.formCopy.hot_index
					: 0;
				if (this.ruleForm.sole_id > 0 && this.isedit) {
					this.soleloading = true;
					PostSoleSellInfo(this.formCopy)
						.then((res) => {
							if (res.code == 0) {
								this.postSellFun(this.formCopy);
							} else {
								this.soleloading = false;
								this.$message.error(res.msg);
							}
						})
						.catch((err) => {
							this.soleloading = false;
							this.$message.error(err);
						});
				} else {
					this.postSellFun(this.formCopy);
				}
			}
		},
		postSellFun(form) {
			if (form.id) {
				this.soleloading = true;
			} else {
				this.newloading = true;
			}
			PostSellInfo(form)
				.then((res) => {
					this.soleloading = false;
					this.newloading = false;
					if (res.code == 10004) {
						this.openConfirm(res.body.score, res.body.message);
					} else {
						if (res.code == 0) {
							this.$confirm("是否返回商品列表页？", "发布成功！", {
								distinguishCancelAndClose: true,
								confirmButtonText: "返回列表",
								cancelButtonText: "留在当前并清空表单",
							})
								.then(() => {
									if (this.pagename == "prolow") {
										this.$router.push({
											name: "productlow",
											params: {
												pagenum: this.pagenum,
												page: this.pagename,
												repeat: this.$route.repeat,
											},
										});
									} else {
										this.$router.push({
											name: "productmanage",
											params: { pagenum: this.pagenum, page: this.pagename },
										});
									}
								})
								.catch((action) => {
									if (action === "cancel") {
										this.$route.params.pro_id = 0;
										this.reload();
									}
								});
						} else {
							this.$message.error(res.msg);
						}
					}
				})
				.catch((err) => {
					this.soleloading = false;
					this.$message.error(err);
				});
		},
	},
};
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
