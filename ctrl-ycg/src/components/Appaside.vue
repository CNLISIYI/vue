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
				:unique-opened="true"
			>
				<el-submenu index="1">
					<template slot="title">
						<i class="el-icon-s-management"></i>
						<span>信息管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="productpost">发布商品</el-menu-item>
						<el-menu-item index="productmanage">商品管理</el-menu-item>
						<el-menu-item index="productlow">问题商品</el-menu-item>
						<el-menu-item index="productmove">1688搬家</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="2">
					<template slot="title">
						<i class="el-icon-s-goods"></i>
						<span>增值信息</span>
					</template>
					<el-menu-item-group>
						<template slot="title">
							<div :class="widthflag ? 'pd20' : 'pd40'">百度权益</div>
						</template>
						<el-menu-item index="bdminiapp">百度小程序</el-menu-item>
					</el-menu-item-group>
					<el-menu-item-group>
						<template slot="title">
							<div :class="widthflag ? 'pd20' : 'pd40'">商铺数据</div>
						</template>
						<el-menu-item index="shopscore">商铺评分</el-menu-item>
						<el-menu-item index="solescore" v-if="$state.userData.is_sole == 1"
							>搜了网店铺分</el-menu-item
						>
						<el-menu-item index="shoptrend">趋势变化</el-menu-item>
						<el-menu-item index="shopkeyword">关键词</el-menu-item>
						<el-menu-item index="shoprank">商品排名</el-menu-item>
					</el-menu-item-group>
					<el-menu-item-group>
						<template slot="title">
							<div :class="widthflag ? 'pd20' : 'pd40'">扣费推广</div>
						</template>
						<el-menu-item index="populardata">推广数据</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="3">
					<template slot="title">
						<i class="el-icon-s-tools"></i>
						<span>媒体管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="managephoto">图片管理</el-menu-item>
						<el-menu-item index="managevideo">视频管理</el-menu-item>
						<!-- <el-menu-item index="manageclass">自定义分类</el-menu-item> -->
						<el-menu-item index="manageshop">店铺设置</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="4">
					<template slot="title">
						<i class="el-icon-s-check"></i>
						<span>我的资料</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="myinformate">我的信息</el-menu-item>
						<el-menu-item index="mycertify">实名认证</el-menu-item>
						<el-menu-item index="myability">我的资质</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="5">
					<template slot="title">
						<i class="el-icon-picture"></i>
						<span>资讯信息</span>
					</template>
					<el-menu-item-group>
						<!-- <el-menu-item index="newscompany">企业资讯</el-menu-item> -->
						<!-- <el-menu-item index="newsshow">展会信息</el-menu-item> -->
						<el-menu-item index="newsbuy">求购信息</el-menu-item>
						<el-menu-item index="bdanswer">百度问答</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<!-- <el-submenu index="6">
					<template slot="title">
						<i class="el-icon-s-promotion"></i>
						<span>代发任务</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="agentmanage">任务管理</el-menu-item>
						<el-menu-item index="agentpost">创建任务</el-menu-item>
					</el-menu-item-group>
				</el-submenu> -->
				<!-- <el-submenu index="8">
          <template slot="title">
            <i class="el-icon-star-on"></i>
            <span>加盟星</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index=""></el-menu-item>
          </el-menu-item-group>
        </el-submenu> -->
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
			//默认展开
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
