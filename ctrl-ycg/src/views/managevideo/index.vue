<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="managevideo" :asideIdx="['3']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<!-- 相册库 -->
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 视频库 </span>
							<div class="tips">
								<p>
									每个用户默认赠送<span class="red">1G</span
									>视频空间；视频上传成功后，视频大小立即计入总空间，不足或超出后需要到增值服务中自行购买。<a
										class="blue"
										@click="
											$tools.openUrl('https://www.yuncaigou.net/s-show-8.html')
										"
										>点击打开购买地址</a
									>
								</p>
							</div>
							<div class="progress-box">
								<h4>视频空间</h4>
								<div class="title" v-if="percent_v > 80">
									<p class="red">（您的视频空间即将不足，</p>
									<a
										class="el-button el-button--danger"
										@click="
											$tools.openUrl('https://www.yuncaigou.net/s-show-8.html')
										"
										>前往购买视频空间</a
									>
									<p class="red">）</p>
								</div>
								<el-progress
									v-if="percent_v > 0 || percent_v == 0"
									:percentage="percent_v"
									:show-text="false"
									:status="percent_v > 50 ? 'warning' : 'success'"
								></el-progress>
								<span v-if="percent_v > 0 || percent_v == 0"
									>已使用 {{ use_v }} / {{ all_v }}</span
								>
							</div>
							<div class="mt20">
								<div class="table-operate">
									<el-button type="primary" @click="uploadShow = true"
										>上传视频</el-button
									>
								</div>

								<el-table
									:data="tableData"
									border
									style="width: 100%"
									v-loading="loading"
								>
									<el-table-column :resizable="false" fixed label="标题">
										<template slot-scope="scope">
											<a @click="$tools.openUrl(scope.row.video)">{{
												scope.row.title
											}}</a>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="类型"
										align="center"
										width="120"
									>
										<template slot-scope="scope">
											<span v-if="scope.row.filepath == ''" class="blue"
												>本地视频</span
											>
											<span v-else>百度视频</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="本地状态"
										align="center"
										width="80"
									>
										<template slot-scope="scope">
											<span class="green" v-if="scope.row.status == 3"
												>正常</span
											>
											<span class="red" v-else-if="scope.row.status == 1"
												>驳回</span
											>
											<span v-else>待审</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="百度状态"
										align="center"
										width="120"
									>
										<template slot-scope="scope">
											<span class="orange" v-if="scope.row.bd_status == 1"
												>审核中</span
											>
											<span class="green" v-else-if="scope.row.bd_status == 2"
												>审核成功</span
											>
											<span class="red" v-else-if="scope.row.bd_status == 3"
												>审核失败</span
											>
											<span v-else-if="scope.row.bd_status == 4"
												>未提交xml</span
											>
											<span v-else>待审核</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="失败原因"
										align="center"
									>
										<template slot-scope="scope">
											<span>{{
												scope.row.reason ? scope.row.reason : "-"
											}}</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="更新时间"
										align="center"
										width="160"
									>
										<template slot-scope="scope">
											<span>{{ scope.row.addtime }}</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="操作"
										fixed="right"
										align="center"
										width="80"
									>
										<template slot-scope="scope">
											<div>
												<el-button
													@click="deleteVideo(scope.row.id)"
													type="danger"
													size="mini"
													v-loading="delload"
													element-loading-spinner="el-icon-loading"
												>
													删除
												</el-button>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>

							<!-- 上传视频 -->
							<el-drawer title="上传视频" :visible.sync="uploadShow" size="70%">
								<div class="tips">
									<p>
										视频支持的格式为：flv、mp4、m3u8、ts、3gp、mov、avi、wmv
									</p>
									<p>视频大小必须小于9M</p>
								</div>
								<div class="outer">
									<div class="upload-box">
										<label class="el-form-item__label">视频标题</label>
										<el-input
											v-model="videotitle"
											placeholder="请输入视频标题"
										></el-input>
									</div>
									<label class="el-form-item__label">选择视频</label>
									<Appupload
										@uploadVideo="uploadVideo"
										:uptype="'video'"
										:videoname="videotitle"
									></Appupload>
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
import { GetVideoList, DeleteVideos } from "../../api/apis";
import { mapState } from "vuex";
export default {
	name: "AppManageVideo",
	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			tableData: [],
			uploadShow: false, //上传图片弹窗
			videotitle: "", //视频标题
			videoUrl: "", //视频url
			delload: false, //删除按钮loading
			percent_v: 0, //视频空间进度
			use_v: "",
			all_v: "",
		};
	},
	created() {},
	computed: {
		...mapState(["userData"]),
	},
	watch: {
		userData: {
			handler(val, oldval) {
				this.getSize();
			},
			deep: true,
			immediate: true,
		},
	},

	mounted() {
		this.getVideolist();
	},
	destroyed() {
		this.tableData = [];
	},

	methods: {
		// 获取空间大小
		getSize() {
			let v_s = this.$state.userData.video_size,
				v_fs = this.$state.userData.video_full_size;
			this.use_v = this.$tools.bytesToSize(v_s).sizes;
			this.all_v = this.$tools.bytesToSize(v_fs).sizes;
			this.percent_v = (v_s / v_fs) * 100;
		},
		// 获取视频列表
		getVideolist() {
			this.loading = true;
			GetVideoList()
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.tableData = res.body;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 删除视频
		deleteVideo(id) {
			this.$confirm("确定删除此视频吗？")
				.then(() => {
					this.delload = true;
					DeleteVideos(id).then((res) => {
						this.delload = false;
						if (res.code == 0) {
							this.$message.success("操作成功");
							setTimeout(() => {
								this.getVideolist();
							}, 1000);
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch((err) => {
					this.delload = false;
					this.$message.error(err);
				});
		},

		// 上传完成
		uploadVideo() {
			this.uploadShow = false;
			this.getVideolist();
		},
	},
};
</script>

<style lang="scss" scoped>
.outer {
	height: calc(100% - 144px);
}
.upload-box {
	margin-bottom: 15px;
	.el-input {
		width: 50%;
		display: inline-block;
	}
}
.table-operate {
	margin-bottom: 10px;
}
</style>
