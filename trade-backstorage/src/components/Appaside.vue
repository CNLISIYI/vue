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
				<el-menu-item index="/">
					<i class="el-icon-s-home"></i>
					<span slot="title">首页</span>
				</el-menu-item>
				<el-menu-item index="manageuser">
					<i class="el-icon-s-custom"></i>
					<span slot="title">用户管理</span>
				</el-menu-item>
				<el-menu-item index="managetan">
					<i class="el-icon-s-help"></i>
					<span slot="title">碳汇项目管理</span>
				</el-menu-item>
				<el-menu-item index="agreement">
					<i class="el-icon-s-unfold"></i>
					<span slot="title">协议成交管理</span>
				</el-menu-item>
				<el-menu-item index="managedone">
					<i class="el-icon-s-claim"></i>
					<span slot="title">成交单管理</span>
				</el-menu-item>
				<el-menu-item index="information">
					<i class="el-icon-s-open"></i>
					<span slot="title">行情信息录入</span>
				</el-menu-item>
				<el-submenu index="4">
					<template slot="title">
						<i class="el-icon-s-tools"></i>
						<span>系统设置</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="setuser">人员管理</el-menu-item>
						<el-menu-item index="setrole">角色管理</el-menu-item>
						<el-menu-item index="sethistory">操作记录</el-menu-item>
						<el-menu-item index="setfee">服务费配置</el-menu-item>
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
	},
	computed: {},
	methods: {
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
