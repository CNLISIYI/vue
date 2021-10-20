<template>
	<div style="margin-bottom: 40px">
		<!-- 商品操作 -->
		<div class="table-operate" v-if="pagename == 'puton'">
			<el-button
				type="primary"
				plain
				@click="managePro('batchDown')"
				v-loading="download"
				element-loading-spinner="el-icon-loading"
				>批量下架</el-button
			>
			<el-button
				type="primary"
				plain
				@click="managePro('batchRefresh')"
				v-loading="refreshload"
				element-loading-spinner="el-icon-loading"
				>批量刷新</el-button
			>
			<el-button
				type="primary"
				plain
				@click="sethotPro"
				v-loading="hotload"
				element-loading-spinner="el-icon-loading"
				>设置爆款</el-button
			>
		</div>
		<div class="table-operate" v-if="pagename == 'hotpro'">
			<el-button type="primary" @click="openEditpop" v-if="tableData.length > 0"
				>编辑爆款</el-button
			>
		</div>
		<div class="table-operate" v-if="pagename == 'putdown'">
			<el-button
				type="primary"
				plain
				@click="managePro('batchPush')"
				v-loading="upload"
				element-loading-spinner="el-icon-loading"
				>批量上架</el-button
			>
			<el-button
				type="primary"
				plain
				@click="managePro('batchDelete')"
				v-loading="deleteload"
				element-loading-spinner="el-icon-loading"
				>批量删除</el-button
			>
		</div>
		<div class="table-operate" v-if="pagename == 'prolow'">
			<el-button
				type="primary"
				plain
				@click="managePro('batchDown')"
				v-loading="download"
				element-loading-spinner="el-icon-loading"
				>批量下架</el-button
			>
			<el-button
				type="primary"
				plain
				@click="managePro('batchDelete')"
				v-loading="deleteload"
				element-loading-spinner="el-icon-loading"
				>批量删除</el-button
			>
			<el-button
				type="primary"
				v-if="pagename == 'prolow' && tableData.length > 0"
				v-loading="exportload"
				element-loading-spinner="el-icon-loading"
				@click="exportTable"
				>全部导出</el-button
			>
		</div>
		<!-- 搜索产品 -->
		<div class="table-search">
			<el-select
				v-model="selectval"
				placeholder="筛选问题类型"
				v-if="!repeat && pagename == 'prolow'"
				@change="chooseShow"
			>
				<el-option
					v-for="item in selectopt"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			<el-select
				v-model="repeatId"
				placeholder="重复组ID"
				v-if="pagename == 'prolow' && repeat"
				@change="chooseShow()"
				:loading="repeatload"
			>
				<el-option
					v-for="(item, index) in repeatopt"
					:key="index"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			<el-select
				v-model="repeatl"
				placeholder="重复级别"
				v-if="pagename == 'prolow' && repeat"
				@change="chooseShow()"
			>
				<el-option
					v-for="(item, index) in repeatlevel"
					:key="index"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			<el-select
				v-model="showval"
				placeholder="30天内有无数据"
				v-if="pagename == 'prolow'"
				@change="chooseShow"
			>
				<el-option
					v-for="item in showopt"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			<el-select
				v-model="starlevel"
				placeholder="筛选星级"
				v-if="!repeat && pagename == 'prolow'"
				@change="chooseShow"
			>
				<el-option
					v-for="item in showstar"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			<el-input
				:placeholder="
					pagename == 'prolow' ? '请搜索产品ID' : '请搜索产品ID或关键词'
				"
				v-model="searchwords"
				class="input-with-select"
			>
				<el-button
					slot="append"
					icon="el-icon-search"
					@click="searchProduct"
				></el-button>
			</el-input>
			<el-button class="clear-search" slot="append" @click="clearSearch"
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
				v-if="pagename != 'hotpro'"
			></el-table-column>
			<!-- <el-table-column
				:resizable="false"
				align="center"
				width="50"
				label="权重"
				fixed
				v-if="pagename == 'hotpro'"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.hot_index }}</span>
				</template>
			</el-table-column> -->
			<el-table-column
				:resizable="false"
				type="index"
				align="center"
				width="50"
				label="权重"
				:index="hotindex"
				fixed
				v-if="pagename == 'hotpro'"
			></el-table-column>
			<el-table-column
				:resizable="false"
				fixed
				label="产品ID"
				width="80"
				align="center"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="标题">
				<template slot-scope="scope">
					<a
						slot="reference"
						@click="$tools.openProduct(scope.row.id)"
						v-if="pagename == 'prolow'"
						:class="scope.row.hot_index == 0 ? '' : 'star'"
					>
						<span>{{ scope.row.titles }}</span>
					</a>
					<el-popover placement="top-end" trigger="hover" v-else>
						<div class="img-box">
							<img :src="scope.row.picture" />
						</div>
						<a
							slot="reference"
							@click="$tools.openProduct(scope.row.id)"
							:class="
								pagename == 'hotpro' || scope.row.hot_index == 0 ? '' : 'star'
							"
						>
							<span>{{ scope.row.title }}</span>
						</a>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="产品星级"
				align="center"
				width="80"
				v-if="!repeat && pagename == 'prolow'"
			>
				<template slot-scope="scope">
					<span v-if="scope.row.star">{{ scope.row.star }}星</span>
					<span v-else>-</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="问题类型"
				align="center"
				v-if="!repeat && pagename == 'prolow'"
			>
				<template slot-scope="scope">
					<span>{{ $tools.questype(scope.row) }}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="商品分类"
				align="center"
				v-if="pagename != 'prolow'"
			>
				<template slot-scope="scope">
					<span v-if="scope.row.category_3_name">{{
						`${scope.row.category_1_name}/${scope.row.category_2_name}/${scope.row.category_3_name}`
					}}</span>
					<span v-else-if="scope.row.category_2_name">{{
						`${scope.row.category_1_name}/${scope.row.category_2_name}`
					}}</span>
					<span v-else>{{ `${scope.row.category_1_name}` }}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="30天内有无数据"
				width="140"
				align="center"
				v-if="pagename == 'prolow'"
			>
				<template slot-scope="scope">
					<span :class="[scope.row.has_show ? 'green' : 'red']">{{
						scope.row.has_show ? "有" : "无"
					}}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="质量分"
				width="80"
				align="center"
				show-overflow-tooltip
				:render-header="popshow"
				v-else
			>
				<template slot-scope="scope">
					<span slot="reference" class="block">{{ scope.row.star }}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="状态"
				width="80"
				align="center"
			>
				<template slot-scope="scope">
					<span v-if="scope.row.status == 3" class="green">正常</span>
					<span v-else-if="scope.row.status == 0" class="red">下架</span>
					<span v-else-if="scope.row.status == 2" class="orange">审核中</span>
					<span v-else-if="scope.row.status == 1">审核失败</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="搜了ID"
				width="100"
				v-if="
					pagename != 'prolow' &&
					$state.userData.is_sole == 1 &&
					$state.userData.sole_info &&
					$state.userData.sole_info.real_status == 1
				"
				align="center"
			>
				<template slot-scope="scope">
					<span v-if="scope.row.sole_id">{{ scope.row.sole_id }}</span>
					<span v-else class="red">未同步</span>
				</template>
			</el-table-column>

			<el-table-column
				:resizable="false"
				label="重复级别"
				width="80"
				align="center"
				v-if="pagename == 'prolow' && repeat"
			>
				<template slot-scope="scope">
					<span :class="[scope.row.repeat_level ? 'red' : 'orange']">{{
						scope.row.repeat_level ? "恶劣" : "重度"
					}}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="重复组"
				width="80"
				align="center"
				v-if="pagename == 'prolow' && repeat"
			>
				<template slot-scope="scope">
					<span>{{
						scope.row.repeat_group ? scope.row.repeat_group : "-"
					}}</span>
				</template>
			</el-table-column>
			<el-table-column
				:resizable="false"
				label="更新时间"
				width="160"
				align="center"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.update_time }}</span>
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
					<div>
						<router-link
							class="edit-btn el-button el-button--danger el-button--mini"
							:to="{
								name: 'productpost',
								params: {
									page: pagename,
									pro_id: scope.row.id,
									pagenum: currentPage,
									repeat: repeat,
								},
							}"
							>编辑</router-link
						>
						<el-button
							size="mini"
							type="warning"
							@click="openInfoPop(scope.row.id)"
							>数据追踪</el-button
						>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@current-change="handleChange"
			@size-change="handleSizeChange"
			:current-page="currentPage"
			:page-size="20"
			:page-sizes="[20, 30, 40, 50]"
			background
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
			:hide-on-single-page="true"
		>
		</el-pagination>
		<el-drawer
			title="数据追踪"
			:visible.sync="proinfoshow"
			size="85%"
			:destroy-on-close="true"
		>
			<div class="tips">
				<p>
					我们将通过历史数据追溯的手段来追踪商品的变化趋势过程；您可以根据趋势变化过程中的数据表现来更新您的产品；使其始终保持较高的搜索命中率
				</p>
			</div>
			<div class="choose-date">
				<label class="el-form-item__label" style="cursor: default"
					>选择日期</label
				>
				<el-date-picker
					v-model="formdate"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:picker-options="pickerOptions"
					@change="handleChooseDate"
					:clearable="false"
					format="yyyy年MM月dd日"
					value-format="yyyy-MM-dd"
					:editable="false"
				>
				</el-date-picker>
				<p class="input-txt">最多选择31天</p>
				<div class="chart-box" v-loading="chartload">
					<Appecharts
						:domid="'echart-pc'"
						:option="optionPc"
						:width="'50%'"
					></Appecharts>
					<Appecharts
						:domid="'echart-h5'"
						:option="optionH5"
						:width="'50%'"
					></Appecharts>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script>
import { GetLowProduct, GetProChart, GetRepeatList } from "../api/apis";
import { AddHotPro, PostManagePro } from "../api/apis";
let Echarts = require("echarts/lib/echarts");
export default {
	name: "AppProTabel",
	data() {
		var _minTime = null;
		var _maxTime = null;
		return {
			searchwords: "", //搜索关键词
			selectopt: [
				{
					value: "",
					label: "全部问题类型",
				},
				{
					value: "image",
					label: "图片问题",
				},
				{
					value: "title",
					label: "标题问题",
				},
				{
					value: "price",
					label: "价格问题",
				},
				{
					value: "param",
					label: "参数问题",
				},
				{
					value: "detail",
					label: "详情问题",
				},
			],
			showopt: [
				{ value: -1, label: "全部展示" },
				{ value: 1, label: "30天内有数据" },
				{ value: 0, label: "30天内无数据" },
			],
			repeatlevel: [
				{ value: -1, label: "全部级别" },
				{ value: 1, label: "恶劣" },
				{ value: 0, label: "重度" },
			],
			showstar: [
				{ value: 0, label: "全部星级" },
				{ value: 1, label: "1星" },
				{ value: 2, label: "2星" },
				{ value: 3, label: "3星" },
				{ value: 4, label: "4星" },
				{ value: 5, label: "5星" },
			],
			repeatl: -1, //重复级别
			repeatopt: [], //重复组
			repeatId: "", //重复组id
			selectval: "", //问题类型
			showval: -1, //30天内是否有数据
			starlevel: 0, //星级
			imgpopShow: false,
			multipleSelection: [], //选中项
			upload: false, //上架loading
			download: false, //下架loading
			hotload: false, //设置爆款loading
			refreshload: false, //刷新loading
			deleteload: false, //删除loading
			exportload: false, //导出loading
			repeatload: false, //重复组loading
			proinfoshow: false, //数据追踪弹窗
			formdate: [], //数据追踪日期
			formid: "", //
			chartload: false, //图表loading
			pickerOptions: {
				onPick(time) {
					if (!time.maxDate) {
						let timeRange = 31 * 24 * 60 * 60 * 1000; // 31天
						_minTime = time.minDate.getTime() - timeRange; // 最小时间
						_maxTime = time.minDate.getTime() + timeRange; // 最大时间
					} else {
						_minTime = _maxTime = null;
					}
				},
				disabledDate(time) {
					if (_minTime && _maxTime) {
						return (
							time.getTime() < _minTime ||
							time.getTime() > _maxTime ||
							time.getTime() > Date.now() - 24 * 60 * 60 * 1000
						);
					} else {
						return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
					}
				},
			},
			optionPc: {
				title: {
					text: "PC搜索趋势",
				},
				tooltip: {
					show: true,
					trigger: "axis",
				},
				legend: {
					right: "10%",
					data: ["搜索展示", "搜索点击"],
				},
				xAxis: {
					type: "category",
					data: [],
					boundaryGap: false,
					splitLine: {
						show: true,
						lineStyle: {
							color: ["#F6F6F6"],
							width: 1,
							type: "solid",
						},
					},
					axisLine: {
						lineStyle: {
							color: ["#F6F6F6"],
							width: 1,
							type: "solid",
						},
					},
					axisLabel: {
						show: true,
						textStyle: {
							color: "#90A1B8",
						},
					},
				},
				yAxis: [
					{
						type: "value",
						name: "",
					},
					{
						type: "value",
						name: "",
					},
				],
				series: [
					{
						name: "搜索展示",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "搜索点击",
						data: [],
						symbol: "none",
						type: "line",
					},
				],
			},
			optionH5: {
				title: {
					text: "移动搜索趋势",
				},
				tooltip: {
					show: true,
					trigger: "axis",
				},
				legend: {
					right: "10%",
					data: ["搜索展示", "搜索点击"],
				},
				xAxis: {
					type: "category",
					data: [],
					boundaryGap: false,
					splitLine: {
						show: true,
						lineStyle: {
							color: ["#F6F6F6"],
							width: 1,
							type: "solid",
						},
					},
					axisLine: {
						lineStyle: {
							color: ["#F6F6F6"],
							width: 1,
							type: "solid",
						},
					},
				},
				yAxis: [
					{
						type: "value",
						name: "",
					},
					{
						type: "value",
						name: "",
					},
				],
				series: [
					{
						name: "搜索展示",
						data: [],
						symbol: "none",
						type: "line",
					},
					{
						name: "搜索点击",
						data: [],
						symbol: "none",
						type: "line",
					},
				],
			},
		};
	},
	props: {
		tableData: {
			type: Array,
			default: () => [],
		},
		pagename: {
			type: String,
			default: "",
		},
		total: {
			type: Number,
			default: 0,
		},
		currentPage: {
			type: Number,
			default: 1,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		repeat: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		if (this.pagename == "prolow") {
			this.getrepeat();
		}
	},
	computed: {},
	destroyed() {
		this.optionPc = {};
		this.optionH5 = {};
	},
	methods: {
		// 爆款权重
		hotindex(index) {
			return (this.currentPage - 1) * 20 + index + 1;
		},
		// 获取重复组
		getrepeat() {
			this.repeatload = true;
			this.repeatopt = [];
			GetRepeatList()
				.then((res) => {
					this.repeatload = false;
					if (res.code == 0) {
						this.repeatopt.push({ label: "全部重复组", value: "" });
						res.body.map((item) => {
							this.repeatopt.push({ label: item, value: item });
						});
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.repeatload = false;
					this.$message.error(err);
				});
		},
		// 搜索产品
		searchProduct() {
			this.$emit("searchProduct", this.searchwords);
		},
		// 清空搜索
		clearSearch() {
			this.searchwords = "";
			this.$emit("clearSearch");
		},
		// 清除筛选
		clearSelect() {},
		// 编辑权重
		openEditpop() {
			this.$emit("openEditpop");
		},
		// 批量操作
		managePro(val) {
			if (this.multipleSelection.length > 0) {
				if (val == "batchDown") {
					this.download = true;
				} else if (val == "batchRefresh") {
					this.refreshload = true;
				} else if (val == "batchPush") {
					this.upload = true;
				} else if (val == "batchDelete") {
					this.deleteload = true;
				}
				let _data = [];
				this.multipleSelection.map((item) => {
					_data.push(item.id);
				});
				PostManagePro(val, _data).then((res) => {
					if (res.code == 0) {
						this.$message.success("操作成功");
						this.download = false;
						this.upload = false;
						this.refreshload = false;
						this.deleteload = false;
						this.$refs.multipleTable.clearSelection();
						this.$emit("managePro");
					} else {
						this.$message.error(res.msg);
					}
				});
			}
		},
		// 设置爆款
		sethotPro() {
			let _data = [];
			this.multipleSelection.map((item) => {
				_data.push(item.id);
			});
			this.hotload = true;
			AddHotPro(_data).then((res) => {
				this.hotload = false;
				if (res.code == 0) {
					this.$message.success("设置成功");
					this.$refs.multipleTable.clearSelection();
					this.$emit("sethotPro");
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 导出
		exportTable() {
			this.exload = true;
			let _repeat = this.repeat ? 1 : 0;
			if (this.total) {
				GetLowProduct(
					_repeat,
					this.selectval,
					this.showval,
					this.repeatId,
					this.repeatl,
					this.starlevel,
					this.currentPage,
					this.searchwords,
					99999
				).then((res) => {
					this.exload = false;
					if (res.code == 0) {
						let _data = [];
						res.body.list.map((item) => {
							if (this.repeat) {
								let _item = {
									产品ID: item.id,
									标题: item.titles,
									"30天内有无数据": item.has_show ? "有" : "无",
									状态: this.$tools.proStatus(item.status),
									重复级别: item.repeat_level ? "恶劣" : "重度",
									重复组: item.repeat_group ? item.repeat_group : "-",
									更新时间: item.update_time,
								};
								_data.push(_item);
							} else {
								let _item = {
									产品ID: item.id,
									标题: item.titles,
									问题类型: this.$tools.questype(item),
									"30天内有无数据": item.has_show ? "有" : "无",
									星级: item.star + "星",
									状态: this.$tools.proStatus(item.status),
									更新时间: item.update_time,
								};
								_data.push(_item);
							}
						});
						this.$tools.exportCSV(
							_data,
							this.repeat ? "重复商品.csv" : "低质商品.csv"
						);
					} else {
						this.$message.error(res.msg);
					}
				});
			} else {
				this.exload = false;
				this.$message.error("没有可以导出的数据");
			}
		},
		// 编辑商品
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleChange(val) {
			this.$emit("handleChange", val);
		},
		handleSizeChange(val) {
			this.$emit("handleSizeChange", val);
		},
		openInfoPop(id) {
			this.proinfoshow = true;
			this.formid = id;
			this.formdate = [this.$tools.pastDate(8), this.$tools.pastDate(1)];
			this.getChartInfo();
		},
		// 选择是否展示
		chooseShow() {
			let data = {};
			data = {
				ques: this.selectval,
				show: this.showval,
				repeatl: this.repeatl,
				repeat: this.repeatId,
				star: this.starlevel == "" ? 0 : this.starlevel,
			};

			this.$emit("chooseShow", data);
		},
		// 选择日期
		handleChooseDate() {
			this.getChartInfo();
		},
		// 设置图表数据
		setData(data) {
			this.optionPc.xAxis.data = data.dates;
			this.optionH5.xAxis.data = data.dates;
			this.optionPc.series[0].data = data.y_PC_show_value;
			this.optionPc.series[1].data = data.y_PC_click_value;
			this.optionH5.series[0].data = data.y_YD_show_value;
			this.optionH5.series[1].data = data.y_YD_click_value;
			if (document.getElementById("echart-pc")) {
				this.chartload = false;
				Echarts.init(document.getElementById("echart-pc")).setOption(
					this.optionPc
				);
				Echarts.init(document.getElementById("echart-h5")).setOption(
					this.optionH5
				);
			}
		},
		getChartInfo() {
			this.chartload = true;
			// GetProChart(1182390, "2020-09-01", "2020-09-30").then((res) => {
			GetProChart(this.formid, this.formdate[0], this.formdate[1]).then(
				(res) => {
					if (res.code == 0) {
						if (res.body && res.body.dates) {
							this.setData(res.body);
						} else {
							this.setData(res.body);
							this.chartload = false;
							this.$message.error("暂无数据");
						}
					} else {
						this.chartload = false;
						this.$message.error(res.msg);
					}
				}
			);
		},
		// 质量分pop
		popshow(h, { column }) {
			const inReview = { slot: "content" },
				green = { slot: "content", class: "green" },
				red = { slot: "content", class: "red" };
			return h("div", [
				h("span", column.label),
				h(
					"el-tooltip",
					{
						props: {
							placement: "top",
							effect: "light",
							"popper-class": "poptxt",
						},
					},
					[
						h("span", green, "产品质量分："),
						h(
							"span",
							inReview,
							"是指当前产品的综合评分；评分越高对产品的收录、展现、点击等越有效"
						),
						h("p", inReview, "影响产品质量分的因素有以下几点："),
						h("p", inReview, "1. 产品标题"),
						h("p", inReview, "2. 产品核心关键词"),
						h("p", inReview, "3. 产品属性参数"),
						h("p", inReview, "4. 产品主图"),
						h("p", inReview, "5. 产品价格及产品单位"),
						h("p", inReview, "6. 产品详情"),
						h("span", red, "注意："),
						h(
							"span",
							inReview,
							"原有商品由于无法判断产品质量分姑且设置为1分；但不影响产品最终质量分；新发布的产品将严格评估产品质量分"
						),
						h("i", {
							class: "el-icon-warning",
							style: "color:#D0D7DE;margin-left:2px;",
						}),
					]
				),
			]);
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-select {
	width: 150px;
}
/deep/ .el-button--mini,
.el-button--mini.is-round {
	padding: 6px;
}

.el-input-group {
	max-width: 300px !important;
}
.el-table .cell a {
	text-overflow: ellipsis;
	white-space: nowrap;
}
.block {
	display: block;
}
.edit-btn {
	display: inline-block;
}
.el-table .star {
	color: #fb8500;
}
.el-table tr:hover {
	.edit-btn {
		color: #fff !important;
		text-decoration: none !important;
	}
}
.tips {
	margin-top: 20px;
}
.chart-box {
	margin-top: 20px;
	height: 400px;
}
.input-txt {
	display: inline-block;
	vertical-align: middle;
	margin-left: 5px;
	font-size: 14px;
	color: #909399;
	margin-right: 20px;
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
</style>
