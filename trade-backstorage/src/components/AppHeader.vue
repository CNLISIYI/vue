<template>
	<el-header class="clearfix">
		<router-link :to="{ name: 'home', path: './' }">
			<div class="logo-box">
				<h1>Exchange.</h1>
				<p>自然碳汇交易中心</p>
			</div>
			<h4 class="head-h4">自然碳汇交易中心交易系统管理后台</h4>
		</router-link>
		<el-menu
			class="el-menu-demo"
			mode="horizontal"
			active-text-color="#fff"
			v-if="$cookies.get('username')"
		>
			<el-submenu index="1">
				<template slot="title">{{ $cookies.get("username") }}</template>
				<el-menu-item
					index="1-1"
					@click="$router.push({ name: 'changepw' })"
					v-if="$tools.isMenus(8)"
					>修改密码</el-menu-item
				>
				<el-menu-item index="1-2" @click="logout">退出登录</el-menu-item>
			</el-submenu>
		</el-menu>
	</el-header>
</template>

<script>
import { userLogout } from "../api/apis";
import { mapState, mapActions } from "vuex";
export default {
	name: "AppHeader",
	data() {
		return {};
	},
	props: {},
	mounted() {},
	computed: {},
	methods: {
		logout() {
			userLogout(this.$cookies.get("username")).then((res) => {
				if (res.code == 0) {
					this.$message.success("退出成功");
					this.$cookies.set("authorization", "");
					this.$cookies.set("username", "");
					this.$router.push({
						name: "login",
					});
				} else {
					this.$message.error(res.msg);
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.el-header {
	background-color: #23262e;
	width: 100%;
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
.head-h4 {
	position: absolute;
	top: 0;
	left: 218px;
	font-size: 20px;
	line-height: 60px;
	color: #fff;
}
.logo-box {
	position: absolute;
	top: 10px;
	left: 36px;
	h1 {
		font-size: 22px;
		font-weight: 800;
		color: #ffffff;
		line-height: 1;
		margin-bottom: 4px;
	}
	p {
		font-size: 14px;
		font-weight: 500;
		color: #ffffff;
		line-height: 1;
	}
}
</style>
