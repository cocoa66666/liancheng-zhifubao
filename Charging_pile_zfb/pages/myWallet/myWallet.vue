<template>
	<view class="content">
		<view class="title">
			我的钱包
		</view>
		<view class="mySurplus">
			<view class="mySurplus_sub1">我的余额（元）</view>
			<view class="mySurplus_sub2">{{balance}}元</view>
			<!-- <view class="mySurplus_sub3" @tap="refund">退款</view> -->
			<!-- <view class="mySurplus_sub4" @tap="showRecharge">充值</view> -->
		</view>
		<!-- 		<view class="mySurplus2">
			<view class="mySurplus_sub1">我的押金（元）</view>
			<view class="mySurplus_sub2">0.00</view>
			<view class="mySurplus_sub3" data-top_active="1" data-top_data="0" @tap="showMywalletDetail">查看明细</view>
			<view class="mySurplus_sub4">缴纳押金</view>
		</view> -->
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js'
	export default {
		data() {
			return {
				top_active: '',
				balance: '0.00'
			}
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			refund(e) {
				uni.showModal({
					title: '退款申请',
					content: '即将退还全部余额' + this.balance,
					cancelColor: '#bdbdbd',
					confirmColor: "#000000",
					confirmText: '确认',
					success: function(res) {
						if (res.confirm) {
							let self = this;
							let data = {
								esCode: self.stationId
							}
							uni.showLoading({
								title: '加载中'
							})
							utlis.http("POST", 'appElectricPileInfoHj', data, function(res) {
								uni.hideLoading()
								if (res.status == "success") {
									self.pileInfo = res.pileInfo
									self.pileFree = res.pileFree
									self.pileTotal = res.pileTotal
									self.curElecPrice = res.curElecPrice
									self.origElecPrice = res.origElecPrice
									self.listTimeSlot = res.listTimeSlot
									self.parkFee = res.parkFee
									self.siteGuide = res.siteGuide
								} else {}
							})
						} else if (res.cancel) {

						}
					}
				});
			},
			showRecharge(e) {
				uni.navigateTo({
					url: '/pages/recharge/recharge'
				})
			},
			//获取用户信息
			getUserInfo(e) {
				let self = this;
				let data = {
					custName: uni.getStorageSync('custName')
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'appCustCenter', data, function(res) {
					if (res.status == "success") {
						uni.setStorageSync("custName", res.custName);
						self.phone = res.custName;
						self.balance = res.balance;
						uni.hideLoading()
					} else {
						uni.hideLoading()
					}
				})
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
		width: 300rpx;
		height: 66rpx;
		color: rgba(0, 0, 0, 1);
		font-size: 48rpx;
		font-weight: 550;
		letter-spacing: 3rpx;
	}

	.mySurplus {
		position: absolute;
		top: 144rpx;
		left: 30rpx;
		width: 690rpx;
		height: 244rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
	}

	.mySurplus2 {
		position: absolute;
		top: 408rpx;
		left: 30rpx;
		width: 690rpx;
		height: 244rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
	}

	.mySurplus_sub1 {
		position: absolute;
		left: 36rpx;
		top: 22rpx;
		font-size: 30rpx;
		font-weight: 450;
	}

	.mySurplus_sub2 {
		position: absolute;
		left: 36rpx;
		top: 74rpx;
		font-size: 40rpx;
		font-weight: 548;
	}

	.mySurplus_sub3 {
		position: absolute;
		right: 200rpx;
		top: 174rpx;
		font-size: 26rpx;
		color: #FEA503;
	}

	.mySurplus_sub4 {
		position: absolute;
		left: 516rpx;
		top: 162rpx;
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 26rpx;
		color: #FFFFFF;
		background: #FEA503;
		border-radius: 30rpx;
	}
</style>
