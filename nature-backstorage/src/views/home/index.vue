<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="/" :asideIdx="['/']"></Appaside>
			<el-container>
				<el-main>
					<div class="tips">
						<ul>
							<li v-loading="loading">
								<a>{{ datas.articleValue }}条</a>
								<p>内容总数量</p>
							</li>
							<li v-loading="loading">
								<a>{{ datas.examineArticleValue }}条</a>
								<p>待审批内容</p>
							</li>
							<li v-loading="loading">
								<a>{{ datas.examineBannerValue }}条</a>
								<p>待审批banner图</p>
							</li>
						</ul>
					</div>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>最新公告</span>
						</div>
						<ul v-loading="notiloading">
							<li
								v-for="(item, index) in noticeData"
								:key="index"
								@click="$tools.openUrl(`${item.id}`)"
							>
								{{ item.title }}
							</li>
						</ul>
						<ul v-if="noticeData.length == 0 && !notiloading">
							<li>暂无数据</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>推荐新闻</span>
						</div>
						<ul v-loading="artloading">
							<li
								v-for="(item, index) in newsData"
								:key="index"
								@click="$tools.openUrl(`${item.id}`)"
							>
								{{ item.title }}
							</li>
						</ul>
						<ul v-if="newsData.length == 0 && !artloading">
							<li>暂无数据</li>
						</ul>
					</el-card>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetHomeNotice, GetHomeNews, GetHomeData } from "../../api/apis";
export default {
	name: "AppHome",
	data() {
		return {
			newsData: [], //新闻列表
			noticeData: [], //公告列表
			notiloading: false,
			userinfo: {}, //用户账户
			artloading: false,
			loading: false,
			datas: {},
		};
	},

	created() {},
	mounted() {
		this.getDatas();
		this.getNotice();
		this.getNews();
	},
	computed: {},

	methods: {
		getNotice() {
			this.artloading = true;
			GetHomeNotice()
				.then((res) => {
					this.artloading = false;
					this.noticeData = res.data.slice(0, 3);
				})
				.catch((err) => {
					this.artloading = false;
					this.$message.error(err);
				});
		},
		getNews() {
			this.artloading = true;
			GetHomeNews()
				.then((res) => {
					this.artloading = false;
					this.newsData = res.data;
				})
				.catch((err) => {
					this.artloading = false;
					this.$message.error(err);
				});
		},
		getDatas() {
			this.loading = true;
			GetHomeData()
				.then((res) => {
					this.loading = false;
					this.datas = res.data;
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
@import "index.scss";
</style>
