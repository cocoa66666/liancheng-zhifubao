<template>
	<view class="content">
		<view v-if="egCode== '' || egCode== undefined || egCode == null" style="margin-top: -140rpx;text-align: center;position: relative;"
		 @tap="showCode()">
			<image class="logo" src="../../static/img/saoma3x.png"></image>
			<view class="pulse"></view>
			<view class="pulse2"></view>
			<view class="pulse3"></view>
		</view>
		<view v-if="egCode != '' && egCode != undefined && egCode != null" style="margin-top: -140rpx;text-align: center;position: relative;"
		 @tap="showCharging()">
			<view class="logo1">点击进入</view>
			<view class="pulse4"></view>
			<view class="pulse5"></view>
			<view class="pulse6"></view>
		</view>
		<view v-if="back==1" class="back" :style='"opacity:"+boxopa+";z-index:"+zindex'>
			<view class="showCode">
				<swiper class="swiper-box1" @change="change" :current="current">
					<swiper-item v-for="(item,index) in list" :key="index">
						<view class="swiper-item">
							<image class="swiper-img" :src="item.src" mode="widthFix"></image>
							<view class="swiper-item uni-bg-green">{{item.content}}</view>
						</view>
					</swiper-item>
				</swiper>
				<swiper-dot class="dot" :current="current" :list="list"></swiper-dot>
			</view>
			<image class="duigou" @tap="showPic()" src="../../static/img/buzaitixing_icon3x.png"></image>
			<image class="duigou" v-if="picShow==1" @tap="showPic()" src="../../static/img/duigou_icon3x.png"></image>
			<view class="nomore" @tap="showPic()">不再提醒</view>
			<image class="guanbi" src="../../static/img/guanbi3x.png" @tap="hideCode()"></image>
		</view>
		<view v-if="discount1==1" class="discount">
			<image style="width: 100%;height: 100%;" src="../../static/img/kaishichu2x.png">
				<view class="discount_title1">恭喜您</view>
				<view class="discount_title2">获得今日优惠</view>
				<swiper class="swiper-box2" @change="change1" :current="current1" autoplay="true" interval="3000">
					<swiper-item v-for="(item,index) in discountList" :key="index">
						<view class="swiper-item" style="text-align: center;">
							<view class="swiper-item1">优惠时间:{{item.activityStartTime|timestampTo}}</view>
							<view class="swiper-item1">优惠地点:{{item.activityContent}}</view>
							<!-- <view class="swiper-item1">电价:{{item.price}}</view> -->
							<!-- <view class="swiper-item1">服务费:{{item.fee}}</view> -->
							<view class="swiper-item1">服务费折扣:{{item.remark1}}</view>
						</view>
					</swiper-item>
				</swiper>
			</image>
			<image class="guanbi1" src="../../static/img/guanbi3x.png" @tap="closeDiscount"></image>
			<view class="discount_dot">{{current1+1}}/{{discountList.length||1}}</view>
		</view>
		<view v-if="discount1==1" class="mas"></view>
		<view v-if="egCode == '' || egCode == undefined || egCode == null" class="text-area">
			<text class="title">扫码充电</text>
		</view>
		<view v-if="egCode != '' && egCode != undefined && egCode != null" class="text-area">
			<text class="title">正在充电中</text>
		</view>
		<view class="bottom-area">
			<view class="ba_all1" @tap="showPowerDetail()">
				<image class="ba_img1" src="../../static/img/dainzhan3x.png"></image>
				<view>
					<text>电站</text>
				</view>
			</view>
			<view class="ba_all2" @tap="showMine()">
				<image class="ba_img2" src="../../static/img/wode3x.png"></image>
				<view>
					<text>我的</text>
				</view>
			</view>
			<view class="ba_wrap3" @tap="discount">
				<view class="ba_all3">
					<view class="redDot" v-if="discount2==1"></view>
					<image class="ba_img4" src="../../static/img/youhui_icon3x.png"></image>
					<view>
						<text>优惠活动</text>
					</view>
				</view>
			</view>
		</view>
		<sh-toast :shImg="shImg" :content="shToast" v-if="showPop==1"></sh-toast>
		<!-- <button open-type="getUserInfo" @getuserinfo="getUserInfo" class="position:absolute;top:100px;left:0;background:white;width:100px;height:100px;">微信授权</button> -->
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js';
	import swiperDot from "../swiperDot/swiperDot.vue";
	import shToast from "../shToast/shToast.vue";
	export default {
		components: {
			swiperDot,
			shToast
		},
		data() {
			return {
				shToast: '手机号错误，请重新输入范文芳生的娜姐飞鸟时代就咖啡福娃飞机',
				shImg: '../../static/img/wode3x.png',
				title: '扫码充电',
				boxopa: 0,
				zindex: 0,
				back: 0,
				picShow: 0,
				token: '',
				// 轮播
				list: [{
						content: '1、插入充电插头',
						src: "../../static/img/tishi_one3x.png"
					},
					{
						content: '2、扫描二维码/输入ID',
						src: '../../static/img/tishi_two3x.png'
					},
					{
						content: '3、充电完成支付',
						src: '../../static/img/tishi_three3x.png'
					}
				],
				current: 0,
				egCode: '',
				discount1: 0,
				discount2: 0,
				promotionMaxId: '',
				current1: 0,
				//自定义弹窗
				showPop: 0,
				// 优惠
				discountList: [],
			}
		},
		onLoad(e) {
			let pic = uni.getStorageSync('picShow');
			let token = uni.getStorageSync('token');
			let password = uni.getStorageSync('password')
			this.picShow = pic;
			this.token = token;
			if (token) {
				let egCode = uni.getStorageSync('egCode')
				this.egCode = egCode;
				if (uni.getStorageSync('egCode') == '' || uni.getStorageSync('egCode') == undefined || uni.getStorageSync('egCode') ==
					null) {

				} else {
					uni.navigateTo({
						url: '/pages/charging/charging'
					})
				}
			}
		},
		onShow() {
			let token = uni.getStorageSync('token');
			if (token) {
				let egCode = uni.getStorageSync('egCode')
				this.egCode = egCode;
			}
			this.getPromotions();
		},
		methods: {
			// 获取授权信息
			getUserInfo(e) {
				console.log(e)
			},
			// 显示充电状态
			showCharging() {
				let self = this;
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
					null) {
					uni.reLaunch({
						url: '/pages/login/login'
					})
					return;
				}
				uni.navigateTo({
					url: '/pages/charging/charging'
				})
			},
			//模态框隐藏和显示
			showCode() {
				let self = this;
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
					null) {
					uni.reLaunch({
						url: '/pages/login/login'
					})
					return;
				}
				if (this.picShow == 1) {
					// 允许从相机和相册扫码
					uni.scanCode({
						success: function(res) {
							console.log('条码类型：' + res.scanType);
							console.log('条码内容：' + res.result);
							let data = {
								custName: uni.getStorageSync('custName'),
								ewmUrl: res.result
							}
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							// 扫码成功开始充电
							utlis.http("POST", 'appChargeStartQRCodeHj', data, function(
								// utlis.http("POST", 'https://www.hjexyz.cn/lcyj-common-wap/newApp/appChargeStartQRCodeHj', data, function(
								res) {
								uni.hideLoading()
								if (res.status == "success") {
									uni.setStorageSync('egCode', res.egCode)
									uni.setStorageSync('stationId', res.stationId)
									uni.setStorageSync('connectorID', res.connectorID)
									uni.showToast({
										title: res.msg,
										duration: 3000,
										mask: true,
										icon: 'success'
									})
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/charging/charging'
										})
									}, 3000)
								} else {
									uni.showToast({
										title: res.msg,
										duration: 3000,
										mask: true,
										icon: 'none'
									})
								}
							})
						}
					})
				} else {
					this.boxopa = 1;
					this.zindex = 99;
					this.back = 1;
				}
			},
			// 模态框隐藏，调取扫码
			hideCode() {
				let self = this;
				this.boxopa = 0;
				this.zindex = 0;
				this.back = 0;
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						let data = {
							custName: uni.getStorageSync('custName'),
							ewmUrl: res.result
						}
						uni.showLoading({
							title: '加载中',
							mask: true
						})
						// 扫码成功开始充电
						utlis.http("POST", 'appChargeStartQRCodeHj', data, function(
							// utlis.http("POST", 'https://www.hjexyz.cn/lcyj-common-wap/newApp/appChargeStartQRCodeHj', data, function(
							res) {
							uni.hideLoading()
							if (res.status == "success") {
								uni.setStorageSync('egCode', res.egCode)
								uni.setStorageSync('stationId', res.stationId)
								uni.setStorageSync('connectorID', res.connectorID)
								uni.showToast({
									title: res.msg,
									duration: 3000,
									mask: true,
									icon: 'success'
								})
								setTimeout(() => {
									uni.navigateTo({
										url: '/pages/charging/charging'
									})
								}, 3000)
							} else {
								uni.showToast({
									title: res.msg,
									duration: 3000,
									mask: true,
									icon: 'none'
								})
							}
						})
					}
				});
			},
			showPic() {
				if (this.picShow == 0) {
					this.picShow = 1;
					uni.setStorageSync("picShow", this.picShow)
				} else {
					this.picShow = 0
					uni.setStorageSync("picShow", this.picShow)
				}
			},
			// 轮播图
			changeIndicatorDots(e) {
				this.indicatorDots = !this.indicatorDots
			},
			changeAutoplay(e) {
				this.autoplay = !this.autoplay
			},
			intervalChange(e) {
				this.interval = e.target.value
			},
			durationChange(e) {
				this.duration = e.target.value
			},
			change(e) {
				this.current = e.detail.current
			},
			change1(e) {
				this.current1 = e.detail.current
			},
			showPower() {
				uni.navigateTo({
					url: '/pages/power/power'
				});
			},
			showPowerDetail() {
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
					null) {
					uni.reLaunch({
						url: '/pages/login/login'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/power/power'
				});
			},
			showMine() {
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
					null) {
					uni.reLaunch({
						url: '/pages/login/login'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/mine/mine'
				});
			},
			showMywallet() {
				uni.showToast({
					title: '此功能尚未开放！',
					duration: 3000,
					mask: true,
					icon: 'none'
				})
				// if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
				// 	null) {
				// 	uni.reLaunch({
				// 		url: '/pages/login/login'
				// 	});
				// 	return;
				// }
				// uni.navigateTo({
				// 	url: '/pages/myWallet/myWallet'
				// });
			},
			discount() {
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
					null) {
					uni.reLaunch({
						url: '/pages/login/login'
					});
					return;
				}
				this.discount1 = 1;
				this.discount2 = 0;
				uni.setStorageSync('promotionMaxId', this.promotionMaxId);
			},
			closeDiscount() {
				this.discount1 = 0;
			},
			getPromotions() {
				let self = this;
				let data = {}
				// uni.showLoading({
				// 	title: '加载中',
				// 	mask: true
				// })
				utlis.http("POST", 'promotions', data, function(res) {
					if (res.status == "success") {
						self.discountList = res.rechargeRecord;
						self.promotionMaxId = uni.getStorageSync('promotionMaxId');
						if (self.promotionMaxId != res.promotionMaxId) {
							self.discount2 = 1;
							self.promotionMaxId = res.promotionMaxId;
						} else {
							self.discount2 = 0;
						}
						// uni.hideLoading()
					} else {
						// uni.hideLoading()
					}
				})
			},
		},
		filters: {
			timestampTo(timestamp) {
				var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '/';
				var M = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1) + '/') : ((date.getMonth() + 1) + '.');
				var D = (date.getDate() < 10) ? ('0' + date.getDate() + ' ') : (date.getDate() + ' ');
				var h = (date.getHours() < 10) ? ('0' + date.getHours() + ':') : (date.getHours() + ':');
				var m = (date.getMinutes() < 10) ? ('0' + date.getMinutes() + ':') : (date.getMinutes() + ':');
				var s = (date.getSeconds() < 10) ? ('0' + date.getSeconds()) : (date.getSeconds());
				// return Y + M + D + h + m + s;
				return Y + M + D;
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
		background-image: linear-gradient(rgba(250, 166, 4, 1), rgba(255, 162, 2, 1));
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.logo {
		position: relative;
		z-index: 10;
		height: 250rpx;
		width: 250rpx;
		line-height: 250rpx;
		margin-left: auto;
		margin-right: auto;
		color: #FEA503;
		font-size: 34rpx;
		margin-bottom: 180rpx;
		border-radius: 50%;
		text-align: center;
		box-shadow: 0 0 3rpx rgba(254, 200, 72, 1);
	}

	.logo1 {
		position: relative;
		z-index: 10;
		height: 210rpx;
		width: 210rpx;
		line-height: 230rpx;
		margin-left: auto;
		margin-right: auto;
		color: #FEA503;
		font-size: 34rpx;
		margin-bottom: 180rpx;
		border-radius: 50%;
		background: #fed573;
		text-align: center;
		box-shadow: 0 0 3rpx rgba(254, 200, 72, 1);
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #FFFFFF;
		font-weight: 320;
		letter-spacing: 5rpx;
	}

	/* 底部 */
	.bottom-area {
		position: absolute;
		bottom: -33vh;
		left: -25%;
		background: #FFFFFF;
		width: 150%;
		height: 50vh;
		border-radius: 50%;
		text-align: center;
	}

	.ba_all1 {
		position: absolute;
		left: 27%;
		top: 10%;
		color: #FEA503;
		width: 100rpx;
		height: 100rpx;
		font-size: 22rpx;
	}

	.ba_img1 {
		width: 50rpx;
		height: 50rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.ba_all2 {
		position: absolute;
		right: 27%;
		top: 10%;
		color: #FEA503;
		width: 100rpx;
		height: 100rpx;
		font-size: 22rpx;
	}

	.ba_img2 {
		width: 50rpx;
		height: 50rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.ba_wrap3 {
		margin: 0 auto;
		position: relative;
		top: -75rpx;
		border-radius: 50%;
		width: 180rpx;
		height: 180rpx;
		background: #FFFFFF;
		padding-top: 15rpx;
	}

	.ba_all3 {
		color: #FEA503;
		box-sizing: border-box;
		width: 150rpx;
		height: 150rpx;
		margin-left: 15rpx;
		font-size: 22rpx;
		border-radius: 50%;
		border: 5rpx #fed573 solid;
		box-shadow: 0rpx 0rpx 3rpx #fed573;
	}

	.ba_img3 {
		margin-top: 37.5rpx;
		width: 50rpx;
		height: 50rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.ba_img4 {
		margin-top: 29rpx;
		width: 55rpx;
		height: 55rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.redDot {
		width: 14rpx;
		height: 14rpx;
		background: red;
		position: absolute;
		right: 50rpx;
		top: 40rpx;
		border-radius: 50%;
	}

	/* 扩散波纹 */
	@keyframes warn {
		0% {
			transform: scale(0.4);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.55);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	@-webkit-keyframes warn {
		0% {
			transform: scale(0.4);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.55);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	/* 产生动画（向外扩散变大）的圆圈  */
	.pulse {
		position: absolute;
		width: 400rpx;
		height: 400rpx;
		left: -75rpx;
		top: -75rpx;
		/* border: 1rpx solid #fed573; */
		background: linear-gradient(rgba(250, 180, 16, 1), rgba(254, 165, 3, 1));
		/* 	    border: 6rpx solid rgba(84, 198, 124);
        background: rgba(84, 198, 124); */
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;
		z-index: 2;
		opacity: 1;
		-webkit-animation: warn 4s linear;
		-moz-animation: warn 4s linear;
		animation: warn 4s linear;
		-webkit-animation-iteration-count: infinite;
		-moz-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
	}

	@keyframes warn2 {
		0% {
			transform: scale(0.5);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.55);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	@-webkit-keyframes warn2 {
		0% {
			transform: scale(0.5);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.55);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	/* 产生动画（向外扩散变大）的圆圈  */
	.pulse2 {
		position: absolute;
		width: 300rpx;
		height: 300rpx;
		left: -25rpx;
		top: -25rpx;
		border: 1rpx solid #fed14a;
		background: linear-gradient(rgba(250, 190, 37, 1), rgba(254, 165, 3, 1));
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;
		z-index: 3;
		opacity: 1;
		-webkit-animation: warn2 4s linear;
		-moz-animation: warn2 4s linear;
		animation: warn2 4s linear;
		-webkit-animation-iteration-count: infinite;
		-moz-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
	}

	@keyframes warn3 {
		0% {
			transform: scale(0.3);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.5);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	@-webkit-keyframes warn3 {
		0% {
			transform: scale(0.3);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.5);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	/* 产生动画（向外扩散变大）的圆圈  */
	.pulse3 {
		position: absolute;
		width: 500rpx;
		height: 500rpx;
		left: -125rpx;
		top: -125rpx;
		/* border: 1rpx solid linear-gradient(rgba(85, 200, 125, 1), rgba(79, 183, 115, 1)); */
		background: linear-gradient(rgba(250, 174, 20, 1), rgba(254, 165, 3, 1));
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;
		z-index: 1.5;
		opacity: 1;
		-webkit-animation: warn3 4s linear;
		-moz-animation: warn3 4s linear;
		animation: warn3 4s linear;
		-webkit-animation-iteration-count: infinite;
		-moz-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
	}



	/* 产生动画（向外扩散变大）的圆圈  */
	.pulse4 {
		position: absolute;
		width: 400rpx;
		height: 400rpx;
		left: -95rpx;
		top: -95rpx;
		/* border: 1rpx solid #fed573; */
		background: linear-gradient(rgba(250, 180, 16, 1), rgba(254, 165, 3, 1));
		/* 	    border: 6rpx solid rgba(84, 198, 124);
        background: rgba(84, 198, 124); */
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;
		z-index: 2;
		opacity: 1;
		-webkit-animation: warn 4s linear;
		-moz-animation: warn 4s linear;
		animation: warn 4s linear;
		-webkit-animation-iteration-count: infinite;
		-moz-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
	}

	@keyframes warn2 {
		0% {
			transform: scale(0.5);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.55);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	@-webkit-keyframes warn2 {
		0% {
			transform: scale(0.5);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.55);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	/* 产生动画（向外扩散变大）的圆圈  */
	.pulse5 {
		position: absolute;
		width: 300rpx;
		height: 300rpx;
		left: -45rpx;
		top: -45rpx;
		border: 1rpx solid #fed14a;
		background: linear-gradient(rgba(250, 190, 37, 1), rgba(254, 165, 3, 1));
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;
		z-index: 3;
		opacity: 1;
		-webkit-animation: warn2 4s linear;
		-moz-animation: warn2 4s linear;
		animation: warn2 4s linear;
		-webkit-animation-iteration-count: infinite;
		-moz-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
	}

	@keyframes warn3 {
		0% {
			transform: scale(0.3);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.5);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	@-webkit-keyframes warn3 {
		0% {
			transform: scale(0.3);
			opacity: 0.3;
		}

		25% {
			transform: scale(0.5);
			opacity: 0.6;
		}

		50% {
			transform: scale(0.65);
			opacity: 1;
		}

		75% {
			transform: scale(0.8);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	/* 产生动画（向外扩散变大）的圆圈  */
	.pulse6 {
		position: absolute;
		width: 500rpx;
		height: 500rpx;
		left: -145rpx;
		top: -145rpx;
		/* border: 1rpx solid linear-gradient(rgba(85, 200, 125, 1), rgba(79, 183, 115, 1)); */
		background: linear-gradient(rgba(250, 174, 20, 1), rgba(254, 165, 3, 1));
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;
		z-index: 1.5;
		opacity: 1;
		-webkit-animation: warn3 4s linear;
		-moz-animation: warn3 4s linear;
		animation: warn3 4s linear;
		-webkit-animation-iteration-count: infinite;
		-moz-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
	}




	/* 弹窗 */
	.showCode {
		display: inline-block;
		height: 632rpx;
		width: 552rpx;
		transition: .5s;
		overflow: hidden;
		background: #ffffff;
		position: fixed;
		top: 138rpx;
		left: 100rpx;
		z-index: 1;
		border-radius: 8rpx;
		text-align: center;
	}

	.back {
		width: 100%;
		height: 100vh;
		position: fixed;
		transition: .5s;
		left: 0;
		top: 0;
		z-index: -1;
		background: rgba(0, 0, 0, 0.5);
	}

	.guanbi {
		width: 60rpx;
		height: 60rpx;
		position: fixed;
		transition: .5s;
		z-index: 1;
		top: 836rpx;
		left: 346rpx;
	}

	.duigou {
		width: 26rpx;
		height: 26rpx;
		position: fixed;
		z-index: 1;
		top: 812rpx;
		left: 514rpx;
	}

	.nomore {
		width: 98rpx;
		height: 34rpx;
		position: fixed;
		top: 808rpx;
		left: 554rpx;
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.swiper-box1 {
		height: 500rpx !important;
	}

	.swiper-box2 {
		height: 100% !important;
		margin-top: -320rpx;
	}

	.swiper-img {
		width: 404rpx;
		height: 332rpx;
		margin: 0 auto;
		margin-top: 38rpx;
	}

	.swiper-item {
		color: rgba(102, 102, 102, 1);
		margin-top: 20rpx;
	}

	.swiper-item1 {
		color: rgba(102, 102, 102, 1);
		margin-top: 5rpx;
	}

	.discount {
		width: 526rpx;
		height: 660rpx;
		position: fixed;
		top: 166rpx;
		left: 112rpx;
		z-index: 10;
		border-radius: 10rpx;
	}

	.discount_dot {
		text-align: center;
		position: absolute;
		bottom: 10rpx;
		width: 100%;
		color: #FEA503;
	}

	.mas {
		width: 100%;
		height: 100vh;
		position: fixed;
		transition: .5s;
		left: 0;
		top: 0;
		z-index: 9;
		background: rgba(0, 0, 0, 0.5);
	}

	.discount_title1 {
		position: absolute;
		top: 130rpx;
		width: 100%;
		text-align: center;
		color: #FFFFFF;
		font-size: 56rpx;
		letter-spacing: 2rpx;
	}

	.discount_title2 {
		position: absolute;
		top: 220rpx;
		width: 100%;
		text-align: center;
		color: #FFFFFF;
		font-size: 46rpx;
		letter-spacing: 2rpx;
	}

	.guanbi1 {
		width: 60rpx;
		height: 60rpx;
		position: fixed;
		transition: .5s;
		z-index: 1;
		bottom: 294rpx;
		left: 345rpx;
	}
</style>
