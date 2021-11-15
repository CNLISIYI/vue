<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="setfee" :asideIdx="['4']"></Appaside>
			<el-container>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>系统设置</el-breadcrumb-item>
						<el-breadcrumb-item>服务费配置</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="tips">
						<p>
							注：交易服务费为平台收取交易双方的服务费用，费用金额即为交易金额*百分比，百分比默认数值为2.5；数值修改后隔天生效
						</p>
					</div>
					<p class="_h4">交易服务费百分比：</p>
					<el-input placeholder="请输入数字" v-model="feedata.rate"> </el-input>
					<span class="_h4">%</span>
					<div class="sub-btn">
						<el-button type="primary" @click="submitForm" v-loading="loading"
							>提交</el-button
						>
					</div>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetFee, PostFee } from "../../api/apis";
export default {
	name: "AppSetUser",

	data() {
		return {
			loading: false, //loading
			feedata: { rate: "" },
		};
	},
	created() {},
	computed: {},
	watch: {},
	mounted() {
		this.getfeedata();
	},

	methods: {
		getfeedata() {
			GetFee().then((res) => {
				if (res.code == 0) {
					this.feedata = res.data;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		submitForm() {
			PostFee(this.feedata.tenantId, this.feedata.rate).then((res) => {
				if (res.code == 0) {
					this.$message.success("保存成功");
				} else {
					this.$message.error(res.msg);
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.tips {
	margin: 20px 0;
}
._h4 {
	font-size: 16px;
	font-weight: 600;
	margin: 20px 0;
	display: inline-block;
	vertical-align: middle;
	line-height: 1;
}
/deep/ .el-input {
	display: inline-block;
	vertical-align: middle;
	width: 200px;
}
.sub-btn {
	margin-top: 40px;
	text-align: left;
	.el-button {
		padding: 12px 40px;
	}
}
</style>
