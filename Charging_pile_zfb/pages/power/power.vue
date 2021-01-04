<template>
	<view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map id="myMap" show-location style="width: 100%; height: 100vh;" :latitude="latitude" :longitude="longitude"
				 :markers="markers" :scale="scale" @markertap='showPowerDetail' @regionchange="getData">
				</map>
			</view>
		</view>
		<view class="search">
			<image class="serach_img" src="../../static/img/sousuo3x.png"></image>
			<input @tap="getInput" :v-model="inputValue" @input="onKeyInput" class="search_ipt" placeholder="请输入你想要去的地点"
			 placeholder-class="search_pla" value=""></input>
		</view>
		<view class="search_content" v-if="inputValue!=''&&mask1==1">
			<view @tap="moveToSelect(item.location.lat,item.location.lng)" class="search_content_word" v-for="(item,index) in selectRes"
			 :key='index'>{{item.title}}</view>
		</view>
		<view v-if="egCode == '' || egCode == undefined || egCode == null" class="bottom_scan" @tap="scan">
			<image class="search_scan" src="../../static/img/saoma23x.png"></image>
			扫码充电
		</view>
		<view v-if="egCode != '' && egCode != undefined && egCode != null" class="bottom_scan2" @tap="warn">
			<image class="search_scan" src="../../static/img/saoma23x.png"></image>
			正在充电中
		</view>
		<view class="search_mine" @tap="showMine()">
			<image class="ba_img2" src="../../static/img/wode3x.png"></image>
			<view style="margin-top: -7rpx;">
				<text>我的</text>
			</view>
		</view>
		<view v-if="discountList.length!=0" class="search_discount" @tap="discount()">
			<view class="redDot" v-if="discount2==1"></view>
			<image class="ba_img2" src="../../static/img/youhui_icon3x.png"></image>
			<view style="margin-top: -7rpx;">
				<text>优惠</text>
			</view>
		</view>
		<view class="search_wallet" @tap="wallet">
			<image class="ba_img2" src="../../static/img/power_wallet.png"></image>
			<view style="margin-top: -7rpx;">
				<text>钱包</text>
			</view>
		</view>
		<image class="search_img" src="../../static/img/daiyuan3x.png" @tap="moveToNow"></image>
		<view v-if="discount1==1" class="discount">
			<image style="width: 100%;height: 100%;" src="../../static/img/kaishichu2x.png">
				<view class="discount_title0">货拉拉、东风、T3、出租车</view>
				<view class="discount_title1">专享</view>
				<view class="discount_title2">获得今日优惠</view>
				<swiper class="swiper-box2" @change="change1" :current="current1" autoplay="true" interval="3000">
					<swiper-item v-for="(item,index) in discountList" :key="index">
						<view class="swiper-item" style="text-align: center;">
							<view class="swiper-item1">优惠时间:{{item.activityStartTime|timestampTo}}13131313</view>
							<view class="swiper-item1">优惠地点:{{item.activityContent}}13131313</view>
							<!-- <view class="swiper-item1">电价:{{item.price}}</view> -->
							<!-- <view class="swiper-item1">服务费:{{item.fee}}</view> -->
							<view class="swiper-item1">服务费折扣:{{item.remark1}}13131313</view>
						</view>
					</swiper-item>
				</swiper>
			</image>
			<image class="guanbi1" src="../../static/img/guanbi3x.png" @tap="closeDiscount"></image>
			<view class="discount_dot">{{current1+1}}/{{discountList.length||1}}</view>
		</view>
		<view v-if="discount1==1" class="mas" @tap="closeDiscount"></view>
		<view class="news" v-if="news==1">
			<view class="news_title">系统维护通知</view>
			<view class="news_content">
				<view style="text-align: center;">尊敬的各位用户，系统将于</view>
				<view style="color:red;font-size: 30rpx;text-align: center;">今日 11:00:00-12:00:00</view>进行维护，为此给您带来的不便我们深表歉意。
			</view>
			<image class="guanbi2" src="../../static/img/guanbi3x.png" @tap="closeNews"></image>
		</view>
		<view v-if="news==1" class="mas2" @tap="closeNews"></view>
		<view class="mask" v-if="showModal==1">
			<view class="modal">
				<view class="modal_content">
					尊敬的用户，您上次充电欠费<span style="color: red;font-size: 34rpx;">{{Math.abs(balance)}}</span>元，需补缴后才能进行本次充电，您也可以在钱包中查看欠费金额。
				</view>
				<view class="modal_confirm">
					<view @tap="modal_cancel" class="modal_confirm_flex" style="border-radius: 0 0 0 20rpx;color: #999999;">取消</view>
					<view @tap="modal_confirm" class="modal_confirm_flex" style="border-radius: 0 0 20rpx 0;color: #000000;">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js';
	var map = uni.createMapContext('myMap');
	export default {
		data() {
			return {
				news: 0,
				title: 'map',
				latitude: '', //目的地纬度
				longitude: '', //目的地经度 
				latitudeFinal: '', //目的地纬度
				longitudeFinal: '', //目的地经度 
				polyline: [], //路线
				scale: 14, //缩放级别
				latFrom: '',
				lngFrom: '',
				latTo: '',
				lngTo: '',
				circles: [],
				electricStationList: '',
				markers: [],
				inputValue: '',
				selectRes: '',
				mask1: 0,
				egCode: '',

				current: 0,
				discount1: 0,
				discount2: 0,
				promotionMaxId: '',
				current1: 0,
				//自定义弹窗
				showPop: 0,
				// 优惠
				discountList: [],
				picShow: 0,
				token: '',
				balance: 0,
				showModal: 0,
			}
		},
		onLoad() {
			let self = this;
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
			// 获取现在位置
			uni.getSetting({
				success(res) {
					if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
						// 授权失败
						uni.showModal({
							title: '"联城联充"需要获取你的地理位置',
							content: '你的位置将用于电站展示',
							success: function(res) {
								if (res.confirm) {
									uni.openSetting({
										success: (res) => {
											uni.getLocation({
												success: function(res) {
													self.latitude = res.latitude;
													self.longitude = res.longitude;
													self.getData()
												},
												fail: () => {
													uni.showModal({
														// title: '提示',
														content: '获取用户位置失败，请开启定位功能，已为您定位到武汉',
														showCancel: false,
														success: function(res) {
															if (res.confirm) {
																// self.latitude = 30.588866;
																// self.longitude = 114.23005;
																self.latitude = 30.531855;
																self.longitude = 114.315904;
																self.getData()
															}
														}
													})
												}
											})
										}
									})
								}
								if (res.cancel) {
									uni.getLocation({
										success: function(res) {
											self.latitude = res.latitude;
											self.longitude = res.longitude;
											self.getData()
										},
										fail: () => {
											uni.showModal({
												// title: '提示',
												content: '获取用户位置失败，请开启定位功能，已为您定位到武汉',
												showCancel: false,
												success: function(res) {
													if (res.confirm) {
														// self.latitude = 30.588866;
														// self.longitude = 114.23005;
														self.latitude = 30.531855;
														self.longitude = 114.315904;
														self.getData()
													}
												}
											})
										}
									})
								}
							}
						})
					} else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
						uni.getLocation({
							success: function(res) {
								self.latitude = res.latitude;
								self.longitude = res.longitude;
								self.getData()
							},
							fail: () => {
								uni.showModal({
									// title: '提示',
									content: '获取用户位置失败，请开启定位功能，已为您定位到武汉',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											// self.latitude = 30.588866;
											// self.longitude = 114.23005;
											self.latitude = 30.531855;
											self.longitude = 114.315904;
											self.getData()
										}
									}
								})
							}
						})
					} else { //授权后默认加载
						uni.getLocation({
							success: function(res) {
								self.latitude = res.latitude;
								self.longitude = res.longitude;
								self.getData()
							},
							fail: () => {
								uni.showModal({
									// title: '提示',
									content: '获取用户位置失败，请开启定位功能，已为您定位到武汉',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											// self.latitude = 30.588866;
											// self.longitude = 114.23005;
											self.latitude = 30.531855;
											self.longitude = 114.315904;
											self.getData()
										}
									}
								})
							}
						})
					}
				}
			});
			this.getPromotions();
		},
		onShow() {
			let self = this;
			this.searchAdvancePay();
			if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
				null) {} else {
				this.getUserInfo();
			}
			let token = uni.getStorageSync('token');
			if (token) {
				let egCode = uni.getStorageSync('egCode')
				this.egCode = egCode;
			}
		},
		methods: {
			modal_cancel() {
				this.showModal = 0;
			},
			modal_confirm() {
				this.showModal = 0;
				uni.navigateTo({
					url: '/pages/arrears/arrears'
				})
			},
			//获取用户信息
			getUserInfo(e) {
				let self = this;
				let data = {
					custName: uni.getStorageSync('custName')
				}
				utlis.http("POST", 'appCustCenter', data, function(res) {
					if (res.status == "success") {
						uni.setStorageSync("custName", res.custName);
						self.balance = Number(res.balance);
					} else {}
				})
			},
			mask() {
				this.mask1 = 0
			},
			selectResult() {
				let self = this;
				uni.request({
					url: "https://apis.map.qq.com/ws/place/v1/suggestion",
					data: {
						keyword: self.inputValue,
						// region: '武汉',
						// location: '30.49984,114.34253',
						get_subpois: 1,
						page_size: 10,
						key: 'G6HBZ-47UW4-W47U6-DXVNE-HSYDQ-EAFF3'
					},
					success: (res) => {
						//返回搜索结果
						self.selectRes = res.data.data
					}
				})
			},
			// 回到当前位置
			moveToNow() {
				// var map = uni.createMapContext('myMap');
				map.moveToLocation();
				//获取当前缩放等级
				// map.getScale({
				// 	success:(res)=>{
				// 		console.log(res)
				// 	}
				// })
				// // 获取地图中心位置
				// map.getCenterLocation({
				// 	success(res) {
				// 		console.log(res)
				// 	}
				// });
			},
			// 前往搜索位置
			moveToSelect(a, b) {
				console.log(a, b)
				this.mask1 = 0
				// var map = uni.createMapContext('myMap');
				map.moveToLocation({
					latitude: a,
					longitude: b
				});
				this.getData();
			},
			showPowerDetail(e) {
				console.log(e)
				uni.navigateTo({
					url: '/pages/powerDetail/powerDetail' + e.markerId
				})
			},
			onKeyInput: function(event) {
				let self = this;
				this.mask1 = 1
				this.inputValue = event.target.value
				this.selectResult()
			},
			getInput: function(event) {
				let self = this;
				this.mask1 = 1
				this.selectResult()
			},
			warn() {
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
					null) {
					uni.reLaunch({
						url: '/pages/login/login'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/charging/charging'
				})
			},
			// 扫码充电
			scan() {
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
					null) {
					uni.reLaunch({
						url: '/pages/login/login'
					});
					return;
				}
				if (this.balance < 0) {
					this.showModal = 1;
					return;
				}
				uni.scanCode({
					success: function(res) {
						console.log('条码内容：' + res.result, '条码类型：' + res.scanType);
						uni.setStorageSync('ewmUrl', res.result)
						let self = this;
						let data = {
							custName: uni.getStorageSync('custName'),
							ewmUrl: res.result
						}
						uni.showLoading({
							title: '加载中'
						})
						utlis.http("POST", 'advancePay', data, function(res) {
							uni.hideLoading()
							if (res.status == "success") {
								// my.showToast({
								// 	content: res.msg,
								// 	duration: 3000,
								// 	type: 'success'
								// })
								// if(res.code=='3'){
								// 	console.log(res.data)
								uni.navigateTo({
									url: '/pages/recharge/recharge'
								})
								// }
							} else {
								my.showToast({
									content: res.msg || '扫码失败!',
									duration: 3000,
									type: 'none'
								})
							}
						})
						// let data = {
						// 	custName: uni.getStorageSync('custName'),
						// 	ewmUrl: res.result
						// }
						// uni.showLoading({
						// 	title: '加载中'
						// })
						// // 扫码成功开始充电
						// utlis.http("POST", 'appChargeStartQRCodeHj', data, function(
						// 	res) {
						// 	uni.hideLoading()
						// 	if (res.status == "success") {
						// 		uni.setStorageSync('egCode', res.egCode)
						// 		uni.setStorageSync('stationId', res.stationId)
						// 		uni.setStorageSync('connectorID', res.connectorID)
						// my.showToast({
						// 	content: res.msg,
						// 	duration: 3000,
						// 	type: 'success'
						// })
						// 		setTimeout(() => {
						// 			uni.navigateTo({
						// 				url: '/pages/charging/charging'
						// 			})
						// 		}, 3000)
						// 	} else {
						// my.showToast({
						// 	content: res.msg,
						// 	duration: 3000,
						// 	type: 'none'
						// })
						// 	}
						// })
					}
				})
			},
			// 获取电站分布
			getData() {
				let self = this;
				let data = {}
				utlis.http("POST", 'appElectricStationHj', data, function(res) {
					if (res.status == "success") {
						self.electricStationList = res.electricStationList
						self.markers = [];
						res.electricStationList.forEach(item => {
							let marker = {
								latitude: item.lat,
								longitude: item.lng,
								// label: {
								// 	content: item.esName,
								// 	color: "#fff",
								// 	fontSize: 16,
								// 	borderRadius: "5",
								// 	bgColor: "#FEA503",
								// 	padding: 10,
								// },
								iconPath: '/static/img/dibiao_icon3x.png',
								width: 35,
								height: 35,
								id: '?id=' + item.stationId + '&stationId=' + item.stationId + '&addr=' + item.addr + '&esName=' + item.esName +
									'&lat=' + item.lat + '&lng=' + item.lng,
							}
							self.markers.push(marker)
						})
					} else {}
				})
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
			getPromotions() {
				let self = this;
				let data = {}
				utlis.http("POST", 'promotions', data, function(res) {
					if (res.status == "success") {
						self.discountList = res.rechargeRecord;
						self.promotionMaxId = uni.getStorageSync('promotionMaxId');
						if (self.discountList.length != 0) {
							self.discount1 = 1;
						}
						if (self.promotionMaxId != res.promotionMaxId) {
							self.discount2 = 1;
							self.promotionMaxId = res.promotionMaxId;
							uni.setStorageSync('promotionMaxId', self.promotionMaxId);
						} else {
							self.discount2 = 0;
						}
					} else {}
				})
			},
			// 查询订单
			searchAdvancePay() {
				let self = this;
				let data = {
					custName: uni.getStorageSync('custName')
				}
				utlis.http("POST", 'searchAdvancePay', data, function(res) {
					if (res.status == "success") {
						// -2 表示各种异常情况
						// -1  表示用户第一次扫二维码，在数据库中并没有预支付的任何记录，是新用户在使用
						// 0  表示未支付
						// 1  表示已支付
						// 2  表示充电中
						// 3  表示充电结束(包括自动或者手动结束)
						if (res.advPayStatus == 1) {
							let data = {
								custName: uni.getStorageSync('custName'),
								ewmUrl: res.ewmUrl
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
										uni.navigateTo({
											url: '/pages/charging/charging'
										})
									}, 3000)
								} else {
									my.showToast({
										content: res.msg,
										duration: 3000,
										type: 'none'
									})
								}
							})
						}
					} else {}
				})
			},
			wallet() {
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined || uni.getStorageSync('token') ==
					null) {
					uni.reLaunch({
						url: '/pages/login/login'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/myWallet/myWallet'
				});
			},
			discount() {
				this.discount1 = 1;
				this.discount2 = 0;
				uni.setStorageSync('promotionMaxId', this.promotionMaxId);
			},
			closeDiscount() {
				this.discount1 = 0;
				this.discount2 = 0;
			},
			change1(e) {
				this.current1 = e.detail.current;
			},
			closeNews() {
				this.news = 0;
			},
		},
		filters: {
			timestampTo(timestamp) {
				var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '/';
				var M = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1) + '/') : ((date.getMonth() + 1) + '/');
				var D = (date.getDate() < 10) ? ('0' + date.getDate() + ' ') : (date.getDate() + ' ');
				var h = (date.getHours() < 10) ? ('0' + date.getHours() + ':') : (date.getHours() + ':');
				var m = (date.getMinutes() < 10) ? ('0' + date.getMinutes() + ':') : (date.getMinutes() + ':');
				var s = (date.getSeconds() < 10) ? ('0' + date.getSeconds()) : (date.getSeconds());
				return Y + M + D;
			}
		}
	}
</script>

<style>
	.search {
		position: fixed;
		top: 40rpx;
		left: 95rpx;
		width: 560rpx;
		height: 70rpx;
		background: #fed573;
		border: 2rpx solid #FEA503;
		border-radius: 35rpx;
	}

	.serach_img {
		position: absolute;
		top: 20rpx;
		left: 36rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.search_ipt {
		position: absolute;
		top: 10rpx;
		left: 78rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #FEA503;
		background: #fed573;
	}

	.search_pla {
		font-size: 28rpx;
		color: #FEA503;
	}

	.search_img {
		width: 120rpx;
		height: 120rpx;
		position: fixed;
		left: 30rpx;
		bottom: 72rpx;
	}

	.search_scan {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		left: 2rpx;
		top: 3rpx;
	}

	.search_discount {
		position: fixed;
		right: 30rpx;
		bottom: 212rpx;
		color: #FEA503;
		width: 110rpx;
		height: 110rpx;
		font-size: 22rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
		text-align: center;
	}

	.search_wallet {
		position: fixed;
		left: 30rpx;
		bottom: 212rpx;
		color: #FEA503;
		width: 110rpx;
		height: 110rpx;
		font-size: 22rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
		text-align: center;
	}

	.search_mine {
		position: fixed;
		right: 30rpx;
		bottom: 72rpx;
		color: #FEA503;
		width: 110rpx;
		height: 110rpx;
		font-size: 22rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
		text-align: center;
	}

	.ba_img2 {
		width: 50rpx;
		height: 50rpx;
		margin-left: auto;
		margin-right: auto;
		margin-top: 20rpx;
	}

	.search_content {
		width: 560rpx;
		height: 560rpx;
		background: #FFFFFF;
		position: fixed;
		overflow: hidden;
		top: 120rpx;
		left: 95rpx;
		z-index: 1;
		border-radius: 35rpx;
		border: 2rpx solid #FEA503;
	}

	.search_content_word {
		margin-left: 36rpx;
		color: #666666;
		font-size: 28rpx;
		height: 70rpx;
		line-height: 70rpx;
		overflow: hidden;
		white-space: nowrap;
		width: 500rpx;
		box-sizing: border-box;
		padding-left: -6rpx;
		border-bottom: 2rpx solid #E5E5E5;
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

	.discount_title0 {
		position: absolute;
		top: 70rpx;
		width: 100%;
		text-align: center;
		color: #FFFFFF;
		font-size: 30rpx;
		letter-spacing: 1rpx;
	}

	.discount_title1 {
		position: absolute;
		top: 130rpx;
		width: 100%;
		text-align: center;
		color: #FFFFFF;
		font-size: 56rpx;
		letter-spacing: 8rpx;
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
		top: 850rpx;
		left: 345rpx;
	}

	.swiper-box2 {
		/* 		height: 100% !important; */
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
		height: 200rpx;
	}

	.swiper-item1 {
		color: rgba(102, 102, 102, 1);
		margin-top: 5rpx;
	}

	.redDot {
		width: 14rpx;
		height: 14rpx;
		background: red;
		position: absolute;
		right: 13rpx;
		top: 18rpx;
		border-radius: 50%;
	}

	.bottom_scan {
		position: fixed;
		bottom: 80rpx;
		box-sizing: border-box;
		left: 225rpx;
		width: 300rpx;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #FEA503;
		border-radius: 50rpx;
		color: #FFFFFF;
		text-align: right;
		padding-right: 40rpx;
		letter-spacing: 2rpx;
		font-size: 34rpx;
	}

	.bottom_scan2 {
		position: fixed;
		bottom: 80rpx;
		box-sizing: border-box;
		left: 225rpx;
		width: 300rpx;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #FEA503;
		border-radius: 50rpx;
		color: #FFFFFF;
		text-align: right;
		padding-right: 20rpx;
		letter-spacing: 1rpx;
		font-size: 34rpx;
	}



	/* 通知css */
	.news {
		width: 526rpx;
		height: 660rpx;
		position: fixed;
		top: 166rpx;
		left: 112rpx;
		z-index: 100;
		border-radius: 10rpx;
		background: #FFFFFF;
	}

	.mas2 {
		width: 100%;
		height: 100vh;
		position: fixed;
		transition: .5s;
		left: 0;
		top: 0;
		z-index: 99;
		background: rgba(0, 0, 0, 0.5);
	}

	.guanbi2 {
		width: 60rpx;
		height: 60rpx;
		position: fixed;
		transition: .5s;
		z-index: 100;
		top: 850rpx;
		left: 345rpx;
	}

	.news_title {
		font-size: 40rpx;
		position: absolute;
		top: 20rpx;
		width: 80%;
		left: 10%;
		font-weight: bold;
		text-align: center;
	}

	.news_content {
		font-size: 32rpx;
		position: absolute;
		top: 80rpx;
		width: 80%;
		left: 10%;
		text-align: left;
	}

	.news_span {
		color: red;
		font-size: 28rpx;
		text-align: center;
		font-weight: bold;
	}

	.green {
		width: 400rpx;
		height: 100vh;
		color: tomato;
	}

	.modal {
		position: fixed;
		left: 85rpx;
		top: 346rpx;
		width: 580rpx;
		height: 400rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
	}

	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .6);
	}

	.modal_content {
		font-size: 36rpx;
		color: #444A4D;
		position: absolute;
		padding: 25px;
	}

	.modal_confirm {
		width: 100%;
		height: 88rpx;
		border-top: 2rpx solid #DDDDDD;
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		border-radius: 0 0 20rpx 20rpx;
	}

	.modal_confirm_flex {
		flex: 1;
		border-right: 2rpx solid #DDDDDD;
		font-size: 32rpx;
		text-align: center;
		line-height: 88rpx;
	}
</style>
