<template>
	<tr class="el-table__row">
		<td :rowspan="addnum" class="is-center" v-if="head">
			<div class="cell">
				<span>{{ head }}</span>
			</div>
		</td>
		<td>
			<div class="cell">
				<span>{{ title }}</span>
			</div>
		</td>
		<td class="is-center">
			<div class="cell">
				<span v-if="percent == ''">{{ rate.toFixed(2) * 100 }}%</span>
				<span v-else-if="percent == 'sz'">{{ rate }}{{ unit }}</span>
				<span v-else-if="percent == 'rz'">{{ $tools.superShop(shop) }}</span>
				<span v-else-if="percent == 'kt'">{{
					rate ? "已开通" : "未开通"
				}}</span>
				<span v-else-if="percent == '-'">-</span>
				<span v-else>{{ rate ? "存在" : "不存在" }}</span>
			</div>
		</td>
		<td class="is-center">
			<div class="cell">
				<span v-if="percent == 'rz'">{{
					$tools.superShop(shop) == "无认证" ? "-" : score
				}}</span>
				<span v-else-if="percent == 'kt'">{{ rate ? score : "-" }}</span>
				<span v-else-if="percent == 'cz'">-</span>
				<span v-else>{{ score }}</span>
			</div>
		</td>
		<td class="is-center">
			<div class="cell">
				<span v-if="percent == 'rz'">{{
					$tools.superShop(shop) == "无认证" ? "-" : cons
				}}</span>
				<span v-else-if="percent == 'kt'">{{ rate ? cons : "-" }}</span>
				<span v-else>{{ cons }}</span>
			</div>
		</td>
	</tr>
</template>

<script>
export default {
	name: "AppStarTr",
	data() {
		return {};
	},
	props: {
		percent: {
			type: String,
			default: "", //rz有无认证 kt是否开通 cz是否存在 sz数值+单位
		},
		unit: {
			type: String,
			default: "",
		},
		addnum: {
			type: Number,
			default: 1,
		},
		head: {
			type: String,
			default: "",
		},
		title: {
			type: String,
			default: "",
		},
		rate: {
			type: Number,
			default: 0,
		},
		score: {
			type: Number,
			default: 0,
		},
		cons: {
			type: String,
			default: "-",
		},
		shop: {
			type: Object,
			value: {},
		},
	},
	mounted() {},
	computed: {},
	methods: {},
};
</script>

<style lang="scss" scoped>
</style>
