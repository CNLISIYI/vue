<template>
	<el-header class="clearfix">
		<router-link :to="{ name: 'home', path: './' }">
			<img src="http://member.yuncaigou.net/static/images/logo.png" />
		</router-link>
		<el-menu
			:default-active="ishome ? '1' : ''"
			class="el-menu-demo"
			mode="horizontal"
			active-text-color="#fff"
		>
			<el-menu-item index="1">
				<router-link :to="{ name: 'home', path: './' }"
					>{{ userData.company }} 你好</router-link
				>
			</el-menu-item>
			<el-submenu index="2">
				<template slot="title">系列产品</template>
				<el-menu-item
					index="2-1"
					@click="$tools.openUrl('https://i.ctrl.cn/Home/')"
					>开创云</el-menu-item
				>
				<el-menu-item
					index="2-2"
					@click="$tools.openUrl('https://www.ctrledu.cn/')"
					>云教育</el-menu-item
				>
				<el-menu-item
					index="2-3"
					@click="$tools.openUrl('http://www.yunlawer.com/')"
					>云律师</el-menu-item
				>
				<el-menu-item
					index="2-4"
					@click="$tools.openUrl('http://member.yuncaigou.net/?url=index')"
					>旧版后台</el-menu-item
				>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title">
					<el-avatar
						v-if="$state.companyData.logo"
						:src="$state.companyData.logo"
					></el-avatar>
					<el-avatar icon="el-icon-s-custom" v-else> </el-avatar>
				</template>
				<el-menu-item
					index="3-1"
					@click="
						$tools.openUrl(
							`https://www.yuncaigou.net/store-${$state.user_id}.html`
						)
					"
					>我的网站</el-menu-item
				>
				<el-menu-item
					index="3-2"
					@click="$tools.openUrl('http://service.yuncaigou.net/')"
					>增值服务后台</el-menu-item
				>
				<el-menu-item index="3-3"
					><router-link :to="{ name: 'message' }"
						>消息中心</router-link
					></el-menu-item
				>
				<el-menu-item index="3-4" @click="$tools.userLogout()"
					>退出登录</el-menu-item
				>
			</el-submenu>
		</el-menu>
	</el-header>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
	name: "AppHeader",
	data() {
		return {};
	},
	props: {
		ishome: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		this.getUserData();
		// this.getCompanyData();

	},
	computed: {
		...mapState(["user_id", "userData", "companyData"]),
	},
	methods: {
		...mapActions(["getUserId", "getUserData", "getCompanyData"]),
	},
};
</script>

<style lang="scss" scoped>
.el-header {
	background-color: #23262e;
	width: 100%;
	img {
		height: 50px;
		position: absolute;
		top: 5px;
		left: 20px;
	}

	.el-menu {
		float: right;
		border: none;
		background-color: transparent;
	}
	/deep/ .el-menu-item {
		transition: 0ms !important;
	}
	/deep/ .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
	/deep/ .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
	/deep/ .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
		background-color: transparent;
	}
	/deep/ .el-menu--horizontal > .el-submenu:focus .el-submenu__title,
	/deep/ .el-menu--horizontal > .el-submenu:hover .el-submenu__title,
	/deep/ .el-menu--horizontal > .el-menu-item:focus .router-link-active,
	/deep/ .el-menu--horizontal > .el-menu-item:hover .router-link-active {
		color: #fff;
	}
	/deep/ .el-submenu.is-active .el-submenu__title {
		border-bottom: 4px solid #1a8cff !important;
	}
	/deep/ .el-menu--horizontal > .el-menu-item.is-active {
		border-bottom: 4px solid #1a8cff !important;
		border-color: #1a8cff;
	}
}

/deep/ .el-submenu [class^="el-icon-"] {
	margin-right: 0px;
}
.el-menu--popup {
	.el-menu-item {
		color: #222 !important;
		a {
			color: #222 !important;
		}
	}

	.el-menu-item:hover {
		color: #1a8cff !important;
		a {
			color: #1a8cff !important;
		}
	}
}
</style>
