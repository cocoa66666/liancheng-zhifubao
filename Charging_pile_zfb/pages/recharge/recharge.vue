<template>
	<view class="content">
		<view class="title">
			预支付
		</view>
		<view class="mySurplus">
			<view class="mySurplus_sub" :class="type==1?'mySurplus_active':''" data-type="1" data-price="50" @tap="clickCharge">50元</view>
		</view>
		<view class="mySurplus2">
			<view class="mySurplus_sub" :class="type==2?'mySurplus_active':''" data-type="2" data-price="100" @tap="clickCharge">100元</view>
		</view>
		<view class="mySurplus3">
			<view class="mySurplus_sub" :class="type==3?'mySurplus_active':''" data-type="3" data-price="150" @tap="clickCharge">150元</view>
		</view>
		<view class="mySurplus4">
			<view class="mySurplus_sub" :class="type==4?'mySurplus_active':''" data-type="4" data-price="200" @tap="clickCharge">200元</view>
			<!-- 						<view v-if="type!=4" class="mySurplus_sub" :class="type==4?'mySurplus_active':''" data-type="4" @tap="clickCharge">其他金额</view>
			<input type="digit" v-if="type==4" @input="onKeyInput" class="mySurplus_sub" :class="type==4?'mySurplus_active':''"
			 data-type="4" focus="true" value=""></input> -->
		</view>
		<!-- 		<view class="mySurplus5">
			<view class="mySurplus_sub" :class="type==5?'mySurplus_active':''" data-type="5" data-price="10" @tap="clickCharge">10元</view>
		</view>
		<view class="mySurplus6">
			<view class="mySurplus_sub" :class="type==6?'mySurplus_active':''" data-type="6" data-price="2" @tap="clickCharge">2元</view>
		</view> -->
		<view class="charge_button">
			<view class="charge_button_left"><span style="font-size: 40rpx;">{{price}}</span>元</view>
			<view class="charge_button_right" @tap="chargeOver">充值</view>
		</view>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js'
	export default {
		data() {
			return {
				type: 1,
				price: 50
			}
		},
		onLoad() {
			console.log(uni.getStorageSync('ewmUrl'))
		},
		methods: {
			clickCharge(e) {
				this.type = e.target.dataset.type;
				this.price = e.target.dataset.price;
				// if (e.target.dataset.type == 4) {
				// 	this.price = 0
				// }
			},
			onKeyInput: function(event) {
				this.price = event.target.value
			},
			chargeOver() {
				let self = this;
				uni.login({
					provider: 'alipay',
					scopes: ['auth_user'],
					success: function(res) {
						console.log(res);
						let data = {
							authCode: res.authCode,
							chargeAmt: self.price, //0.01
							userSource: 2,
							chargeType: 10,
							custName: uni.getStorageSync('custName'),
							payType: 4000
						}
						uni.showLoading({
							title: '加载中'
						})
						utlis.http("POST", 'topupWalletAlipay', data, function(res) {
							uni.hideLoading()
							if (res.status == "success") {
								// 仅作为示例，非真实参数信息。
								uni.requestPayment({
									provider: 'alipay',
									orderInfo: res.trade_no,
									success: function(res) {
										console.log('success:' + JSON.stringify(res));
										let data = {
											custName: uni.getStorageSync('custName'),
											ewmUrl: uni.getStorageSync('ewmUrl'),
											alipay: "1" //1表示 支付宝支付
										}
										uni.showLoading({
											title: '加载中'
										})
										// 扫码成功开始充电
										utlis.http("POST", 'appChargeStartQRCodeHj', data, function(
											res) {
											uni.hideLoading()
											if (res.status == "success") {
												uni.setStorageSync('egCode', res.egCode)
												uni.setStorageSync('stationId', res.stationId)
												uni.setStorageSync('connectorID', res.connectorID)
												my.showToast({
													content: res.msg,
													duration: 3000,
													type: 'success'
												})
												setTimeout(() => {
													uni.redirectTo({
														url: '/pages/charging/charging'
													})
												}, 3000)
											} else {
												my.showToast({
													content: res.msg,
													duration: 3000,
													type: 'none'
												})
												setTimeout(() => {
													uni.reLaunch({
														url: '/pages/power/power'
													});
												}, 3000)
											}
										})
									},
									fail: function(err) {
										my.showToast({
											content: '支付失败！',
											duration: 3000,
											type: 'none'
										})
									}
								})
							} else {
								my.showToast({
									content: res.msg,
									duration: 3000,
									type: 'none'
								})
							}
						})
					}
				});
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(243, 243, 243, 1);
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.title {
		position: absolute;
		top: 48rpx;
		left: 30rpx;
		width: 200rpx;
		height: 66rpx;
		color: rgba(0, 0, 0, 1);
		font-size: 48rpx;
		font-weight: 550;
		letter-spacing: 3rpx;
	}

	.mySurplus_active {
		width: 306rpx;
		height: 120rpx;
		background: #FEA503;
		color: #FFFFFF;
		border-radius: 10rpx;
		box-shadow: 0 4rpx 10rpx 0 rgba(250, 166, 4, 0.5);
	}

	.mySurplus {
		position: absolute;
		top: 144rpx;
		left: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus2 {
		position: absolute;
		top: 144rpx;
		right: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus3 {
		position: absolute;
		top: 304rpx;
		left: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus4 {
		position: absolute;
		top: 304rpx;
		right: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus5 {
		position: absolute;
		top: 464rpx;
		left: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus6 {
		position: absolute;
		top: 464rpx;
		right: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus_sub {
		text-align: center;
		line-height: 120rpx;
	}

	.charge_button {
		width: 100%;
		height: 100rpx;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.charge_button_left {
		width: 490rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 30rpx;
		background: #FFFFFF;
	}

	.charge_button_right {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 260rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 32rpx;
		background: #333333;
		color: #FEA503;
	}
</style>
