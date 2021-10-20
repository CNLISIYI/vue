<template>
	<el-footer v-if="userData.company">
		© 2021 开创云采购 客户服务：<span>{{
			userData.toadmin.truename ? userData.toadmin.truename : "开创云"
		}}</span>
		服务电话：<span>{{ userData.toadmin.mobile }}</span> 邮箱：<span>{{
			userData.toadmin.email
		}}</span>
	</el-footer>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "AppFooter",
	data() {
		return {};
	},
	props: {
		// userData: {
		//   type: Object,
		//   value: {},
		// },
	},
	mounted() {},
	computed: {
		...mapState(["userData"]),
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
.el-footer {
	background-color: #f7f7f7;
	color: #666;
	text-align: center;
	padding: 20px;
	font-size: 14px;
	position: fixed;
	bottom: 0;
	right: 0;
	width: calc(100% - 70px);
}
</style>
