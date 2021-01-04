<template>
	<view class="content">
		<view class="title">
			欠费补缴
		</view>
		<view class="mySurplus">
			<view class="mySurplus_sub" :class="type==1?'mySurplus_active':''" data-type="1" :data-price="price_now" @tap="clickCharge">{{price_now}}元</view>
		</view>
		<view class="charge_button">
			<view class="charge_button_left"><span style="font-size: 40rpx;">{{price_now}}</span>元</view>
			<view class="charge_button_right" @tap="chargeOver">补缴</view>
		</view>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js'
	export default {
		data() {
			return {
				type: 1,
				price_now: 0.00
			}
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			//获取用户信息
			getUserInfo() {
				let self = this;
				let data = {
					custName: uni.getStorageSync('custName')
				}
				utlis.http("POST", 'appCustCenter', data, function(res) {
					if (res.status == "success") {
						uni.setStorageSync("custName", res.custName);
						self.price_now = Math.abs(Number(res.balance));
					}
				})
			},
			clickCharge(e) {
				this.type = e.target.dataset.type;
				this.price = e.target.dataset.price;
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
						}
						uni.showLoading({
							title: '加载中'
						})
						utlis.http("POST", 'topupWalletAlipayBj', data, function(res) {
							uni.hideLoading()
							if (res.status == "success") {
								// 仅作为示例，非真实参数信息。
								uni.requestPayment({
									provider: 'alipay',
									orderInfo: res.trade_no,
									success: function(res) {
										console.log('success:' + JSON.stringify(res));
										my.showToast({
											content: '支付成功！',
											duration: 3000,
											type: 'success'
										})
										setTimeout(() => {
											uni.reLaunch({
												url: '/pages/power/power'
											})
										}, 3000)
									},
									fail: function(err) {
										my.showToast({
											content: '支付失败！',
											duration: 3000,
											type: 'none'
										})
										console.log('fail:' + JSON.stringify(err));
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
