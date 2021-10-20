<template>
	<div id="app">
		<router-view :key="$route.path" v-if="isrouterAlive"> </router-view>

		<!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :key="$route.path">
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :key="$route.path">
    </router-view> -->
	</div>
</template>

<script>
export default {
	name: "App",
	provide() {
		return {
			reload: this.reload,
		};
	},
	data() {
		return {
			isrouterAlive: true, //页面刷新
		};
	},
	methods: {
		// 页面刷新
		reload() {
			this.isrouterAlive = false;
			this.$nextTick(() => {
				this.isrouterAlive = true;
			});
		},
	},
};
</script>

<style lang="scss">
@import url("../static/css/reset.css");
* {
	outline: none;
}
body {
	height: 100vh;
}
// 页面布局
.app-container {
	width: calc(100% - 200px);
	max-width: calc(100% - 70px);
	position: fixed;
	right: 0;
	top: 60px;
}
.el-tabs--border-card {
	height: calc(100vh - 160px);
	overflow-y: scroll;
	box-shadow: none !important;
	border: none !important;
}
.el-tabs--border-card > .el-tabs__header {
	border: 1px solid #e4e7ed;
	z-index: 10;
}

// 页面标签导航
.el-tabs__item:focus.is-active.is-focus:not(:active) {
	box-shadow: none;
}
// 页面描述栏
.tips {
	padding: 16px;
	background-color: #ecf8ff;
	border-radius: 4px;
	border-left: 5px solid #50bfff;
	margin: 10px 0 20px;
	p {
		font-size: 14px;
		color: #5e6d82;
		line-height: 1.5em;
	}
	a:hover {
		color: #1a8cff;
	}
	ul {
		width: 100%;
		margin: 10px auto 0;
		display: flex;
		flex-flow: wrap;
	}
	li {
		flex: 1;
		text-align: center;
		background-color: #fff;
		padding: 10px 0px;
		a {
			color: green;
			font-size: 22px;
			cursor: auto;
		}
		p {
			font-size: 14px;
			color: #5e6d82;
		}
	}
	li + li {
		margin-left: 10px;
	}
	li:first-child {
		border-radius: 10px 0 0 10px;
	}
	li:last-child {
		border-radius: 0 10px 10px 0;
	}
	li:hover {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
}

// 小屏幕标签页切换按钮
.el-tabs__nav-next,
.el-tabs__nav-prev {
	color: #666;
	line-height: 40px;
	font-size: 20px;
}
.el-tabs__nav-next {
	border-left: 1px solid #e4e7ed;
}
.el-tabs__nav-prev {
	border-right: 1px solid #e4e7ed;
}
// 未购买服务提示条
.el-alert__content {
	width: 100%;
}
.el-alert__description {
	float: right;
	margin: 0 0 0 50px !important;
}
.el-alert__title {
	line-height: 40px;
	font-weight: 400 !important;
}
.el-alert__closebtn {
	top: 24px;
}
// 卡片样式
.box-card {
	h4 {
		float: left;
		line-height: 28px;
		font-size: 18px;
	}
	.el-button {
		float: right;
		span {
			color: #fff;
		}
	}
	li {
		line-height: 28px;
		font-size: 14px;
		margin-bottom: 10px;
		span {
			color: #666;
		}
		img {
			width: 200px;
			height: 100px;
			margin-bottom: 10px;
			cursor: pointer;
		}
		.el-button {
			float: none;
			margin-left: 20px;
		}
	}
	a {
		margin-left: 20px;
		cursor: auto;
		color: #222;
	}
	._hover:hover {
		text-decoration: underline;
		color: #1a8cff;
		cursor: pointer;
	}
}
// 右侧抽屉样式
.el-drawer.rtl {
	top: 80px !important;
	height: calc(100% - 100px) !important;
	border-radius: 6px 0px 0px 6px;
	overflow-y: scroll;
}
.el-drawer__body {
	padding: 65px 20px;
	.tips {
		margin-top: 0px;
	}
}
.el-drawer__header {
	position: fixed;
	z-index: 10;
	background-color: #fff;
	width: 100%;
	border-radius: 6px;
	padding-bottom: 20px;
}
.el-drawer__close-btn {
	position: fixed;
	right: 20px;
}
// 抽屉保存按钮
.footer-btn {
	position: fixed;
	bottom: 20px;
	padding: 20px 0px;
	background: #fff;
	width: 100%;
	z-index: 10;

	button {
		width: 120px;
	}
}
.sub-btn {
	text-align: center;
}

// 输入框样式
.el-input__inner {
	border: 1px solid #dcdfe6;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.el-input__inner:focus {
	border: 1px solid #50bfff;
}

// 表格样式
.el-table th {
	text-align: center !important;
}
.el-pagination {
	margin: 10px auto 40px;
}
.el-table td,
.el-table th {
	padding: 6px 0px;
}
.el-table tr:hover {
	a {
		color: #409eff;
		text-decoration: underline !important;
	}
}
.table-operate {
	float: left;
	font-size: 0;
	.el-button {
		padding: 10px;
		margin-left: 0;
	}
	.el-input__inner {
		line-height: 36px;
		height: 36px;
	}
}
.table-search {
	float: right;
	width: 70%;
	margin-bottom: 10px;
	text-align: right;
	.el-input__inner {
		line-height: 36px;
		height: 36px;
	}
	.el-button {
		padding: 10px;
	}
	.el-input-group__append {
		text-align: center;
	}
}
.clear-search {
	border-left: 1px solid #dcdfe6;
}
.el-pagination__editor {
	vertical-align: baseline !important;
}
.table-box {
	margin: 40px auto;
	display: flex;
	flex-flow: wrap;
	border-top: 1px solid #ebeef5;
	border-left: 1px solid #ebeef5;
	li {
		flex: 1;
		text-align: center;
		font-size: 14px;
	}
	p {
		display: block;
		background: #f5f7fa;
		border-bottom: 1px solid #ebeef5;
		border-right: 1px solid #ebeef5;
		color: #909399;
		line-height: 36px;
	}
	span {
		display: block;
		border-bottom: 1px solid #ebeef5;
		border-right: 1px solid #ebeef5;
		line-height: 36px;
		color: #606266;
	}
}
.el-button+.el-button {
	margin-left: 4px;
}
// 表单
.el-form-item {
	margin-bottom: 16px;
}
.el-message-box__title {
	font-weight: 600;
}
.el-form-item__content {
	line-height: 38px;
}
.el-message-box {
	.pop-p {
		color: #000000;
	}
}
.file-input {
	width: 100%;
	height: 100%;
	opacity: 0;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	cursor: pointer;
}

._position {
	position: relative;

	span {
		cursor: pointer;
	}
}

.input-txt {
	display: inline-block;
	vertical-align: middle;
	margin-left: 5px;
	font-size: 14px;
	color: #909399;
	margin-right: 20px;

	a:hover {
		color: #1a8cff;
	}
}
.el-form-item__label {
	cursor: default;
}

// 拖拽
.list-group {
	margin-top: 10px;
	display: block;

	.input-txt {
		display: block;
		margin-left: 0;
		line-height: 20px;
	}
}
.list-group-item {
	display: inline-block;
	width: 80px;
	height: 80px;
	overflow: hidden;
	margin-right: 5px;
	position: relative;

	.iconfont {
		position: absolute;
		right: 0;
		top: 0;
		cursor: pointer;
		font-size: 20px;
		background: #fff;
		color: #d4d3d3;
		border-radius: 50%;
		overflow: hidden;
		display: inline-block;
		width: 20px;
		height: 20px;
		line-height: 1;
	}

	img {
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
}
.hotedit-ul {
	width: 100%;
	height: 205px;
	overflow-x: scroll;
	white-space: nowrap;
	padding: 10px;
	.hotedit-li {
		display: inline-block;
		padding: 8px;
		overflow: hidden;
		border-radius: 5px;
		width: 140px;
		box-sizing: border-box;
		position: relative;
	}
	.hotedit-li + .hotedit-li {
		margin-left: 10px;
	}
	.hotedit-li:hover {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
	}
	.img-box {
		width: 100%;
		height: 110px;
		margin: 0 auto;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.el-image {
		width: 100px;
		height: 100px;
	}
	.iconfont {
		position: absolute;
		right: 0;
		top: 0;
		font-size: 20px;
		color: #d4d3d3;
		background: #ffffff;
		border-radius: 50%;
		display: inline-block;
		width: 20px;
		height: 20px;
		cursor: pointer;
	}
	.up {
		right: 24px;
		background: #d4d3d3;
		color: #fff;
		font-size: 14px;
		line-height: 20px;
		text-align: center;
	}
	a {
		width: 100%;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		white-space: normal;
		margin-top: 6px;
		font-size: 14px;
		color: #222222;
		line-height: 16px;
		cursor: pointer;
	}
	span {
		width: 100%;
		display: block;
		margin-top: 6px;
		font-size: 14px;
		color: #222222;
		line-height: 16px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
		min-height: 16px;
	}
	a:hover {
		color: #409eff;
	}
}
.edit-subbtn {
	float: right;
}
.w-e-menu:nth-child(12) {
	display: none !important;
}
// 公共颜色
.red {
	color: #ff0000 !important;
}
.green {
	color: #008000 !important;
}
.orange {
	color: #fb8500 !important;
}
.blue {
	color: #1a8cff !important;
}
.poptxt {
	max-width: 550px !important;
	padding: 10px !important;
	color: #606266 !important;
	line-height: 1.5 !important;
	text-align: justify !important;
	font-size: 14px !important;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	border: 1px solid #ebeef5 !important;
	.popper__arrow {
		border-color: transparent transparent #fff !important;
	}
}

.el-popover {
	min-width: auto !important;
}

.mt20 {
	margin-top: 20px;
}
.el-button {
	overflow: hidden;
	vertical-align: middle;
}
.el-select {
	vertical-align: middle;
}
.el-loading-spinner {
	margin-top: 0;
	transform: translateY(-50%);
}
.el-input {
	vertical-align: middle;
}
// 单图上传
.avatar-uploader {
	display: inline-block;
	vertical-align: top;
	border: 1px dashed #d9d9d9;
	width: 120px;
	height: 120px;
	overflow: hidden;
	border-radius: 4px;
}

.avatar-uploader .el-upload {
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 120px;
	height: 120px;
	line-height: 120px !important;
	text-align: center;
}

.avatar {
	width: 120px;
	height: 120px;
	display: block;
}
// 进度条
.progress-box {
	margin: 20px 20px 60px;
	color: #5e6d82;
	h4 {
		display: inline-block;
		vertical-align: middle;
		margin-bottom: 10px;
		font-size: 14px;
	}
	span {
		float: right;
		font-size: 14px;
		margin-top: 10px;
	}
	.title {
		margin-bottom: 10px;
		display: inline-block;
		vertical-align: middle;
		p {
			display: inline-block;
			vertical-align: middle;
		}
		.red {
			font-size: 14px;
		}
		a {
			display: inline-block;
			vertical-align: middle;
			padding: 5px;
		}
	}
}
</style>
