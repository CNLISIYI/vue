<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="managenews" :asideIdx="['3']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>内容管理</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="tips" v-if="$tools.isMenus(52)">
						<p>点击标题可查看内容详情</p>
					</div>
					<div class="table-search">
						<el-input
							placeholder="请输入标题"
							v-model="searchwords"
							class="input-with-select"
						>
						</el-input>
						<div class="date-choose">
							<el-date-picker
								v-model="choosedate"
								type="daterange"
								range-separator="至"
								start-placeholder="选择发布日期"
								end-placeholder="选择发布日期"
								:picker-options="pickerOptions"
								:clearable="false"
								format="yyyy年MM月dd日"
								value-format="yyyy-MM-dd"
								:editable="false"
							>
							</el-date-picker>
						</div>
						<el-select v-model="selectval" placeholder="请选择状态">
							<el-option
								v-for="item in selectopt"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
						<el-select v-model="typeId" placeholder="请选择所属类型">
							<el-option
								v-for="(item, index) in $state.typeopt"
								:key="index"
								:label="item.name"
								:value="item.id"
							>
							</el-option>
						</el-select>
						<el-button
							slot="append"
							type="primary"
							icon="el-icon-search"
							@click="getnewslist"
							>搜索</el-button
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
						<el-table-column
							:resizable="false"
							label="标题"
							align="center"
							width="240px"
							class-name="overhide"
						>
							<template slot-scope="scope">
								<a
									href="javascript:;"
									@click="openDetail(scope.row)"
									v-if="$tools.isMenus(52)"
								>
									{{ scope.row.title }}
								</a>
								<span v-else>{{ scope.row.title }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="banner图" align="center">
							<template slot-scope="scope">
								<div class="img-box" @click="$tools.openUrl(scope.row.image)">
									<img :src="scope.row.image" />
								</div>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="摘要"
							align="center"
							width="240px"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.description }}</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="所属类型" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.categoryId }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="状态"
							align="center"
							width="70px"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.status == 1" class="green">已通过</span>
								<span v-else-if="scope.row.status == -1" class="red"
									>已驳回</span
								>
								<span v-else-if="scope.row.status == 0">待审批</span>
							</template>
						</el-table-column>
						<el-table-column :resizable="false" label="浏览次数" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.readnumber }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="发布时间"
							align="center"
							width="100px"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.createTime }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:resizable="false"
							label="操作"
							fixed="right"
							align="center"
							width="250px"
						>
							<template slot-scope="scope">
								<router-link
									v-if="scope.row.status != 1 && $tools.isMenus(47)"
									class="edit-btn el-button el-button--warning el-button--mini"
									:to="{
										name: 'newspost',
										params: {
											newsid: scope.row.id,
										},
									}"
									>编辑</router-link
								>
								<el-button
									@click.native.prevent="deleteRow(scope.row)"
									type="danger"
									size="mini"
									v-if="$tools.isMenus(48)"
								>
									删除
								</el-button>
								<el-button
									size="mini"
									type="success"
									@click.native.prevent="passRow(scope.row.id)"
									v-if="scope.row.status == 0 && $tools.isMenus(49)"
									>通过</el-button
								>
								<el-button
									size="mini"
									type="info"
									@click.native.prevent="openReject(scope.row.id)"
									v-if="scope.row.status == 0 && $tools.isMenus(50)"
									>驳回</el-button
								>
								<el-button
									size="mini"
									type="primary"
									@click="openReason(scope.row)"
									v-if="scope.row.status == -1 && $tools.isMenus(51)"
									>驳回原因</el-button
								>
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
					<el-drawer title="内容详情" :visible.sync="detailShow" size="70%">
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">基础信息</span>
							</div>
							<div class="card-item">
								<span>标题：</span>
								<span>{{ artData.title }}</span>
							</div>
							<div class="card-item">
								<span>原创作者：</span>
								<span>{{
									artData.author ? artData.author : artData.fromurl
								}}</span>
							</div>
							<div class="card-item w25">
								<span>所属类型：</span>
								<span>{{ $tools.changeType(artData.categoryId) }}</span>
							</div>
							<div class="card-item w25">
								<span>发布时间：</span>
								<span>{{ artData.createTime }}</span>
							</div>
							<div class="card-item w100">
								<span>内容摘要：</span>
								<span>{{ artData.description }}</span>
							</div>
							<div class="card-item w100">
								<span>封面图片：</span>
								<img
									:src="artData.image"
									@click="$tools.openUrl(artData.image)"
								/>
							</div>
							<div class="card-item w25">
								<span>提交人：</span>
								<span>{{ artData.creatBy }}</span>
							</div>
							<div class="card-item">
								<span>是否显示在首页推荐位：</span>
								<span v-if="artData.homeNews == 0">否</span>
								<span
									class="el-form-item__span"
									v-else-if="artData.homeNews == 1"
									>发布时推荐</span
								>
								<span
									class="el-form-item__span"
									v-else-if="artData.homeNews == 2"
									>编辑时推荐</span
								>
							</div>
							<div>
								<div class="card-item">
									<span>状态：</span>
									<span
										class="el-form-item__span green"
										v-if="artData.status == 1"
										>已通过</span
									>
									<span
										class="el-form-item__span red"
										v-else-if="artData.status == -1"
										>已驳回</span
									>
									<span
										class="el-form-item__span"
										v-else-if="artData.status == 0"
										>待审批</span
									>
								</div>
								<div class="card-item" v-if="artData.status == -1 && $tools.isMenus(51)">
									<span>驳回原因：</span>
									<span>{{ artData.reject }}</span>
								</div>
								<div v-if="artData.status == 0" class="btn-box">
									<el-button
										size="small"
										type="success"
										@click.native.prevent="passRow(detailid)"
										v-if="$tools.isMenus(49)"
										>通过</el-button
									>
									<el-button
										size="small"
										type="info"
										@click.native.prevent="openReject(detailid)"
										v-if="$tools.isMenus(50)"
										>驳回</el-button
									>
								</div>
								<div v-else>
									<div class="card-item w25">
										<span>审核时间：</span>
										<span>{{ artData.releaseTime }}</span>
									</div>
									<div class="card-item">
										<span>审批人员：</span>
										<span>{{ artData.releaseName }}</span>
									</div>
								</div>
							</div>
						</el-card>
						<el-card class="box-card mt20" shadow="never">
							<div slot="header" class="clearfix">
								<span class="_h4">内容正文</span>
							</div>
							<div class="rich-box">{{ artData.content }}</div>
						</el-card>
					</el-drawer>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	GetNewsList,
	DelArticle,
	RejectArticle,
	PassArticle,
	GetArticleDetail,
} from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppManageNews",

	data() {
		var _minTime = null;
		var _maxTime = null;
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [],
			choosedate: [],
			selectval: "",
			typeId: "",
			pickerOptions: {
				onPick(time) {
					if (!time.maxDate) {
						let timeRange = 31 * 24 * 60 * 60 * 1000; // 7天
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
			selectopt: [
				{ value: 0, label: "待审批" },
				{ value: 1, label: "已通过" },
				{ value: -1, label: "已驳回" },
			],
			searchwords: "",
			detailid: "",
			detailShow: false,
			artData: {},
		};
	},
	created() {},
	computed: {
		...mapState(["userData"]),
	},
	watch: {},
	mounted() {
		this.getnewslist();
	},

	methods: {
		// 获取列表
		getnewslist() {
			this.loading = true;
			let timel = "",
				timer = "";
			if (this.choosedate) {
				timel = this.choosedate[0];
				timer = this.choosedate[1];
			}
			GetNewsList(
				this.currentPage,
				this.searchwords,
				timel,
				timer,
				this.selectval,
				this.typeId
			).then((res) => {
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
			this.getnewslist();
		},
		// 驳回
		openReject(id) {
			this.$prompt("请输入驳回原因", "驳回", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				beforeClose: (action, instance, done) => {
					if (action === "confirm") {
						if (!instance.inputValue) {
							this.$message.error("请输入驳回原因");
						} else if (instance.inputValue.length > 30) {
							this.$message.error(
								`最多输入30个字；当前${instance.inputValue.length}个字`
							);
						} else {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = "";
							RejectArticle(id, instance.inputValue)
								.then((res) => {
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = "确定";
									if (res.code == 0) {
										this.$message.success("操作成功");
										this.getnewslist();
										done();
									} else {
										this.$message.error(res.msg);
									}
								})
								.catch((err) => {
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = "确定";
								});
						}
					} else {
						instance.confirmButtonLoading = false;
						instance.confirmButtonText = "确定";
						done();
					}
				},
			})
				.then(({ value }) => {})
				.catch(() => {});
		},
		// 删除
		deleteRow(row) {
			this.$confirm("确定删除该内容么？")
				.then(() => {
					DelArticle(row.id).then((res) => {
						if (res.code == 0) {
							this.$message.success("删除成功");
							this.getnewslist(this.currentPage);
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
		// 打开详情
		openDetail(row) {
			this.detailid = row.id;
			GetArticleDetail(this.detailid).then((res) => {
				if (res.code == 0) {
					this.artData = res.data;
				} else {
					this.$message.error(res.msg);
				}
			});
			this.detailShow = true;
		},
		// 通过
		passRow(id) {
			this.$confirm("确定审核通过该内容么？")
				.then(() => {
					PassArticle(id).then((res) => {
						if (res.code == 0) {
							this.$message.success("操作成功");
							this.getnewslist();
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
		// 驳回原因
		openReason(row) {
			this.$alert(
				`驳回原因：${row.reject}<br/>审批时间：${row.releaseTime}<br/>审批人员：${row.releaseName}`,
				"驳回",
				{
					confirmButtonText: "确定",
					dangerouslyUseHTMLString: true,
				}
			);
		},
		// 新增的url
		handleimg(url) {
			this.ruleForm.thumb = url;
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
	margin: 20px 0;
}
.table-search {
	margin: 20px 0;
}
.date-choose {
	display: inline-block;
	vertical-align: middle;
	font-size: 0;
}
/deep/ .el-input__icon {
	line-height: 1;
}
/deep/ .el-form-item__span {
	line-height: 36px;
}
/deep/ .el-input__inner {
	height: 36px;
	line-height: 36px;
}
/deep/ .el-date-editor .el-range-separator {
	line-height: 28px;
}
/deep/ .el-date-editor .el-range__icon {
	line-height: 28px;
}
/deep/ .el-select {
	width: 180px;
}
.el-input {
	width: 220px;
}
/deep/.el-table {
	.cell {
		.img-box {
			width: 100%;
			height: 40px;
			overflow: hidden;
			cursor: zoom-in;
			img {
				width: 100%;
				height: 100%;
			}
		}
		a {
			color: #606266;
		}
	}
	.overhide {
		a,
		span {
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
}
._h4 {
	font-size: 16px;
	font-weight: 600;
}
/deep/ .el-card__header {
	padding: 8px 20px;
}

.card-item {
	display: inline-block;
	vertical-align: middle;
	min-width: 22%;
	font-size: 0;
	margin-bottom: 12px;
	span {
		display: inline-block;
		vertical-align: top;
		font-size: 14px;
		line-height: 20px;
		color: #606266;
	}
	img {
		width: 30%;
		cursor: zoom-in;
	}
}
.w25 {
	width: 25%;
}
.w100 {
	width: 100%;
	span {
		max-width: calc(100% - 80px);
	}
}
.el-table tr {
	.edit-btn {
		color: #fff !important;
		text-decoration: none !important;
	}
}
.el-table tr:hover {
	.cell {
		a {
			text-decoration: underline;
			color: #1a8cff;
		}
	}
}
</style>
