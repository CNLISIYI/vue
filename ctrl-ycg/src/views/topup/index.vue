<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="topup" :asideIdx="['0']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card">
						<el-tab-pane>
							<!-- 标签标题 -->
							<span slot="label"> 余额充值 </span>
							<div class="user-top">
								<div>
									<el-avatar
										v-if="$state.companyData.logo"
										:src="$state.companyData.logo"
									></el-avatar>
									<el-avatar icon="el-icon-s-custom" v-else></el-avatar>
									<label>账户余额：</label>
									<label class="blue" v-loading="loading"
										>{{ useraccount }}元</label
									>
								</div>
								<div class="top-item">
									<label>充值金额：</label>
									<el-radio-group v-model="payment">
										<el-radio-button label="500">500元</el-radio-button>
										<el-radio-button label="1000">1000元</el-radio-button>
										<el-radio-button label="2000">2000元</el-radio-button>
										<el-radio-button label="5000">5000元</el-radio-button>
										<el-radio-button label="10000">10000元</el-radio-button>
									</el-radio-group>
									<el-input
										v-model="inputpay"
										placeholder="其他金额"
										type="number"
										@input="handleInput"
										@blur="handleBlur"
									></el-input>
									<label>元</label>
								</div>
								<div class="top-item">
									<label>支付方式：</label>
									<el-radio-group v-model="paytype">
										<el-radio label="alipay" border
											><img
												src="http://image.yuncaigou.net/static/image/zfb.jpg"
											/>支付宝</el-radio
										>
										<el-radio label="weixin" border
											><img
												src="http://image.yuncaigou.net/static/image/wx.jpg"
											/>微信</el-radio
										>
									</el-radio-group>
								</div>
								<div class="submit-btn">
									<el-button
										type="primary"
										@click="submitForm"
										v-loading="subloading"
										element-loading-spinner="el-icon-loading"
										>立即充值</el-button
									>
								</div>
							</div>
							<el-drawer
								title="支付状态"
								:visible.sync="payshow"
								:before-close="handleClose"
								size="40%"
							>
								<div v-if="paytype == 'weixin'">
									<div id="qrcode" ref="qrcode" v-loading="imgloading"></div>
									<p class="tip-p">
										请打开手机{{
											paytype == "alipay" ? "支付宝" : "微信"
										}}扫码完成支付
									</p>
								</div>
								<p class="tip-p" v-else>请在新打开的页面内完成支付</p>
								<div class="submit-btn">
									<el-button type="primary" @click="overpay"
										>已完成支付</el-button
									>
								</div>
							</el-drawer>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { GetUserAccount, PostBanlance } from "../../api/apis";
import QRCode from "qrcodejs2";
export default {
	name: "AppTopUp",
	data() {
		return {
			loading: false, //余额loading
			useraccount: 0, //余额
			payment: 500, //充值选项
			inputpay: "", //充值输入
			paytype: "alipay", //付款方式
			subloading: false, //支付loading
			imgurl: "", //二维码
			payshow: false, //支付弹窗
			imgloading: false, //二维码loading
		};
	},
	created() {},
	computed: {},
	
	mounted() {
		this.getUserAccount();
	},
	

	methods: {
		// 用户余额
		getUserAccount() {
			this.loading = true;
			GetUserAccount()
				.then((res) => {
					this.loading = false;
					if (res.code == 0) {
						this.useraccount = res.body.balance ? res.body.balance : 0;
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.$message.error(err);
				});
		},
		// 输入金额
		handleInput() {
			if (this.inputpay) {
				this.payment = 0;
			}
		},
		handleBlur() {
			if (this.inputpay != "" && this.inputpay < 100) {
				this.$message.error("最低充值金额为100元");
			}
		},
		// 充值
		submitForm() {
			if (!this.payment && this.inputpay == "") {
				this.$message.error("请选择或输入充值金额");
			} else {
				this.subloading = true;
				let _pay = this.inputpay != "" ? this.inputpay : this.payment;
				this.payshow = true;
				this.imgloading = true;
				PostBanlance(_pay, this.paytype)
					.then((res) => {
						this.imgloading = false;
						this.subloading = false;
						if (res.code == 0) {
							if (this.paytype == "weixin") {
								this.imgurl = res.body;
								this.qrcode();
							} else {
								window.open(res.body.url, "_blank");
							}
						} else {
							this.$message.error(res.msg);
						}
					})
					.catch((err) => {
						this.subloading = false;
						this.imgloading = false;
						this.$message.error(err);
					});
			}
		},
		// 扫码支付
		qrcode() {
			this.$nextTick(() => {
				let qrcode = new QRCode("qrcode", {
					width: 200, // 二维码宽度，单位像素
					height: 200, // 二维码高度，单位像素
					// text: "weixin://wxpay/bizpayurl?pr=lKzqVWkzz", // 生成二维码的链接
					text: this.imgurl, // 生成二维码的链接
				});
				this.imgloading = false;
			});
		},
		handleClose(done) {
			this.$confirm("是否已经支付成功？")
				.then(() => {
					this.getUserAccount();
					done();
				})
				.catch(() => {});
		},
		overpay() {
			this.getUserAccount();
			this.payshow = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.user-top {
	padding: 20px;
	.el-avatar {
		vertical-align: middle;
		margin-right: 10px;
		width: 50px;
		height: 50px;
		line-height: 50px;
	}
	label {
		vertical-align: middle;
		text-align: right;
		vertical-align: middle;
		font-size: 14px;
		color: #606266;
		line-height: 1;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
}
.top-item {
	margin-top: 40px;
	.el-input {
		width: 90px;
	}
	.el-radio {
		margin-right: 0;
		padding-top: 10px;
		img {
			width: 20px;
			height: 20px;
			margin-right: 5px;
		}
	}
	/deep/ .el-radio__input {
		display: none;
	}
}
.submit-btn {
	margin-top: 60px;
	text-align: center;
}
#qrcode {
	margin: 20px auto;
	width: 200px;
}
.tip-p {
	text-align: center;
	font-size: 16px;
	font-weight: 600;
	color: #222222;
	line-height: 1;
	margin: 40px 0;
}
</style>
