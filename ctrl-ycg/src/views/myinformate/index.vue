<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="myinformate" :asideIdx="['4']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card" :value="tabnum" @tab-click="handleClick">
						<!-- 企业信息 -->
						<el-tab-pane name="1">
							<!-- 标签标题 -->
							<span slot="label"> 企业信息 </span>
							<!-- 页面内容 -->
							<div class="tips">
								<p>
									公司资料做出调整后会影响之前发布的信息，此时请及时联系客服人员更新您的百度收录数据;
								</p>
								<p>请认真填写公司资料信息，杜绝虚假宣传！</p>
							</div>
							<el-form
								:model="ruleForm"
								ref="form"
								label-width="100px"
								class="demo-ruleForm"
								v-loading="loading"
							>
								<!-- 公司名称 -->
								<el-form-item label="公司名称">
									<el-input
										v-model="ruleForm.company"
										placeholder="请输入公司名称"
										maxlength="100"
									></el-input>
								</el-form-item>
								<!-- 企业类型 -->
								<el-form-item label="企业类型">
									<el-radio-group v-model="ruleForm.type">
										<el-radio label="1">个体工商</el-radio>
										<el-radio label="2">企业</el-radio>
									</el-radio-group>
								</el-form-item>
								<!-- 公司所在地 -->
								<el-form-item label="公司所在地">
									<el-cascader
										v-model="formcity"
										:options="cityoptions"
										@change="handleChange"
									></el-cascader>
								</el-form-item>
								<!-- 成立时间 -->
								<el-form-item label="成立时间">
									<el-date-picker
										v-model="ruleForm.regyear"
										type="year"
										placeholder="选择年"
										:clearable="false"
										:picker-options="pickerOptions"
										:editable="false"
									>
									</el-date-picker>
								</el-form-item>
								<!-- 主营产品或服务 -->
								<el-form-item label="主营产品/服务">
									<div
										class="el-button el-button--primary is-plain"
										@click="addParamsItem"
									>
										点击添加更多
									</div>
									<p class="input-txt">最多填写20条</p>
									<div>
										<div
											v-for="(item, index) in formbusiness"
											:key="index"
											class="param-item"
										>
											<el-input
												v-model="formbusiness[index]"
												placeholder="最多输入20个汉字"
												class="line-input"
												maxlength="20"
											></el-input>
											<el-button
												v-if="index > 0"
												@click.prevent="removeParamsItem(index)"
												>删除</el-button
											>
										</div>
									</div>
								</el-form-item>
								<!-- 公司logo -->
								<el-form-item label="公司Logo">
									<Appheadupload
										@handlefile="handlelogo"
										ref="logoupload"
									></Appheadupload>
									<p class="input-txt">最佳大小为180px*180px</p>
								</el-form-item>

								<!-- 公司简介 -->
								<el-form-item label="公司简介" class="editor-box">
									<div id="pro-editor"></div>
								</el-form-item>

								<!-- 选填 -->
								<p class="input-txt showmore-txt">
									<a>点击展开填写更多信息（选填）</a>
								</p>
								<div>
									<!-- 形象图 -->
									<el-form-item label="形象图">
										<Applistupload ref="listupload"></Applistupload>
									</el-form-item>
									<!-- 公司规模 -->
									<el-form-item label="公司规模">
										<el-select
											v-model="ruleForm.size"
											placeholder="请选择公司规模"
										>
											<el-option
												v-for="item in scaleOption"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											>
											</el-option>
										</el-select>
									</el-form-item>
									<!-- 注册资本 -->
									<el-form-item label="注册资本">
										<el-select
											v-model="ruleForm.capital"
											placeholder="请选择货币单位"
										>
											<el-option
												v-for="item in unitOption"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											>
											</el-option>
										</el-select>
										<el-input
											v-model="ruleForm.regunit"
											placeholder="请输入数值"
											type="number"
											class="input-wid"
										></el-input>
										<p class="input-txt">万</p>
									</el-form-item>
									<!-- 经营模式 -->
									<el-form-item label="经营模式">
										<el-checkbox-group v-model="formMode" :max="2">
											<el-checkbox
												v-for="model in modelslist"
												:label="model"
												:key="model"
												>{{ model }}</el-checkbox
											>
										</el-checkbox-group>
									</el-form-item>
								</div>

								<div class="submit-btn">
									<el-button
										type="primary"
										@click="submitForm"
										v-loading="uploading"
										element-loading-spinner="el-icon-loading"
										>保存信息</el-button
									>
								</div>
							</el-form>
						</el-tab-pane>

						<!-- 企业联系方式 -->
						<el-tab-pane name="2">
							<!-- 标签标题 -->
							<span slot="label"> 联系方式 </span>
							<!-- 页面内容 -->
							<div class="tips">
								<p>
									更新联系方式将直接影响已收录的商品，请在设置联系方式时尽量考虑周全；避免二次更改造成已收录商品信息联系方式更新不及时问题。
								</p>
							</div>
							<el-form
								:model="comForm"
								ref="form"
								label-width="100px"
								class="demo-ruleForm"
							>
								<el-form-item label="手机号">
									<el-input
										v-model="comForm.telephone"
										placeholder="请输入手机号"
										type="number"
									></el-input>
								</el-form-item>
								<el-form-item label="公司电话">
									<el-input
										v-model="comForm.mobile"
										placeholder="请输入公司联系方式"
										type="number"
									></el-input>
								</el-form-item>
								<el-form-item label="详细地址">
									<el-input
										v-model="comForm.address"
										placeholder="请输入公司详细地址"
										class="wid100"
									></el-input>
								</el-form-item>
								<!-- 选填 -->
								<p class="input-txt showmore-txt">
									<a>以下为选填内容：</a>
								</p>
								<el-form-item label="邮箱">
									<el-input
										v-model="comForm.mail"
										placeholder="请输入公司邮箱"
									></el-input>
								</el-form-item>
								<el-form-item label="QQ">
									<el-input
										v-model="comForm.qq"
										placeholder="请输入QQ号码"
										type="number"
									></el-input>
								</el-form-item>
								<el-form-item label="邮政编码">
									<el-input
										v-model="comForm.postcode"
										placeholder="请输入邮政编码"
										type="number"
									></el-input>
								</el-form-item>
								<el-form-item label="传真">
									<el-input
										v-model="comForm.fax"
										placeholder="请输入公司传真"
									></el-input>
								</el-form-item>
								<el-form-item label="官网">
									<el-input
										v-model="comForm.homepage"
										placeholder="请输入官网地址"
										class="wid100"
									></el-input>
								</el-form-item>
								<el-form-item label="手机官网">
									<el-input
										v-model="comForm.waphomepage"
										placeholder="请输入手机官网地址"
										class="wid100"
									></el-input>
								</el-form-item>
								<div class="submit-btn">
									<el-button
										type="primary"
										@click="submitForm"
										v-loading="uploading"
										element-loading-spinner="el-icon-loading"
										>保存信息</el-button
									>
								</div>
							</el-form>
						</el-tab-pane>

						<!-- 账户信息 -->
						<el-tab-pane name="3">
							<!-- 标签标题 -->
							<span slot="label"> 账户信息 </span>
							<!-- 页面内容 -->
							<el-card class="box-card">
								<div slot="header" class="clearfix">
									<span>个人账户资料</span>
								</div>
								<div class="card-item">
									<span>手机号：</span>
									<p>{{ $state.userData.mobile }}</p>
								</div>
								<div class="card-item">
									<span>邮箱：</span>
									<p>{{ $state.userData.email }}</p>
								</div>
							</el-card>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { GetArea, PostCompanyInfo, GetCompanyInfo } from "../../api/apis";
import cityData from "../../../static/js/citys";
import E from "wangeditor";
export default {
	name: "AppMyInformate",
	data() {
		return {
			uploading: false, //提交表单loading
			tabnum: "1",
			xtShow: false, //显示选填部分
			editor: "", //富文本
			formMode: [], //经营模式
			formbusiness: [], //主营产品
			formcity: [], //公司所在地
			ruleForm: {},
			comForm: {},
			cityoptions: cityData.cityData,
			scaleOption: [
				//公司规模列表
				{
					label: "暂不选择",
					value: "0",
				},
				{
					label: "1 - 49人",
					value: "1",
				},
				{
					label: "50 - 99人",
					value: "2",
				},
				{
					label: "100 - 499人",
					value: "3",
				},
				{
					label: "500 - 999人",
					value: "4",
				},
				{
					label: "1000 - 3999人",
					value: "5",
				},
				{
					label: "3000 - 5000人",
					value: "6",
				},
				{
					label: "5000 - 10000人",
					value: "7",
				},
			],
			unitOption: [
				//货币单位
				{
					label: "人民币",
					value: "1",
				},
				{
					label: "港元",
					value: "2",
				},
				{
					label: "台币",
					value: "3",
				},
				{
					label: "美元",
					value: "4",
				},
				{
					label: "欧元",
					value: "5",
				},
				{
					label: "英镑",
					value: "6",
				},
			],
			modelslist: ["制造商", "贸易商", "服务商", "其他机构"],
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
			loading: false, //页面loading
			logo_url: "", //logo上传后url
		};
	},
	created() {},
	computed: {
		...mapState(["companyData"]),
	},
	watch: {
		companyData: {
			handler(val, oldval) {
				this.setCompanyData();
			},
			deep: true,
		},
	},
	mounted() {
		this.creatEditor();
		this.setCompanyData();
	},

	methods: {
		// 富文本
		creatEditor() {
			this.editor = new E(document.getElementById("pro-editor"));
			this.editor.config.height = 300;
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
			this.editor.create(); // 创建富文本实例
		},
		// 设置产品和服务
		addParamsItem() {
			this.formbusiness.push("");
		},
		removeParamsItem(index) {
			this.formbusiness.splice(index, 1);
		},
		// 选择城市
		handleChange(value) {
			this.formcity = value;
		},
		// logo的url
		handlelogo(url) {
			this.logo_url = url;
		},
		// 切换页面
		handleClick(tab) {
			this.tabnum = tab.name;
		},
		// 获取公司信息
		setCompanyData() {
			if (this.companyData.company) {
				this.loading = true;
				this.ruleForm = JSON.parse(JSON.stringify(this.companyData));
				this.comForm = JSON.parse(JSON.stringify(this.companyData));
				this.$refs.logoupload.imgurl = this.ruleForm.thumb;
				this.ruleForm.capital = !this.ruleForm.capital
					? "1"
					: this.ruleForm.capital.toString();
				this.formMode = this.companyData.mode
					? this.companyData.mode.split(",")
					: [];
				this.formbusiness = this.companyData.business.split(",");
				this.getArea(this.companyData.areaid);
				this.editor.txt.html(this.companyData.ext.content);
			} else {
				this.loading = true;
				GetCompanyInfo()
					.then((res) => {
						if (res.code == 0) {
							this.loading = false;
							if (res.body.company) {
								this.$state.companyData = res.body;
								this.ruleForm = JSON.parse(JSON.stringify(res.body));
								this.comForm = JSON.parse(JSON.stringify(res.body));
								this.$refs.logoupload.imgurl = this.ruleForm.thumb;
								this.ruleForm.capital = !this.ruleForm.capital
									? "1"
									: this.ruleForm.capital.toString();
								if (res.body.company) {
									this.formMode = res.body.mode ? res.body.mode.split(",") : [];
									this.formbusiness = res.body.business.split(",");
									this.getArea(res.body.areaid);
									this.editor.txt.html(res.body.ext.content);
								}
							}
						}
					})
					.catch((err) => {
						this.loading = false;
					});
			}
			this.$nextTick(() => {
				this.$refs.listupload.imgList = this.$state.companyData.imagelist
					? JSON.parse(this.$state.companyData.imagelist)
					: [];
			});
		},
		// 获取所在地区
		getArea(areaid) {
			GetArea(areaid)
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.formcity = [
							res.body[0].areaid.toString(),
							res.body[1].areaid.toString(),
							res.body[2].areaid.toString(),
						];
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 提交表单
		submitForm() {
			this.uploading = true;
			let _form = JSON.parse(JSON.stringify(this.ruleForm)),
				_com = JSON.parse(JSON.stringify(this.comForm));
			_form.regyear = new Date(_form.regyear).getFullYear();
			_form.province = this.formcity[0];
			_form.city = this.formcity[1];
			_form.dis = this.formcity[2];
			_form.business = this.formbusiness.join("\n");
			_form.content = this.editor.txt.html();
			_form.imageList = this.$refs.listupload.imgList;
			_form.mode = JSON.stringify(this.formMode);
			_form.thumb = this.logo_url ? this.logo_url : _form.thumb;
			_form.telephone = _com.telephone;
			_form.mobile = _com.mobile;
			_form.address = _com.address;
			_form.mail = _com.mail;
			_form.qq = _com.qq;
			_form.postcode = _com.postcode;
			_form.fax = _com.fax;
			_form.homepage = _com.homepage;
			_form.waphomepage = _com.waphomepage;
			PostCompanyInfo(_form)
				.then((res) => {
					this.uploading = false;
					if (res.code == 0) {
						this.$message.success("保存成功！");
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.uploading = false;
					this.$message.error(err);
				});
		},
	},
};
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
