<template>
	<div class="avatar-uploader">
		<div class="el-upload el-upload--text _position" v-loading="loading">
			<input
				type="file"
				name="file"
				accept="image/png, image/jpeg, image/jpg"
				class="file-input"
				@click="handleImage"
				@change="handlefile($event)"
			/>
			<img v-if="imgurl" :src="imgurl" class="avatar" />
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</div>
	</div>
</template>

<script>
import { PostImgSize } from "../api/apis";
import { mapState, mapActions } from "vuex";
export default {
	name: "AppHeadUpload",
	data() {
		return {
			fileData: {},
			imgurl: "", //展示url
			image_url: "", //上传后url
			loading: false, //上传loading
		};
	},
	props: {
		noadd: {
			type: Boolean,
			default: false,
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
			let _file = e.target.files[0];
			if (e.target.files[0]) {
				this.fileData = {
					name: _file.name,
					file: _file,
					url: window.URL.createObjectURL(_file),
					size: _file.size,
					uploadPath: `newyuncaigou/${this.$state.user_id}/${
						this.$state.user_id
					}_${Math.round(new Date().getTime() / 1000).toString()}_${parseInt(
						Math.random() * 999
					)}.${_file.type.substr(6, 4)}`,
				};
				this.$confirm("确定上传这张图片?")
					.then(() => {
						this.loading = true;
						this.$tools
							.getClient(this.$state.uploadSts)
							.put(this.fileData.uploadPath, this.fileData.file)
							.then((res) => {
								if (res.url) {
									this.imgurl = this.fileData.url;
									this.image_url = res.url.replace(
										/ctrlyuncaigou.oss-cn-beijing.aliyuncs.com/g,
										"image.yuncaigou.net"
									);
									if (this.noadd) {
										this.loading = false;
										this.$message.success("上传成功");
										this.$emit("handlefile", this.image_url);
									} else {
										this.postImgSize(this.fileData.size);
									}
								} else {
									this.loading = false;
									this.$message.error(res.msg);
								}
							});
					})
					.catch(() => {
						this.fileData = {};
					});
			}
		},
		// 累加文件字节数
		postImgSize(size) {
			PostImgSize(size, "image")
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.$message.success("上传成功");
						this.$emit("handlefile", this.image_url);
					} else {
						this.$message.error(res.msg);
					}
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
</style>
