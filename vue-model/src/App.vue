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

</style>
