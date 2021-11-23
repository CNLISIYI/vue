<template>
	<div
		class="echart"
		:id="domid"
		:style="{ float: 'left', width: width, height: height }"
	></div>
</template>

<script>
let Echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");

export default {
	name: "AppEcharts",
	data() {
		return {
			chart: null,
		};
	},
	props: {
		domid: {
			type: String,
			default: "",
		},
		option: {
			type: Object,
			default: {},
		},
		width: {
			type: String,
			default: "50%",
		},
		height: {
			type: String,
			default: "400px",
		},
	},
	mounted() {
		this.init();
	},
	computed: {},
	methods: {
		init() {
			let newPromise = new Promise((resolve) => {
				resolve();
			});
			newPromise.then(() => {
				this.chart = Echarts.init(document.getElementById(this.domid));
				this.chart.setOption(this.option);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.echart {
	min-width: 520px;
}
</style>
