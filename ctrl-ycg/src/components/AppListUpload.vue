<template>
	<div class="upload-demo" v-loading="loading">
		<div class="el-button el-button--primary _position el-button--medium">
			<input
				type="file"
				class="file-input"
				accept="image/*"
				ref="file"
				multiple
				@click="handleImage"
				@change="handleViews($event)"
			/>
			<span>点击上传</span>
		</div>
		<p class="input-txt">最多选择{{ max }}张图片。</p>
		<draggable
			v-if="imgList.length > 0"
			:list="imgList"
			:disabled="!enabled"
			class="list-group"
			ghost-class="ghost"
			:move="checkMove"
			@start="dragging = true"
			@end="dragging = false"
		>
			<div
				class="list-group-item"
				v-for="(item, index) in imgList"
				:key="index"
			>
				<img :src="item" @click="$tools.openUrl(item)" :alt="item" />
				<i class="iconfont" @click="deleteImg(index)">&#xe633;</i>
			</div>
			<p class="input-txt">（可拖拽图片进行排序）</p>
		</draggable>
	</div>
</template>

<script>
import { PostImgSize } from "../api/apis";
import { mapState, mapActions } from "vuex";
import draggable from "vuedraggable";
export default {
	name: "AppListUpload",
	components: {
		draggable,
	},
	data() {
		return {
			fileData: {},
			imgList: [], //选择的图片
			loading: false, //上传loading
			enabled: true, //拖拽
			dragging: false,
		};
	},
	props: {
		max: {
			type: Number,
			default: 3,
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
			// immediate: true
		},
	},
	methods: {
		...mapActions(["getUploadSts"]),
		// 选择图片
		handleImage() {
			this.getUploadSts();
		},
		// 拖拽图片
		checkMove(e) {
			window.console.log("index: " + e.draggedContext.futureIndex);
		},
		// 删除图片
		deleteImg(idx) {
			this.imgList.splice(idx, 1);
		},
		// 上传形象
		handleViews(e) {
			let _files = e.target.files;
			let _size = 0;
			if (_files.length > 0) {
				if (this.imgList.length + _files.length > this.max) {
					this.$message.error(`最多上传${this.max}张图片`);
				} else {
					this.fileData = [];
					for (let i = 0; i < _files.length; i++) {
						let _data = {
							name: _files[i].name,
							file: _files[i],
							url: window.URL.createObjectURL(_files[i]),
							size: _files[i].size,
							uploadPath: `newyuncaigou/${this.$state.user_id}/${
								this.$state.user_id
							}_${Math.round(
								new Date().getTime() / 1000
							).toString()}_${parseInt(Math.random() * 999)}.${_files[
								i
							].type.substr(6, 4)}`,
						};
						this.fileData.push(_data);
					}
					this.$confirm("确定上传选中图片?")
						.then(() => {
							this.loading = true;
							for (let i = 0; i < this.fileData.length; i++) {
								this.$tools
									.getClient(this.$state.uploadSts)
									.put(this.fileData[i].uploadPath, this.fileData[i].file)
									.then((res) => {
										if (res.url) {
											this.imgList.push(
												res.url.replace(
													/ctrlyuncaigou.oss-cn-beijing.aliyuncs.com/g,
													"image.yuncaigou.net"
												)
											);
											_size += this.fileData[i].size;
											if (i == this.fileData.length - 1) {
												this.postImgSize(_size);
											}
										} else {
											this.loading = false;
											this.$message.error(res.msg);
										}
									});
							}
						})
						.catch(() => {});
				}
			}
		},
		// 累加文件字节数
		postImgSize(size) {
			PostImgSize(size, "image")
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						console.log("已累加到空间");
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
