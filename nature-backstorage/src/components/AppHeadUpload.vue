<template>
	<div class="avatar-uploader">
		<div class="el-upload el-upload--text _position" v-loading="loading">
			<input
				type="file"
				name="file"
				accept="image/png, image/jpeg, image/jpg"
				class="file-input"
				@change="handlefile($event)"
			/>
			<img v-if="imgurl" :src="imgurl" class="avatar" />
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</div>
	</div>
</template>

<script>
import { PostImage } from "../api/apis";
export default {
	name: "AppHeadUpload",
	data() {
		return {
			imgurl: "", //展示url
			loading: false, //上传loading
		};
	},
	mounted() {},
	computed: {},
	watch: {},
	methods: {
		// 上传图片
		handlefile(e) {
			let _file = e.target.files[0];
			if (_file) {
				this.$confirm("确定上传这张图片?")
					.then(() => {
						this.loading = true;
						let formData = new FormData();
						formData.append("file", _file);
						this.$axios
							.post("admin-center/common/upload-image", formData, {
								headers: {
									"Content-Type": "multiple/form-data",
									Accept: "*/*",
									authorization: "Bearer 2005755a-cdfc-4128-89c0-fcd4b430cf69",
								},
							})
							.then((res) => {
								this.loading = false;
								if (res.data.code == 0) {
									this.$message.success("上传成功");
									this.imgurl = res.data.data.url;
									this.$emit("handlefile", res.data.data.url);
								} else {
									this.$message.error(res.msg);
								}
							})
							.catch(() => {
								this.loading = false;
							});
					})
					.catch(() => {
						_file = ''
					});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
