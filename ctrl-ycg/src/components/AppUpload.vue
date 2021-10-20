<template>
	<div>
		<div class="upload-demo">
			<div class="el-button el-button--primary _position">
				<input
					type="file"
					class="file-input"
					id="upload"
					accept="video/mp4, video/m3u8, video/flv, video/avi, video/wmv, video/ts, video/mov, video/3gp"
					ref="file"
					@click="handleImage"
					@change="handlefile($event)"
					v-if="uptype == 'video'"
				/>
				<input
					type="file"
					class="file-input"
					id="upload"
					accept="image/*"
					ref="file"
					multiple
					@click="handleImage"
					@change="handlefile($event)"
					v-else
				/>
				<span>点击上传</span>
			</div>
		</div>
		<!-- 缩略图 -->
		<div v-if="uptype == 'video'">
			<div class="video-box" v-if="fileData[0]">
				<video :src="fileData[0].url" controls="controls"></video>
			</div>
		</div>
		<div v-else>
			<ul
				class="el-upload-list el-upload-list--picture ul-list"
				v-if="fileData.length > 0"
			>
				<li
					class="el-upload-list__item is-success"
					v-for="(item, index) in fileData"
					:key="index"
				>
					<div @click="$tools.openUrl(item.url)">
						<img :src="item.url" class="el-upload-list__item-thumbnail" />
						<a class="el-upload-list__item-name">
							<i class="el-icon-document"></i>
							{{ item.name }}
						</a>
					</div>
					<label class="el-upload-list__item-status-label">
						<i class="el-icon-upload-success el-icon-check"></i>
					</label>
					<i class="el-icon-close" @click="handleRemove(item.name, index)"></i>
				</li>
			</ul>
		</div>
		<div class="sub-btn">
			<el-button
				type="primary"
				@click="uploadSubmit"
				v-loading="loading"
				element-loading-spinner="el-icon-loading"
				>确认上传</el-button
			>
		</div>
	</div>
</template>

<script>
import { PostImgSize, PostPhotos, PostVideo } from "../api/apis";
import { mapState, mapActions } from "vuex";
export default {
	name: "AppUpload",
	data() {
		return {
			loading: false, //相册loading
			fileData: [], //图片列表
			imgUrl: [], //图片上传后url
			imgName: [], //图片name
			imgsize: 0, //图片列表size
			vsize: 0, //视频大小
			vurl: "", //上传后视频url
		};
	},
	props: {
		albumid: {
			type: Number,
			default: 0,
		},
		uptype: {
			type: String,
			default: "photo",
		},
		videoname: {
			type: String,
			default: "",
		},
	},
	mounted() {},
	computed: {
		...mapState(["uploadSts"]),
	},
	watch: {
		uploadSts: {
			handler(val, oldval) {
				this.getUploadSts();
			},
			deep: true,
		},
	},
	methods: {
		...mapActions(["getUploadSts"]),
		// 选择图片
		handleImage() {
			this.getUploadSts();
		},
		// 上传图片
		handlefile(e) {
			let _files = e.target.files;
			if (_files.length > 0) {
				if (this.uptype == "video") {
					this.fileData = [];
				}
				for (let i = 0; i < _files.length; i++) {
					let _data = {
						name: _files[i].name,
						file: _files[i],
						url: window.URL.createObjectURL(_files[i]),
						size: _files[i].size,
						uploadPath: `newyuncaigou/${this.$state.user_id}/${
							this.$state.user_id
						}_${Math.round(new Date().getTime() / 1000).toString()}_${parseInt(
							Math.random() * 999
						)}.${_files[i].type.substr(6, 4)}`,
					};
					this.fileData.push(_data);
				}
			}
		},
		// 上传图片到相册
		uploadPhotos() {
			PostPhotos(this.albumid, this.imgUrl, this.imgName).then((res) => {
				if (res.code == 0) {
					this.loading = false;
					if (res.body) {
						this.$message.success("上传成功");
						this.fileData = [];
						this.imgUrl = [];
						this.imgName = [];
						this.postImgSize(this.imgsize, "image");
						this.$emit("uploadPhotos");
					} else {
						this.$message.error(res.msg);
					}
				} else {
					this.loading = false;
					this.$message.error(res.msg);
				}
			});
		},
		// 上传视频
		uploadVideo() {
			PostVideo(this.vurl, this.vsize, this.videoname).then((res) => {
				if (res.code == 0) {
					this.loading = false;
					if (res.body) {
						this.$message.success("上传成功");
						this.fileData = [];
						this.vurl = "";
						this.videoname = "";
						this.postImgSize(this.vsize, "video");
						this.$emit("uploadVideo");
					} else {
						this.$message.error(res.msg);
					}
				} else {
					this.loading = false;
					this.$message.error(res.msg);
				}
			});
		},
		// 累加文件字节数
		postImgSize(size, type) {
			PostImgSize(size, type)
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						console.log("已累加到空间");
						this.vsize = 0;
						this.imgsize = 0;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		//上传图片
		uploadSubmit() {
			if (this.fileData.length) {
				if (this.uptype == "video") {
					if (this.videoname == "") {
						this.$message.error("请输入视频名称");
					} else {
						this.$confirm("确定上传视频吗？")
							.then(() => {
								this.loading = true;
								if (this.fileData[0].size / 1024 / 1024 > 9) {
									this.loading = false;
									this.$message.error("上传视频大小不能超过 9MB!");
								} else {
									this.vsize = this.fileData[0].size;
									this.$tools
										.getClient(this.$state.uploadSts)
										.put(this.fileData[0].uploadPath, this.fileData[0].file)
										.then((res) => {
											if (res.url) {
												this.vurl = res.url.replace(
													/ctrlyuncaigou.oss-cn-beijing.aliyuncs.com/g,
													"image.yuncaigou.net"
												);
												this.uploadVideo();
											} else {
												this.loading = false;
												this.$message.error(res.msg);
											}
										});
								}
							})
							.catch(() => {});
					}
				} else {
					this.$confirm("确定上传图片吗？")
						.then(() => {
							this.loading = true;
							this.fileData.map((item) => {
								this.$tools
									.getClient(this.$state.uploadSts)
									.put(item.uploadPath, item.file)
									.then((res) => {
										if (res.url) {
											console.log(res.url);
											this.imgUrl.push(
												res.url.replace(
													/ctrlyuncaigou.oss-cn-beijing.aliyuncs.com/g,
													"image.yuncaigou.net"
												)
											);
											this.imgName.push(item.name);
											this.imgsize += item.size;
											if (this.imgUrl.length == this.fileData.length) {
												this.uploadPhotos();
											}
										} else {
											this.loading = false;
											this.$message.error(res.msg);
										}
									});
							});
						})
						.catch(() => {});
				}
			} else {
				this.$message.error("请选择上传文件");
			}
		},
		// 删除图片
		handleRemove(name, idx) {
			this.$confirm(`确定移除 ${name}？`).then(() => {
				this.fileData.splice(idx, 1);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.sub-btn {
	position: fixed;
	bottom: 20px;
	width: 70%;
	right: 0;
	background: #fff;
	padding: 10px 0px;
}
.ul-list {
	height: calc(100vh - 156px);
	padding-bottom: 50px;
	overflow-y: scroll;
}
.video-box {
	margin-top: 20px;
	height: 200px;
	padding-left: 68px;
	video {
		height: 100%;
	}
}
</style>
