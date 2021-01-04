<template>
	<view class="content">
		<view class="top">
			<view class="percent_wrap">
				<view class="percent">
					<view class="info">
						<view class="a" :style='"top:"+top+"rpx"'></view>
						<view class="b" :style='"top:"+top+"rpx"'></view>
					</view>
				</view>
				<swiper @change="change">
					<swiper-item v-for="(item ,index) in list" :key="index">
						<view class="swiper-item">
							<view class="percent_cont">{{item.content}}<span v-if='index==0'>%</span></view>
							<view class="percent_foot">{{item.foot}}</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="top_container">
				<view class="top_container_sub">
					<view class="top_container_sub1">累计充电量(度)</view>
					<view class="top_container_sub2">{{power}}</view>
				</view>
				<view class="top_container_sub">
					<view class="top_container_sub1">充电电流(A)</view>
					<view class="top_container_sub2">{{directCurrent}}</view>
				</view>
				<view class="top_container_sub">
					<view class="top_container_sub1">充电电压(V)</view>
					<view class="top_container_sub2">{{limit}}</view>
				</view>
			</view>
			<view class="chargingTime">
				<view class="chargingTime_title">累计服务费(元)</view>
				<view class="chargingTime_content">{{seviceMoney}}</view>
			</view>
			<!--<view class="chargingUsed">
				<view class="chargingUsed_title">充电时间</view>
				<view class="chargingUsed_content">{{time}}</view>
			</view> -->
			<view class="chargingUsed">
				<view class="chargingUsed_title">累计电费(元)</view>
				<view class="chargingUsed_content">{{elecMoney}}</view>
			</view>
			<view class="chargingPrice">
				<view class="chargingTime_title">充电总金额(元)</view>
				<view class="chargingTime_content">{{totalFee}}</view>
			</view>
		</view>
		<!-- <view class="price">电费{{ElectricPrice}}元/度服务费</view> -->
		<view v-if="waitState==0" class="btn" @tap="closeCharging">结束充电</view>
		<view v-if="waitState==1||manualEnd==1" class="btn gre">结束充电</view>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js'
	export default {
		data() {
			return {
				// 轮播
				list: [{
					content: '0.0',
					foot: "正在充电"
				}],
				current: 0,
				egCode: '',
				power: '0度',
				directCurrent: '0A',
				limit: '0V',
				ElectricPrice: 1.15,
				totalFee: 0,
				top: 364,
				time: '',
				time1: 1333, //res.time
				timer: '',
				timeDate: '',
				chargedPower: '0',
				seviceMoney: 0,
				elecMoney: 0,
				waitState: 1,
				manualEnd: ''
			}
		},
		onLoad() {
			let self = this;
			self.egCode = uni.getStorageSync('egCode');
			uni.showLoading({
				title: '正在同步数据'
			})
			self.getUserBattery();
			self.timer = setInterval(() => {
				self.getUserBattery()
			}, 5000);
			// 初始化充电时间
			// var time = self.time1;
			// var h = this.addZero(parseInt(time / 60 / 60 % 24));
			// var m = this.addZero(parseInt(time / 60 % 60));
			// var s = this.addZero(parseInt(time % 60));
			// self.time = h + ':' + m + ':' + s
			// // 充电时间自增长
			// self.timeDate = setInterval(() => {
			// 	time++;
			// 	var h = this.addZero(parseInt(time / 60 / 60 % 24));
			// 	var m = this.addZero(parseInt(time / 60 % 60));
			// 	var s = this.addZero(parseInt(time % 60));
			// 	self.time = h + ':' + m + ':' + s
			// }, 1000)
		},
		onUnload() {
			clearInterval(this.timer);
		},
		methods: {
			// 时间添零
			addZero(num) {
				if (parseInt(num) < 10) {
					num = '0' + num
				}
				return num
			},
			// 轮播监听
			change(e) {
				this.current = e.detail.current;
			},
			// 获取用户状态
			getUserStatus() {
				let data = {
					custName: uni.getStorageSync('custName'),
					returnState: 'charge' //默认charge
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'newAppDetectCustStatus', data, function(res) {
					if (res.status == "success") {
						uni.hideLoading()
					} else {
						uni.hideLoading()
					}
				})
			},
			// 获取充电量
			getUserBattery() {
				let self = this;
				let data = {
					custName: uni.getStorageSync('custName'),
					egCode: self.egCode,
					connectorID: uni.getStorageSync('connectorID'),
					stationId: uni.getStorageSync('stationId')
				}
				utlis.http("POST", 'appChargeIngStateHj', data, function(res) {
					if (res.status == "success") {
						// if (res.autoEnd == 'already') {
						if (res.orderStatus == 2) {
							uni.hideLoading()
							uni.removeStorageSync('egCode');
							uni.removeStorageSync('connectorID')
							uni.removeStorageSync('stationId')
							clearInterval(self.timer)
							my.showToast({
								content: res.msg,
								duration: 3000,
								type: 'none'
							})
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/power/power'
								})
							}, 3000)
							return;
						}
						self.power = res.chargeInfo.power
						self.directCurrent = res.chargeInfo.current
						self.limit = res.chargeInfo.limit
						self.list[0].content = res.chargeInfo.percent
						self.chargedPower = res.chargeInfo.chargedPower
						self.ElectricPrice = res.chargeInfo.servicePrice
						self.totalFee = res.chargeInfo.totalFee
						self.seviceMoney = res.chargeInfo.seviceMoney
						self.elecMoney = res.chargeInfo.elecMoney
						self.waitState = res.chargeInfo.waitState
						self.manualEnd = res.manualEnd
						self.top = 364 - Number(self.list[0].content) * 3.64
						if (res.chargeInfo.waitState == 0) {
							if (res.balanLessThan == 1) {
								if (res.manualEnd == 1) {
									uni.showLoading({
										title: '余额不足结束中'
									})
								} else {
									uni.hideLoading()
								}
							} else {
								if (res.manualEnd == 1) {
									uni.showLoading({
										title: '正在结束中'
									})
								} else {
									uni.hideLoading()
								}
							}
						}
					} else {

					}
				})
			},
			// 结束充电
			closeCharging() {
				let self = this;
				let data1 = {
					custName: uni.getStorageSync('custName'),
					egCode: self.egCode,
					connectorID: uni.getStorageSync('connectorID'),
					stationId: uni.getStorageSync('stationId')
				}
				utlis.http("POST", 'appChargeIngStateHj', data1, function(res) {
					if (res.status == "success") {
						self.power = res.chargeInfo.power
						self.directCurrent = res.chargeInfo.current
						self.limit = res.chargeInfo.limit
						self.list[0].content = res.chargeInfo.percent
						self.chargedPower = res.chargeInfo.chargedPower
						self.ElectricPrice = res.chargeInfo.servicePrice
						self.totalFee = res.chargeInfo.totalFee
						self.seviceMoney = res.chargeInfo.seviceMoney
						self.elecMoney = res.chargeInfo.elecMoney
						self.bottom = Number(self.list[0].content) * 3.64
						let data2 = {
							custName: uni.getStorageSync('custName'),
							egCode: self.egCode,
							total_fee: self.totalFee, //0.01
							stationId: uni.getStorageSync("stationId"),
							connectorID: uni.getStorageSync('connectorID'),
							power: self.power,
							seviceMoney: self.seviceMoney,
							elecMoney: self.elecMoney
						}
						uni.showLoading({
							title: '正在结束中'
						})
						utlis.http("POST", 'appChargeOverHj', data2, function(res) {
							if (res.status == "success") {
								// uni.removeStorageSync('egCode');
								// uni.removeStorageSync('connectorID');
								// uni.removeStorageSync('stationId');
								self.manualEnd = 1
								clearInterval(self.timer)
								setTimeout(() => {
									self.timer = setInterval(() => {
										self.getUserBattery()
									}, 5000);
								}, 1)
								// uni.hideLoading()
								// my.showToast({
								// 	content: res.msg,
								// 	duration: 3000,
								// 	type: 'none'
								// })
								// setTimeout(() => {
								// 	uni.reLaunch({
								// 		url: '/pages/power/power'
								// 	})
								// }, 3000)
							} else {
								// uni.hideLoading()
								my.showToast({
									content: res.msg || '结束充电失败!', //'结束充电失败!'
									duration: 3000,
									type: 'none'
								})
							}
						})
					} else {

					}
				})
			}
		}
	}
</script>

<style>
	.content {
		align-items: center;
		justify-content: center;
		/* background: #F3F3F3; */
		height: 100vh;
		width: 100%;
		overflow: hidden;
		position: relative;
		text-align: center;
	}

	.top {
		width: 100%;
		height: 800rpx;
		position: absolute;
		background: #FFFFFF;
		left: 0;
		top: 0;
	}

	.percent_wrap {
		width: 380rpx;
		height: 380rpx;
		position: absolute;
		left: 185rpx;
		top: 10rpx;
		border-radius: 50%;
		border: 2rpx solid rgba(254, 165, 3, .4);
		box-shadow: 0 0 12rpx 0 rgba(254, 165, 3, 1);
	}

	.percent {
		border-radius: 50%;
		border: 2rpx solid rgba(254, 165, 3, .4);
		color: #FFFFFF;
		text-align: center;
		overflow: hidden;
		position: absolute;
		left: 190rpx;
		top: 190rpx;
		width: 364rpx;
		height: 364rpx;
		transform: translate(-50%, -50%);
	}

	.percent_cont {
		padding-top: 116rpx;
		font-size: 62rpx;
		color: #FFFFFF;
	}

	.percent_foot {
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.top_container {
		display: flex;
		width: 100%;
		height: 74rpx;
		flex-direction: row;
		position: absolute;
		top: 448rpx;
		text-align: center;
	}

	.top_container_sub {
		flex: 1;
		border-right: 2rpx solid #E5E5E5;
	}

	.top_container_sub1 {
		color: #333333;
		font-size: 26rpx;
	}

	.top_container_sub2 {
		font-size: 32rpx;
		font-weight: bold;
		z-index: 2;
	}

	.chargingUsed {
		position: absolute;
		top: 560rpx;
		left: 30rpx;
		width: 690rpx;
		height: 80rpx;
		border-bottom: 2rpx solid #E5E5E5;
	}

	.chargingUsed_title {
		position: absolute;
		left: 10rpx;
		line-height: 80rpx;
		height: 100%;
		font-size: 30rpx;
		font-weight: 540;
	}

	.chargingUsed_content {
		position: absolute;
		right: 10rpx;
		height: 100%;
		line-height: 80rpx;
		font-size: 30rpx;
		color: #FEA503;
	}

	.chargingTime {
		position: absolute;
		top: 640rpx;
		left: 30rpx;
		width: 690rpx;
		height: 80rpx;
		border-bottom: 2rpx solid #E5E5E5;
	}

	.chargingTime_title {
		position: absolute;
		left: 10rpx;
		line-height: 80rpx;
		height: 100%;
		font-size: 30rpx;
		font-weight: 540;
	}

	.chargingTime_content {
		position: absolute;
		right: 10rpx;
		height: 100%;
		line-height: 80rpx;
		font-size: 30rpx;
		color: #FEA503;
	}

	.chargingPrice {
		position: absolute;
		top: 720rpx;
		left: 30rpx;
		width: 690rpx;
		height: 80rpx;
		border-bottom: 2rpx solid #E5E5E5;
	}

	.price {
		font-size: 26rpx;
		position: absolute;
		right: 40rpx;
		bottom: 348rpx;
		font-weight: 600;
	}

	.btn {
		position: absolute;
		left: 80rpx;
		bottom: 162rpx;
		width: 590rpx;
		height: 92rpx;
		background: #FEA503;
		border-radius: 10rpx;
		color: #FFFFFF;
		font-size: 30rpx;
		line-height: 92rpx;
	}

	.gre {
		background: grey;
	}

	/* 波浪 */
	.info {
		width: 364rpx;
		height: 364rpx;
		position: absolute;
		top: 0;
		left: 0;
		background-color: rgba(254, 183, 41, 1);
		border-radius: 50%;
	}

	.a {
		position: absolute;
		left: 50%;
		top: 0;
		width: 728rpx;
		height: 728rpx;
		background: rgba(254, 230, 110, 1);
		animation: roateOne 5s linear infinite;
		border-radius: 47%;
		transform: translate(-50%, -100%) rotate(0);
		z-index: 10;
	}

	.b {
		position: absolute;
		left: 50%;
		top: 0;
		width: 728rpx;
		height: 728rpx;
		background: rgba(254, 230, 110, .3);
		animation: roateOne1 5s linear infinite;
		border-radius: 43%;
		transform: translate(-50%, -100%) rotate(0);
		z-index: 20;
	}

	@keyframes roateOne {
		50% {
			transform: translate(-50%, -101%) rotate(180deg);
		}

		100% {
			transform: translate(-50%, -100%) rotate(360deg);
		}
	}

	@keyframes roateOne1 {
		50% {
			transform: translate(-50%, -101%) rotate(180deg);
		}

		100% {
			transform: translate(-50%, -100%) rotate(360deg);
		}
	}
</style>
