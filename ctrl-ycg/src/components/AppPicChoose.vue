<template>
	<div>
		<!-- 选择产品图片 -->
		<div class="up-box">
			<label class="el-form-item__label">选择图库</label>
			<el-select
				v-model="imgStore"
				placeholder="请选择一个图库"
				filterable
				@change="selectImgStore"
			>
				<el-option
					v-for="item in imgOption"
					:key="item.id"
					:label="item.title"
					:value="item.id"
				>
				</el-option>
			</el-select>
			<div class="upload-box" v-if="!readonly" v-loading="uploading">
				<div class="upload-demo">
					<input
						type="file"
						class="file-input"
						id="upload"
						accept="image/*"
						ref="file"
						@click="handleImage"
						@change="handlefile($event)"
					/>
					<a>没有找到图片？点击上传一张新的图片到此相册</a>
				</div>
			</div>
			<div class="imglist-box" v-if="imgList.length > 0" v-loading="loading">
				<div
					:class="[
						'el-image',
						chooselist.indexOf(item.thumb) !== -1 ? 'on' : '',
					]"
					v-for="(item, index) in imgList"
					:key="index"
				>
					<el-image :src="item.thumb" lazy></el-image>
					<span class="title">{{ item.introduce }}</span>
					<div class="img-mask">
						<span @click="previewShow(item.thumb)"
							><i class="el-icon-zoom-in"></i
						></span>
						<span @click="chooseImage(item, index)" v-if="!readonly"
							><i class="el-icon-circle-check"></i
						></span>
					</div>
				</div>
			</div>
		</div>
		<div class="sub-btn">
			<el-button
				type="primary"
				@click="chooseSubmit"
				v-if="imgList.length > 0 && !readonly"
				>确认</el-button
			>
		</div>
		<!-- 预览 -->
		<div class="preview-box" v-if="previewshow">
			<div class="img-box">
				<img :src="previewurl" />
			</div>
			<i class="iconfont" @click="previewshow = false">&#xe633;</i>
		</div>
	</div>
</template>

<script>
import {
	GetPhotoList,
	GetPhotoPics,
	PostImgSize,
	PostPhotos,
} from "../api/apis";
import { mapActions } from "vuex";
export default {
	name: "AppPicChoose",
	data() {
		return {
			previewurl: "", //预览url
			previewshow: false, //打开预览
			chooselist: [],
			imgList: [], //图片列表
			imgOption: [], //图库列表
			imgStore: "", //选中图库
			loading: false, //相册loading
			uploadPath: "", //图片上传地址
			fileData: {}, //图片对象
			filesize: "", //图片大小
			imgfile_url: "", //图片上传后url
			uploading: false, //上传图片loading
		};
	},
	props: {
		maxlength: {
			type: Number,
			default: 9,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		this.getPhotoList();
	},
	computed: {},
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
		// 获取相册列表
		getPhotoList() {
			GetPhotoList(1, "", 99999).then((res) => {
				if (res.code == 0) {
					if (res.body) {
						this.imgOption = res.body.list;
						this.imgStore = this.imgOption[0].id;
						this.getPhotos();
					} else {
						this.$message.error("暂无数据");
					}
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 选中图片
		chooseImage(item, idx) {
			let _idx = this.chooselist.indexOf(item.thumb);
			if (_idx == -1) {
				this.chooselist.length < this.maxlength
					? this.chooselist.push(item.thumb)
					: this.$message.error(`最多只能选择${this.maxlength}张图片`);
			} else {
				this.chooselist.splice(_idx, 1);
			}
		},
		// 预览图片
		previewShow(url) {
			this.previewurl = url;
			this.previewshow = true;
		},
		chooseSubmit() {
			this.$emit("chooseSubmit", this.chooselist);
		},
		// 选择图库
		selectImgStore(value) {
			this.getPhotos();
		},
		// 获取图片
		getPhotos() {
			this.loading = true;
			GetPhotoPics(this.imgStore).then((res) => {
				if (res.code == 0) {
					this.loading = false;
					if (res.body) {
						this.imgList = res.body;
					} else {
						this.$message.error("暂无数据");
					}
				} else {
					this.loading = false;
					this.$message.error(res.msg);
				}
			});
		},
		// 上传图片到相册
		uploadPhotos() {
			PostPhotos(this.imgStore, [this.imgfile_url], [this.fileData.name]).then(
				(res) => {
					if (res.code == 0) {
						this.uploading = false;
						if (res.body) {
							this.$message.success("上传成功");
							this.getPhotos();
							this.postImgSize(this.filesize);
						} else {
							this.$message.error(res.msg);
						}
					} else {
						this.uploading = false;
						this.$message.error(res.msg);
					}
				}
			);
		},
		// 选择图片
		handleImage() {
			this.getUploadSts();
		},
		// 上传图片
		handlefile(e) {
			if (e.target.files[0]) {
				let _file = e.target.files[0];
				this.$confirm("确定上传图片吗？")
					.then(() => {
						this.uploading = true;
						this.fileData = {};
						this.fileData.name = _file.name;
						this.fileData.file = _file;
						this.fileData.url = window.URL.createObjectURL(_file);
						this.filesize = _file.size;
						this.uploadPath = `newyuncaigou/${this.$state.user_id}/${
							this.$state.user_id
						}_${Math.round(new Date().getTime() / 1000).toString()}_${parseInt(
							Math.random() * 999
						)}.${_file.type.substr(6, 4)}`;
						this.$nextTick(() => {
							this.$tools
								.getClient(this.$state.uploadSts)
								.put(this.uploadPath, this.fileData.file)
								.then((res) => {
									if (res.url) {
										this.imgfile_url = res.url.replace(
											/ctrlyuncaigou.oss-cn-beijing.aliyuncs.com/g,
											"image.yuncaigou.net"
										);
										this.uploadPhotos();
									} else {
										this.uploading = false;
										this.$message.error(res.msg);
									}
								});
						});
					})
					.catch(() => {});
			}
		},
		// 累加文件字节数
		postImgSize(size) {
			PostImgSize(size, "image")
				.then((res) => {
					if (res.code == 0) {
						console.log("已累加到空间");
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.upload-box {
	float: right;
	position: relative;
	a {
		font-size: 12px;
		line-height: 60px;
		color: #72767b;
		margin-right: 10px;
	}
	a:hover {
		color: #1a8cff;
		text-decoration: underline !important;
	}
}
.up-box {
	height: calc(100vh - 156px);
	padding-bottom: 50px;
	overflow-y: scroll;
}
.imglist-box {
	width: 100%;
	margin-top: 20px;
	padding-left: 4px;
	display: flex;
	flex-flow: wrap;
	.el-image {
		max-width: 120px !important;
		min-width: 120px !important;
		height: 120px !important;
		flex: 1;
		margin: 0 10px 15px 0;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.title {
		position: absolute;
		bottom: 0;
		left: 0;
		background: rgba(255, 255, 255, 0.5);
		display: block;
		color: #222;
		font-size: 14px;
		text-align: center;
		width: 100%;
	}
	.on {
		box-shadow: 0 0 0 3px #1a8cff;
	}
	.img-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 120px;
		height: 120px;
		background-color: rgba(0, 0, 0, 0.5);
		transition: opacity 0.3s;
		opacity: 0;
		text-align: center;
		span {
			color: #fff;
			font-size: 24px;
			line-height: 120px;
			cursor: pointer;
		}
		span + span {
			margin-left: 10px;
		}
	}
	.el-icon-circle-check:hover {
		color: #1a8cff;
	}
	.el-image:hover {
		.img-mask {
			opacity: 1;
		}
	}
}
.preview-box {
	position: fixed;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background-color: rgba($color: #000000, $alpha: 0.7);
	z-index: 2002;
	.img-box {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		img {
			max-height: 650px;
		}
	}
	.iconfont {
		position: fixed;
		right: 20px;
		top: 60px;
		font-size: 40px;
		color: #fff;
		cursor: pointer;
	}
}
.sub-btn {
	position: fixed;
	bottom: 20px;
	width: 70%;
	right: 0;
	background: #fff;
	padding: 10px 0px;
}
.file-input {
	width: 100%;
	height: 14px;
	opacity: 0;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	cursor: pointer;
}
</style>
