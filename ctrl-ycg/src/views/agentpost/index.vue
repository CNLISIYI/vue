<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="agentpost" :asideIdx="['6']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 创建代发任务 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>
									由于百度目前严格检查商品质量，故此代发功能将限制使用，每次只允许设置一条代发任务；
								</p>
								<p class="red">
									代发软件发布的商品质量较低，将严重影响您的商品收录情况，请酌情使用此功能
								</p>
								<p>
									<router-link
										class="el-button el-button--danger el-button--mini _a"
										:to="{
											name: 'agentmanage',
										}"
										>前往代发任务列表</router-link
									>
								</p>
							</div>
							<el-form
								:model="ruleForm"
								ref="form"
								label-width="100px"
								class="demo-ruleForm"
								:v-loading="isedit ? editloading : ''"
							>
								<!-- 任务信息 -->
								<p class="input-txt showmore-txt" @click="taskshow = !taskshow">
									<a>设置任务信息 <i class="iconfont">&#xe60a;</i></a>
								</p>
								<div v-if="taskshow">
									<!-- 产品标题 -->
									<el-form-item label="任务标题" required>
										<el-input
											v-model="ruleForm.crontab_name"
											placeholder="请填写任务标题"
											maxlength="100"
											class="mid-input"
										></el-input>
									</el-form-item>
									<!-- 发布总数量 -->
									<el-form-item label="发布总数量" required>
										<el-select
											v-model="ruleForm.push_total"
											placeholder="请选择发布总数量"
										>
											<el-option
												v-for="(item, index) in sendnumOption"
												:key="index"
												:label="item.label + '条'"
												:value="item.label"
											>
											</el-option>
										</el-select>
									</el-form-item>
									<!-- 日发布 -->
									<el-form-item label="日发布条数" required>
										<el-input
											v-model="ruleForm.day_total"
											placeholder="最多填写200条"
											type="number"
											class="line-input"
											@input="sendnumInput"
										></el-input>
										<p class="input-txt">请填写数字</p>
									</el-form-item>
									<!-- 随机条数 -->
									<el-form-item label="随机条数" required>
										<el-radio-group v-model="detailInfo.day_random">
											<el-radio label="0">不开启</el-radio>
											<el-radio label="1">开启</el-radio>
										</el-radio-group>
									</el-form-item>
									<!-- 发布频率 -->
									<el-form-item label="发布频率" required>
										<el-select
											v-model="ruleForm.req_time"
											placeholder="请选择发布频率"
										>
											<el-option
												v-for="(item, index) in frequencyOption"
												:key="index"
												:label="item.label + '秒'"
												:value="item.label"
											>
											</el-option>
										</el-select>
										<p class="input-txt">每条信息发布的间隔时间</p>
									</el-form-item>
									<!-- 发布时间 -->
									<el-form-item label="发布时间" required>
										<el-select
											v-model="ruleForm.push_time"
											placeholder="请选择发布时间"
										>
											<el-option
												v-for="(item, index) in sendtimeOption"
												:key="index"
												:label="item.label + ':00'"
												:value="item.label"
											>
											</el-option>
										</el-select>
										<p class="input-txt">每天开始发布的时间</p>
									</el-form-item>
								</div>
								<!-- 产品信息 -->
								<p
									class="input-txt showmore-txt"
									@click="productshow = !productshow"
								>
									<a>设置产品信息 <i class="iconfont">&#xe60a;</i></a>
								</p>
								<div v-if="productshow">
									<!-- 产品分类 -->
									<el-form-item label="产品分类" required>
										<!-- 产品分类 搜索 -->
										<div v-if="sClassShow" class="dis-inline">
											<el-select
												v-model="classify"
												filterable
												remote
												placeholder="请输入分类关键词"
												:remote-method="remoteMethod"
												:loading="loading"
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
											placeholder="输入第一个产品关键词"
											class="line-input"
										></el-input>
										<el-input
											v-model="keywords[1]"
											class="line-input"
											placeholder="输入第二个产品关键词"
										></el-input>
										<div
											class="el-button el-button--primary is-plain"
											@click="morekeyshow = !morekeyshow"
										>
											点击填写更多关键词
										</div>
										<p class="input-txt mb15">
											关键词最多可以填写50个，系统在发布时会自动随机；每个关键词之间用英文逗号(,)隔开
										</p>
									</el-form-item>
									<!-- 产品关键词 更多 -->
									<el-form-item label="" v-if="morekeyshow">
										<el-input
											v-model="morekeywords"
											placeholder="请输入更多关键词"
											class="big-input"
										></el-input>
									</el-form-item>
									<!-- 品牌 -->
									<el-form-item label="品牌" required>
										<el-input
											v-model="detailInfo.brand"
											placeholder="品牌出现在标题中可以增加产品质量分"
											class="mid-input"
										></el-input>
									</el-form-item>
									<!-- 参数 -->
									<el-form-item label="产品参数" required>
										<div
											class="el-button el-button--primary is-plain"
											@click="addParamsItem"
										>
											点击添加更多属性
										</div>
										<p class="input-txt">
											产品属性至少要填写5个，最多15个，不要重复使用；同一属性下如果有多个属性值请用英文逗号(,)隔开
										</p>
										<div
											v-for="(item, index) in formParams"
											:key="index"
											class="param-item"
										>
											<el-input
												v-model="item.n"
												:placeholder="`请输入属性名${index + 1}`"
												class="line-input"
											></el-input>
											<el-input
												v-model="item.v"
												class="line-input"
												:placeholder="`请输入属性值${index + 1}`"
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
											v-model="detailInfo.unit"
											placeholder="请选择计量单位"
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
									<!-- 产品单价 -->
									<el-form-item label="产品单价" required>
										<el-input
											v-model="detailInfo.price"
											type="text"
											placeholder="请输入产品单价数字"
											class="mid-input"
										></el-input>
										<p class="input-txt">随机多个价格请用英文逗号(,)隔开</p>
									</el-form-item>
									<!-- 最小起订 -->
									<el-form-item label="最小起订" required>
										<el-input
											v-model="detailInfo.minamount"
											type="number"
											placeholder="请输入最小起订数字"
											class="mid-input"
										></el-input>
									</el-form-item>
									<!-- 供货总量 -->
									<el-form-item label="供货总量" required>
										<el-input
											v-model="detailInfo.maxamount"
											type="number"
											placeholder="请输入供货总量数字"
											class="mid-input"
										></el-input>
									</el-form-item>
									<!-- 产品图片 -->
									<el-form-item label="产品图片" required>
										<el-select
											v-model="detailInfo.photo_id"
											placeholder="请选择产品图片图库"
											:loading="albumload"
											filterable
										>
											<el-option
												v-for="item in albumOption"
												:key="item.id"
												:label="item.title"
												:value="item.id"
											>
											</el-option>
										</el-select>
										<p class="input-txt">
											系统将自动从选择的图库中随机选取5张图片，请保证图库中的图片个数
										</p>
									</el-form-item>
									<!-- 产品视频 -->
									<el-form-item label="产品视频">
										<el-select
											v-model="detailInfo.video_id"
											filterable
											placeholder="请选择产品视频"
											@change="videoSelect"
											:loading="videoload"
										>
											<el-option
												v-for="item in videoOption"
												:key="item.id"
												:label="item.title"
												:value="item.id"
											>
											</el-option>
										</el-select>
										<p class="input-txt">非必填；请先去视频管理中上传视频</p>
										<div class="video-box" v-if="videoUrl">
											<video :src="videoUrl" controls="controls"></video>
										</div>
									</el-form-item>
								</div>
								<!-- 产品标题 -->
								<p
									class="input-txt showmore-txt"
									@click="titleshow = !titleshow"
								>
									<a>设置产品标题 <i class="iconfont">&#xe60a;</i></a>
								</p>
								<div v-if="titleshow">
									<el-form-item label="产品标题" required>
										<p class="input-txt">
											每个标题一行，注意不要有多余的空行，包括首尾；最少10行，最多499行
										</p>
										<el-input
											type="textarea"
											:autosize="{ minRows: 8, maxRows: 200 }"
											placeholder="请输入标题内容"
											v-model="titletextarea"
											resize="none"
											@input="checkshow = titletextarea == '' ? false : true"
										>
										</el-input>
										<el-button
											type="primary"
											class="check-txt"
											size="mini"
											v-if="checkshow"
											@click="checkTitle"
											v-loading="checkload"
											element-loading-spinner="el-icon-loading"
											>违禁词检测</el-button
										>
										<p class="input-txt" v-if="checkshow">
											创建或编辑任务前，请先点击检测违禁词通过检测
										</p>
									</el-form-item>
								</div>
								<!-- 产品描述 -->
								<p class="input-txt showmore-txt">
									<a>设置产品描述</a>
								</p>
								<div>
									<!-- 随机图库 -->
									<el-form-item label="随机图库">
										<el-select
											v-model="detailInfo.cphoto_box"
											placeholder="请选择随机图片的图库"
											:loading="albumload"
										>
											<el-option
												v-for="item in albumOption"
												:key="item.id"
												:label="item.title"
												:value="item.id"
											>
											</el-option>
										</el-select>
										<p class="input-txt">在描述中用来随机替换图片的来源图库</p>
									</el-form-item>
									<!-- 产品描述 -->
									<el-form-item label="产品描述" class="editor-box" required>
										<p class="input-txt">
											您可以在描述中使用变量:{pic}来表示需要从图库中随机替换的图片；需要几张图片写几个变量
										</p>
										<div id="pro-editor"></div>
										<el-button
											type="primary"
											size="mini"
											@click="addPicShow = true"
											>插入图片</el-button
										>
									</el-form-item>
								</div>
								<div class="submit-btn">
									<el-button
										type="primary"
										@click="submitForm"
										v-loading="subloading"
										element-loading-spinner="el-icon-loading"
										v-if="isedit"
										>更新任务信息</el-button
									>
									<el-button
										type="primary"
										@click="submitForm"
										v-loading="subloading"
										element-loading-spinner="el-icon-loading"
										v-else
										>创建任务信息</el-button
									>
								</div>
							</el-form>

							<!-- 富文本添加图片 -->
							<el-drawer
								title="添加图片至产品描述"
								:visible.sync="addPicShow"
								size="70%"
								@close="addPicShow = false"
							>
								<Apppicchoose
									:maxlength="9"
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
	GetVideoList,
	GetCategorys,
	GetCateSearch,
	GetOwnCategory,
	GetPhotoList,
	PostCheckTitle,
	PostNewAgent,
	getAgentInfo,
} from "../../api/apis";
import { mapState } from "vuex";
import E from "wangeditor";

export default {
	name: "AppAgentPost",
	data() {
		return {
			editloading: false, //编辑loading
			loading: false, //分类loading
			subloading: false, //提交loading
			videoload: false, //视频loading
			albumload: false, //视频loading
			checkload: false, // 检测违禁词loading
			taskshow: true, //设置任务
			productshow: true, //设置产品
			titleshow: true, //设置标题
			keywords: [], // 关键词
			morekeywords: "", //更多关键词
			morekeyshow: false, //显示更多关键词框
			sClassShow: false, //显示搜索分类
			searchList: [], //搜索分类列表
			ownClassShow: false, //显示自定义分类
			classOption: [], //常用类别
			classify: "", //分类
			sendnumOption: [
				//发布总数量
				{
					label: 10,
				},
				{
					label: 20,
				},
				{
					label: 30,
				},
				{
					label: 50,
				},
				{
					label: 100,
				},
				{
					label: 150,
				},
				{
					label: 200,
				},
				{
					label: 300,
				},
				{
					label: 500,
				},
			],
			frequencyOption: [
				//发布频率
				{
					label: 1,
				},
				{
					label: 2,
				},
				{
					label: 3,
				},
				{
					label: 5,
				},
				{
					label: 10,
				},
				{
					label: 15,
				},
			],
			sendtimeOption: [
				//发布时间
				{
					label: 1,
				},
				{
					label: 2,
				},
				{
					label: 3,
				},
				{
					label: 4,
				},
				{
					label: 5,
				},
				{
					label: 6,
				},
				{
					label: 7,
				},
				{
					label: 8,
				},
				{
					label: 9,
				},
				{
					label: 10,
				},
				{
					label: 11,
				},
				{
					label: 12,
				},
				{
					label: 13,
				},
				{
					label: 14,
				},
				{
					label: 15,
				},
				{
					label: 16,
				},
				{
					label: 17,
				},
				{
					label: 18,
				},
				{
					label: 19,
				},
				{
					label: 20,
				},
				{
					label: 21,
				},
				{
					label: 22,
				},
				{
					label: 23,
				},
				{
					label: 24,
				},
			],
			videoOption: [], //视频列表
			videoUrl: "", //视频url
			video_id: 0, //视频id
			albumOption: [], //图库列表
			detailInfo: {
				//产品相关
				day_random: "0",
			},
			ruleForm: {},
			addPicShow: false, //富文本添加图片
			editor: "", //富文本
			formParams: [{}, {}, {}, {}, {}], //参数
			titletextarea: "", //标题
			titleData: [], //拆开后标题数组
			checkshow: false, //检测违禁词按钮
			ischeck: false, //是否检测通过
			isedit: false, //是否编辑
		};
	},

	created() {},
	computed: {
		...mapState(["vipUseData"]),
	},
	watch: {
		classOption: {
			handler(val, oldval) {},
			deep: true,
		},
	},
	destroyed() {
		this.videoOption = [];
		this.titleData = [];
		this.searchList = [];
		this.classOption = [];
	},
	mounted() {
		this.creatEditor();
		if (this.$route.params.cron_id) {
			this.getAgentInfo();
			this.isedit = true;
		} else {
			this.getVideolist();
			this.getPhotoList();
			this.getCategory();
		}
	},

	methods: {
		// 获取代发信息
		getAgentInfo() {
			this.editloading = true;
			getAgentInfo(this.$route.params.cron_id)
				.then((res) => {
					this.editloading = false;
					if (res.code == 0) {
						this.ruleForm = res.body;
						this.detailInfo = res.body.detail.content;
						this.$nextTick(() => {
							this.getVideolist();
							this.getPhotoList();
							this.getCategory();
						});
						// 关键词
						this.keywords = JSON.parse(this.detailInfo.keywords).slice(0, 2);
						if (JSON.parse(this.detailInfo.keywords).length > 2) {
							let _key = JSON.parse(this.detailInfo.keywords);
							this.morekeyshow = true;
							this.morekeywords = _key.slice(2, _key.length).toString();
						}
						// 类别
						this.ruleForm.classifyown = this.detailInfo.my_category_id;
						// 参数
						this.formParams = JSON.parse(this.detailInfo.params_value);
						this.formParams.map((item) => {
							if (item.v == "{value}") {
								item.v = JSON.parse(JSON.stringify(item.s));
							}
						});
						// 标题
						this.titleData = JSON.parse(res.body.title);
						this.titletextarea = this.titleData[0];
						this.titleData.map((item) => {
							this.titletextarea += "\n" + item;
						});
						this.ischeck = false;
						this.checkshow = true;
						// 单价
						this.detailInfo.price = JSON.parse(
							this.detailInfo.price
						).toString();
						// 富文本
						this.editor.txt.html(res.body.content.content);
						// 随机图库
						this.detailInfo.cphoto_box =
							this.detailInfo.cphoto_box && this.detailInfo.cphoto_box != "0"
								? parseInt(this.detailInfo.cphoto_box)
								: "";
					} else {
						this.$message.error(err);
					}
				})
				.catch((err) => {
					this.editloading = false;
					this.$message.error(err);
				});
		},
		// 违禁词检测
		checkTitle() {
			this.titleData = this.titletextarea.split("\n");
			if (this.titleData.length < 10) {
				this.$message.error("最少输入10条标题");
			} else if (this.titleData.length > 499) {
				this.$message.error("最多输入499条标题");
			} else {
				this.checkload = true;
				PostCheckTitle(this.titleData).then((res) => {
					this.checkload = false;
					if (res.code == 0) {
						if (res.body) {
							this.$message.success("检测通过，未发现违禁词");
							this.ischeck = true;
						} else {
							this.ischeck = false;
							this.$message.error(res.msg);
						}
					} else {
						this.checkload = false;
						this.ischeck = false;
						this.$message.error(res.msg);
					}
				});
			}
		},
		// 日发布输入
		sendnumInput(value) {
			if (value > 200) {
				this.ruleForm.day_total =
					value.length == 3 ? value.slice(0, 2) : value.slice(0, 3);
			}
		},
		// 获取相册列表
		getPhotoList() {
			GetPhotoList(1, "", 99999).then((res) => {
				if (res.code == 0) {
					if (res.body) {
						this.albumOption = res.body.list;
						this.detailInfo.photo_id = this.detailInfo.photo_id
							? parseInt(this.detailInfo.photo_id)
							: 0;
					} else {
						this.$message.error("暂无数据");
					}
				} else {
					this.$message.error(res.msg);
				}
			});
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
						});
						console.log(this.classOption);
						let _arr = [];
						JSON.parse(this.detailInfo.category_id).map((item) => {
							_arr.push(parseInt(item));
						});
						this.classify = JSON.stringify(_arr);
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
					.catch((err) => {
						this.loading = false;
						this.$message.error(err);
					});
			} else {
				this.searchList = [];
			}
		},
		// 获取视频列表
		getVideolist() {
			this.videoload = true;
			GetVideoList()
				.then((res) => {
					this.videoload = false;
					if (res.code == 0) {
						this.videoOption = JSON.parse(JSON.stringify(res.body));
						this.videoOption.unshift({
							id: 0,
							title: "不选择视频",
							video: "",
						});
						if (res.body.length > 0) {
							this.videoOption.unshift({
								id: -1,
								title: "随机视频",
								video: "",
							});
							// 视频
							this.detailInfo.video_id = parseInt(this.detailInfo.video_id)
								? parseInt(this.detailInfo.video_id)
								: "";
							if (parseInt(this.detailInfo.video_id) == NaN) {
								this.detailInfo.video_id = "";
							}
							this.videoOption.map((item) => {
								if (this.detailInfo.video_id == item.id) {
									this.videoUrl = item.video;
								}
							});
						}
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
		// 富文本选择图片确认按钮
		chooseEditSubmit(data) {
			data.map((item) => {
				this.editor.cmd.do(
					"insertHTML",
					`<img src="${item}" style="max-width:100%;"/>`
				);
			});
			this.$refs.chooseedit.chooselist = [];
			this.addPicShow = false;
		},
		// 设置参数
		addParamsItem() {
			this.formParams.length < 15
				? this.formParams.push({
						name: "",
						val: "",
				  })
				: this.$message.error("最多只能添加15个参数！");
		},
		// 删除参数
		removeParamsItem(index) {
			this.formParams.splice(index, 1);
		},
		// 提交表单
		submitForm() {
			let _form = JSON.parse(JSON.stringify(this.ruleForm));
			let _param = true;
			this.formParams.map((item) => {
				if (item.n == "" || item.v == "") {
					_param = false;
				}
			});
			if (!this.ischeck) {
				this.$message.error("请先通过标题违禁词检测");
			} else if (this.editor.txt.html() == "") {
				this.$message.error("请选择随机图库并填写产品描述");
			} else if (
				!_form.crontab_name ||
				!_form.push_total ||
				!_form.day_total ||
				!_form.req_time ||
				!_form.push_time
			) {
				this.$message.error("请完善任务信息的相关设置");
			} else if (
				!this.classify ||
				!this.keywords[0] ||
				!this.keywords[1] ||
				!this.detailInfo.brand ||
				!_param ||
				!this.detailInfo.unit ||
				!this.detailInfo.price ||
				!this.detailInfo.minamount ||
				!this.detailInfo.maxamount ||
				!this.detailInfo.photo_id
			) {
				this.$message.error("请完善产品信息的相关设置");
			} else {
				console.log(this.classify);
				_form.cron_id = this.isedit ? this.$route.params.cron_id : 0;
				_form.main_id = this.isedit ? this.ruleForm.main_id : 0;
				_form.content_id = this.isedit ? this.detailInfo.content_id : 0;
				_form.category_id = this.classify;
				_form.my_category_id = this.ruleForm.classifyown;
				_form.keywords = this.morekeywords
					? `${this.keywords.toString()},${this.morekeywords}`
					: this.keywords.toString();
				_form.params_value = JSON.stringify(this.formParams);
				_form.title = JSON.stringify(this.titleData);
				_form.content = this.editor.txt.html();
				this.detailInfo.video_id =
					this.detailInfo.video_id == 0
						? ""
						: JSON.stringify(this.detailInfo.video_id);
				this.subloading = true;
				PostNewAgent(_form, this.detailInfo)
					.then((res) => {
						this.subloading = false;
						if (res.code == 0) {
							this.$message.success("发布成功");
							setTimeout(() => {
								this.$router.push({
									name: "agentmanage",
								});
							}, 500);
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
@import "index.scss";
</style>
