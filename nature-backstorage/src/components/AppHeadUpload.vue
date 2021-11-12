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
						PostImage(_file)
							.then((res) => {
								this.loading = false;
								if (res.code == 0) {
									this.$message.success("上传成功");
									this.imgurl = res.url
									this.$emit("handlefile", res.url);
								} else {
									this.$message.error(res.msg);
								}
							})
							.catch((err) => {
								this.loading = false;
								this.$message.error(err);
							});
					})
					.catch(() => {});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
