<template>
	<el-aside :width="widthflag ? '70px' : '200px'">
		<el-col>
			<el-menu
				:default-active="asideName"
				:default-openeds="asideIdx"
				class="el-menu-vertical-demo"
				:collapse="widthflag"
				@select="handleSelect"
				background-color="#23262E"
				text-color="#fff"
				active-text-color="1a8cff"
				:router="true"
			>
				<el-menu-item index="/" v-if="$tools.isMenus(35)">
					<i class="el-icon-s-home"></i>
					<span slot="title">首页</span>
				</el-menu-item>
				<el-menu-item index="banner" v-if="$tools.isMenus(36)">
					<i class="el-icon-picture"></i>
					<span slot="title">banner图管理</span>
				</el-menu-item>
				<el-submenu index="3" v-if="$tools.isMenus(37)">
					<template slot="title">
						<i class="el-icon-s-tools"></i>
						<span>内容管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="managenews">内容管理</el-menu-item>
						<el-menu-item index="newspost" v-if="$tools.isMenus(46)">发布内容</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="4" v-if="$tools.isMenus(38)">
					<template slot="title">
						<i class="el-icon-s-tools"></i>
						<span>系统设置</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="setuser" v-if="$tools.isMenus(54)">人员管理</el-menu-item>
						<el-menu-item index="setrole" v-if="$tools.isMenus(55)">角色管理</el-menu-item>
						<el-menu-item index="sethistory" v-if="$tools.isMenus(56)">操作记录</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-col>
		<div
			class="open-nav-btn"
			@click="widthflag = !widthflag"
			:style="widthflag ? 'width:70px' : 'width:200px'"
		>
			<i :class="widthflag ? 'el-icon-caret-right' : 'el-icon-caret-left'"></i>
			<span>{{ widthflag ? "展开" : "收起" }}</span>
		</div>
	</el-aside>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
	name: "AppAside",
	data() {
		return {
			widthflag: false,
		};
	},
	props: {
		asideIdx: {
			type: Array,
			value: [],
		},
		asideName: {
			type: String,
			value: "",
		},
	},
	mounted() {
		this.widthflag = this.$state.mobileWidth < 800 ? true : false;
		this.getAllIds();
		this.getMyMenus();
	},
	computed: {
		...mapState(["allIds", "myMenus"]),
	},
	methods: {
		...mapActions(["getAllIds", "getMyMenus"]),
		handleSelect(key, keyPath) {},
	},
};
</script>

<style lang="scss" scoped>
.el-aside {
	background-color: #23262e;
	padding-bottom: 50px;
	overflow-y: scroll;
	z-index: 10;
	height: calc(100vh - 60px);
}
.el-menu {
	border-right: none;
}

.el-avatar {
	background: #dfdfdf;
	font-size: 0 !important;
	.el-icon-s-custom {
		margin-right: 0 !important;
		color: #666;
		font-size: 24px;
	}
}
/deep/ .el-menu-item-group__title {
	padding: 0px !important;
}
.pd20 {
	padding: 7px 0px 7px 20px;
}
.pd40 {
	padding: 7px 0px 7px 40px;
}
.open-nav-btn {
	position: fixed;
	left: 0;
	bottom: 0;
	background-color: #23262e;
	text-align: right;
	cursor: pointer;
	line-height: 40px;
	padding: 0px 20px 10px 0px;
	box-sizing: border-box;
	z-index: 10;
	i {
		color: #fff;
		vertical-align: middle;
		font-size: 18px;
	}
	span {
		color: #fff;
		font-size: 14px;
		vertical-align: middle;
	}
}
</style>
