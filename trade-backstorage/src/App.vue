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
// 页面布局
.app-container {
	width: calc(100% - 200px);
	max-width: calc(100% - 70px);
	position: fixed;
	right: 0;
	top: 60px;
}
.el-main {
	max-height: calc(100vh - 60px);
	overflow-y: scroll;
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
	margin: 20px 0 20px;
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
.input-txt {
	display: block;
	margin-left: 5px;
	font-size: 14px;
	color: #909399;
	margin-right: 20px;

	a {
		color: #1a8cff;
	}
}
.el-card__body {
	li {
		font-size: 14px;
		color: #222222;
		line-height: 22px;
	}
	li+li {
		margin-top: 10px;
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

// 卡片样式
.box-card {
	margin-bottom: 20px;
	h4 {
		float: left;
		line-height: 28px;
		font-size: 18px;
	}
	a {
		margin-left: 20px;
		cursor: auto;
		color: #222;
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
	margin-bottom: 10px;
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

.el-button + .el-button {
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

.el-form-item__label {
	cursor: default;
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

.mt20 {
	margin-top: 20px;
}
.mt100 {
	margin-top: 100px;
}
.ml20 {
	margin-left: 20px;
}
.ml40 {
	margin-left: 40px;
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
.el-breadcrumb {
	margin-bottom: 20px;
}
</style>
