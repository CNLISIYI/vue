<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="articlelist" :asideIdx="['0']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 爱采购小课堂 </span>
							<!-- 页面内容 -->
							<el-card class="box-card">
								<div slot="header" class="clearfix">
									<span>资料列表</span>
								</div>
								<ul v-loading="loading">
									<li @click="$tools.openUrl('https://docs.qq.com/doc/DZEhqZWxibWdrQ0Vm')"><a class="red">云采购新版会员后台使用手册</a></li>
									<li
										v-for="(item, index) in articleData"
										:key="index"
										@click="
											$tools.openUrl(
												`https://www.yuncaigou.net/news-show-${item.id}.html`
											)
										"
									>
										<a>{{ item.title }}</a>
										<span>{{ item.updated_at }}</span>
									</li>
								</ul>
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
import { GetArticleList } from "../../api/apis";
export default {
	name: "AppArticleList",
	data() {
		return {
			articleData: [],
			loading: false,
		};
	},
	created() {},
	computed: {},
	destroyed() {
		this.articleData = [];
	},
	mounted() {
		this.getArticleList();
	},

	methods: {
		getArticleList() {
			this.loading = true;
			GetArticleList(100)
				.then((res) => {
					this.loading = false;
					this.articleData = res.body.list;
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.box-card {
	margin-top: 10px;
}
.el-card__header {
	span {
		font-size: 16px;
		font-weight: 600;
	}
}
.box-card {
	li {
		a {
			margin-left: 0;
			cursor: pointer;
			width: calc(100% - 150px);
			display: inline-block;
			padding-left: 5px;
		}
		span {
			float: right;
			padding-right: 5px;
		}
	}
	li:hover {
		background-color: #f7f7f7;

		a {
			color: #1a8cff;
			text-decoration: underline !important;
		}
	}
}
</style>
