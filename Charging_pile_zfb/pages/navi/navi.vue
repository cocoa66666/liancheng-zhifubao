<template>
	<view class="content">
		<map id="myMap" :longitude="longitudeFinal" :latitude="latitudeFinal" :include-points="makers" :circles="circles"
		 :markers="markers" :polyline="polyline" :scale="scale" show-location>
		</map>
		<view class="naviDetail">
			<view class="naviDetail_title">
				三峡电能二七桥充电站
			</view>
			<view class="naviDetail_word">
				湖北省武汉市江岸区解放大道2538号
			</view>
			<image class="naviDetail_img" src="../../static/img/daozheli_icon3x.png" @tap="pathPlanning"></image>
		</view>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js';
	// 引入SDK核心类
	import QQMapWX from '../../static/js/qqmap-wx-jssdk.js';
	var qqmapsdk = new QQMapWX({
		key: utlis.key // 必填
	});
	var EARTH_RADIUS = 6378136.49;
	export default {
		data() {
			return {
				markers: [], //标点
				latitude: '', //目的地纬度
				longitude: '', //目的地经度 
				latitudeFinal: '', //目的地纬度
				longitudeFinal: '', //目的地经度 
				polyline: [], //路线
				scale: 15, //缩放级别
				agencyList: [],
				latFrom: '',
				lngFrom: '',
				latTo: '',
				lngTo: '',
				circles: []
			}
		},
		onLoad(e) {

		},
		onShow(e) {
			let self = this
			self.pathPlanning(e)
			self.openMap(e)
			// uni.getLocation({
			// 	type: 'gcj02',
			// 	success: function(res) {
			// 		let marker = self.createMarker(res);
			// 		self.markers = marker
			// 		self.latFrom = res.latitude;
			// 		self.lngFrom = res.longitude;
			// 		self.latitude = res.latitude
			// 		self.longitude = res.longitude
			// 		self.latitudeFinal = self.markers[0].latitude
			// 		self.longitudeFinal = self.markers[0].longitude
			// 	},
			// 	fail: function(res) {
			// 		console.log(res.errMsg)
			// 		if (res.errMsg == 'getLocation:fail auth deny') {
			// 			uni.navigateTo({
			// 				url: '/pages/powerDetail/powerDetail'
			// 			})
			// 		}
			// 	}
			// })
		},
		methods: {
			// 路线规划
			openMap: function(event) {
				// let index = event.currentTarget.dataset.index;
				// let data = this.data.listItem[index];
				// uni.openLocation({
				// 	latitude: 30.498384,
				// 	longitude: 114.447327,
				// 	name: '湖北省武汉市江岸区解放大道2538号',
				// 	scale: 15
				// })
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						const latitude = res.latitude;
						const longitude = res.longitude;
						uni.openLocation({
							latitude: 30.498384,
							longitude: 114.447327,
							name: '湖北省武汉市江岸区解放大道2538号',
							scale: 15,
							success: function() {
								console.log('success');
							}
						});
					}
				});
			},
			pathPlanning(e) {
				let self = this
				// 获取当前位置
				uni.getLocation({
					type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
					success: function(res) {
						console.log(res)
						self.latFrom = res.latitude;
						self.lngFrom = res.longitude;
						self.latitude = res.latitude
						self.longitude = res.longitude
						//导航
						qqmapsdk.direction({
							mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
							//from参数不填默认当前地址
							from: res.latitude + ',' + res.longitude,
							to: '30.498384,114.447327',
							success: function(ret) {
								console.log(ret);
								let coors = ret.result.routes[0].polyline,
									pl = [];
								//坐标解压（返回的点串坐标，通过前向差分进行压缩）
								let kr = 1000000;
								for (let i = 2; i < coors.length; i++) {
									coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
								}
								//将解压后的坐标放入点串数组pl中
								for (let i = 0; i < coors.length; i += 2) {
									pl.push({
										latitude: coors[i],
										longitude: coors[i + 1]
									})
								}
								// console.log(pl)
								let distance = self.getDistance(res.latitude, res.longitude, 30.498384, 114.447327)
								//设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
								self.latitude = (res.latitude + Number(30.498384)) / 2;
								self.longitude = (res.longitude + Number(114.447327)) / 2;
								self.markers = [{
										'longitude': res.longitude,
										'latitude': res.latitude,
										'id': 1,
										'title': '起点',
										"iconPath": "../../static/img/dibiao_icon3x.png",
										"width": 30,
										"height": 30
									},
									{
										'longitude': 114.447327,
										'latitude': 30.498384,
										'id': 2,
										'title': '终点',
										"iconPath": "../../static/img/dibiao_icon3x.png",
										"width": 30,
										"height": 30
									}
								];
								self.polyline = [{
									points: pl,
									color: '#4FB773',
									width: 4
								}];
								self.latitudeFinal = self.markers[0].latitude
								self.longitudeFinal = self.markers[0].longitude
								distance = ret.result.routes[0].distance;
								self.scale = utlis.countZoom(distance);
							},
							fail: function(error) {
								utlis.warning(error.message)
							}
						})
					}
				})
			},
			getDistance: function(lat1, lng1, lat2, lng2) {
				lat1 = lat1 || 0;
				lng1 = lng1 || 0;
				lat2 = lat2 || 0;
				lng2 = lng2 || 0;

				var rad1 = lat1 * Math.PI / 180.0;
				var rad2 = lat2 * Math.PI / 180.0;
				var a = rad1 - rad2;
				var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
				var r = 6378137;
				var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) *
					Math
					.pow(
						Math.sin(b / 2), 2)));
				let dista = (distance / 1000).toFixed(2);
				return dista;
				console.log(lat1, lng1, lat2, lng2)
			},

			/**
			 * 标示点移动触发
			 */
			regionchange(e) {},

			/**
			 * 点击标识点触发
			 */
			markertap(e) {},

			/**
			 * control控件点击时间
			 */
			controltap(e) {
				this.moveToLocation()
			},
			// 定位
			Global(lat, lng) {
				this.longitude = lng;
				this.latitude = lat
			},
			/**
			 * 获取医院标识
			 */
			getHospitalMarkers() {
				let markers = [];
				let circles = []
				for (let item of this.agencyList) {
					let marker = this.createMarker(item);
					let circle = this.createCircle(item);

					markers.push(marker)
					circles.push(circle)
				}
				this.markers = markers;
				this.circles = circles;
				// return markers;
			},

			/**
			 * 移动到自己位置
			 */
			moveToLocation: function() {
				let mpCtx = wx.createMapContext("map");
				mpCtx.moveToLocation();
			},


			/**
			 * 还有地图标识，可以在name上面动手
			 */
			createMarker(point) {
				console.log(point)
				// let latitude =parseFloat( point.latitude);
				// let longitude = parseFloat(point.longitude);
				let latitude = parseFloat(point.lat);
				let longitude = parseFloat(point.lng);
				let content = '<h2>' + point.name + '</h2>';
				let marker = [{
						'longitude': 114.447327,
						'latitude': 30.498384,
						'id': 2,
						'title': '终点',
						"iconPath": "../../static/img/dibiao_icon3x.png",
						"width": 30,
						"height": 30,
						label: {
							width: 100,
							content: 'qqqqq',
							fontize: 16,
							textAlign: 'left',
							anchorX: 20,
							anchorY: -30,
							bgColor: "#ffffff",
							color: "#333",
							padding: 10,
							display: "ALWAYS",
							borderRadius: 5,
						}
					},
					{
						// iconPath: "https://wx.weibeicc.com/img/maploge.svg",
						iconPath: "../../static/img/maploge.svg",
						id: point.id || 0,
						name: point.name || '',
						latitude: latitude,
						longitude: longitude,
						width: 30,
						height: 40,
						label: {
							width: 100,
							content: 'qqqqq',
							fontize: 16,
							textAlign: 'left',
							anchorX: 20,
							anchorY: -30,
							bgColor: "#ffffff",
							color: "#333",
							padding: 10,
							display: "ALWAYS",
							borderRadius: 5,
						}
					}
				];
				return marker;
			},
			/**
			 * 还有地图标识，可以在name上面动手
			 */
			createCircle(point) {
				// latitude 纬度 Number 是 浮点数，范围 -90 ~ 90
				// longitude 经度 Number 是 浮点数，范围 -180 ~ 180
				// color 描边的颜色 String 否 8位十六进制表示，后两位表示alpha值，如：#000000AA
				// fillColor 填充颜色 String 否 8位十六进制表示，后两位表示alpha值，如：#000000AA
				// radius 半径 Number 是 
				// strokeWidth 描边的宽度 Number 否
				// let latitude =parseFloat( point.latitude);
				// let longitude = parseFloat(point.longitude);
				let latitude = parseFloat(point.lat);
				let longitude = parseFloat(point.lng);

				let circle = {
					latitude: latitude,
					longitude: longitude,
					fillColor: '#333',
					radius: 50,
				};
				return circle;
			},


			getRegeo(e) {
				uni.showLoading({
					title: '获取信息中'
				});
				let address = [];
				this.amapPlugin.getRegeo({
					success: (data) => {
						this.addressName = data[0].name;
						uni.hideLoading();
						console.log('省' + data[0].regeocodeData.addressComponent.province)
						console.log('市' + data[0].regeocodeData.addressComponent.city)
						address.push(data[0].regeocodeData.addressComponent.province);
						if (data[0].regeocodeData.addressComponent.city.length != 0) {
							address.push(data[0].regeocodeData.addressComponent.city);
						}

						// 计算距离
						// let locationArr = [];
						// data.forEach((v, i) => {
						// 	// getDistance(latFrom, lngFrom, latTo, lngTo)
						// 	// locationArr.push(this.getDistance(this.latFrom, this.lngFrom, v.lat, v.lng));
						// })
						// this.distanceArr = locationArr;
						// address[1].join("")
						console.log('数组')
						console.log(address)
						this.regionda = address; //获取列表参数
						this.get_agency_list()
					},
					fail: function(res) {
						console.log(res)
						if (res.errCode == '0' || res.errCode == 0) {

						}


					}
				});
			},
			// 新版获取经销商
			get_agency_list() {
				let self = this;
				let url = '/wx/network/get_agency_list';
				let data = {
					// param: self.region
					param: self.regionda
				};
				console.log('参数' + self.regionda)
				utlis.http('POST', url, data, function(res) {
					if (res.errno == 200) {
						// self.dealerObj = res.result.records;
						// self.dealerObj = res.data.agency;
						self.agencyList = res.data.agency;
						self.dealer = []
						for (let i of res.data.agency) {
							self.dealer.push(i.name);
						}
						self.getHospitalMarkers()
						let disArr = [];
						self.agencyList.forEach((v, i) => {
							disArr.push(self.getDistance(self.latitude, self.longitude, v.lat, v.lng));
						})
						self.distanceArr = disArr;
						// self.markers=self.getHospitalMarkers();
						// self.circles=self.getHospitalMarkers();
						// self.chooseDealer = self.dealer[self.selectDealer]
					} else {
						utlis.warning(res.message);
					}
				});
			},

		},
	}
</script>

<style>
	.naviDetail {
		position: fixed;
		bottom: 54rpx;
		left: 45rpx;
		width: 660rpx;
		height: 200rpx;
		border-radius: 20rpx;
		background: #FFFFFF;
	}

	.naviDetail_title {
		font-size: 34rpx;
		position: absolute;
		left: 48rpx;
		top: 46rpx;
		font-weight: bold;
	}

	.naviDetail_word {
		font-size: 28rpx;
		position: absolute;
		left: 48rpx;
		bottom: 46rpx;
		color: #666666;
	}

	.naviDetail_img {
		width: 140rpx;
		height: 140rpx;
		position: fixed;
		bottom: 180rpx;
		right: 82rpx;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #F3F3F3;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	#myMap {
		width: 100%;
		height: 100%;
		background-color: #eee;
	}
</style>
