<template>
	<view class="content">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll">
			<view class="swip">
				<swiper class="swiper-box" @change="change" style="height: 360rpx;" autoplay="true" interval="5000">
					<swiper-item v-for="(item ,index) in img_url" :key="index">
						<view class="swiper-item">
							<image class="swiper-img" :src='item.imgUrl'></image>
						</view>
					</swiper-item>
				</swiper>
				<swiper-dot class="dot" :current="current" :list="img_url"></swiper-dot>
			</view>
			<view class="address">
				<view class="add_title">{{esName}}</view>
				<!-- 2020.8.17时段电价 -->
				<view class="add_curElec">
					￥
					<text v-if="origElecPrice!=curElecPrice" style='text-decoration: line-through;margin-right: 10rpx;'>{{origElecPrice}}</text>
					<text style="font-size: 36rpx;font-weight: bold;">{{curElecPrice}}</text>
					/度
				</view>
				<view class="time">
					<image class="time_img" src="../../static/img/shijian_icon3x.png"></image>
					<view class="time_word">开放时间：00:00-24:00</view>
				</view>
				<view class="time2">
					<image class="time_img2" src="../../static/img/weizhi_icon3x.png"></image>
					<view class="time_word2">{{addr}}</view>
				</view>
				<!--<view class="time3" @tap="showNavi">
					<image class="time_img3" src="../../static/img/daohang3x.png"></image>
					<view class="time_word3">7.0km</view>
				</view> -->
				<view class="time3" @tap="openMap">
					<image class="time_img3" src="../../static/img/daohang3x.png"></image>
					<view class="time_word3">到这去</view>
				</view>
				<view class="time2">
					<view class="time_word4">{{parkFee}}</view>
				</view>
				<view class="time2">
					<view class="time_word5">{{siteGuide}}</view>
				</view>
			</view>
			<view class="price">
				<view class="price_table">
					<view class="price_content">时段</view>
					<view class="price_content" style="border-left: none;">服务费（元）</view>
					<view class="price_content" style="border-left: none;border-right: none;">电费（元）</view>
					<view class="price_content">总价（元）</view>
				</view>
				<block v-for="(item,index) in listTimeSlot" :key="index">
					<view class="price_table2">
						<view class="price_content2">{{item.timeSlot}}</view>
						<view class="price_content2" style="border-left: none;">{{item.serviceFee}}</view>
						<view class="price_content2" style="border-left: none;border-right: none;">{{item.electricityFee}}</view>
						<view class="price_content2" style="color: #000000;">{{item.totalFee}}</view>
					</view>
				</block>
			</view>
			<!-- <view :class="old.scrollTop>=304?'pile_fixed':'dc_pile'"> -->
			<view class="dc_pile">
				<view class="dc_pile_sub" data-index="0" :class="plie_active==0?'dc_pile_sub_word':''" @tap="changePile">
					<span style='background-color: #FEA503;padding: 0 12rpx 0 12rpx;border-radius: 50rpx;'>
						<span style='color: #ffffff;background-color: #4FB773;border-radius: 50rpx;padding: 12rpx;margin-left: -12rpx;box-sizing: border-box;'>{{pileFree}}空闲</span>
						<span style='color: #ffffff;'>{{pileTotal}}快充</span>
					</span>
					<!-- <view :class="plie_active==0?'dc_pile_sub_active':''"></view> -->
				</view>
				<!-- 				<view class="dc_pile_sub" data-index="1" :class="plie_active==1?'dc_pile_sub_word':''" @tap="changePile">
					交流装（36/36）
					<view :class="plie_active==1?'dc_pile_sub_active':''"></view>
				</view> -->
			</view>
			<!--			<view :class="old.scrollTop>=304?'dc_message_fixed':'dc_message'">
				<view class="dc_message_word1">暂无</view>
				<view class="dc_message_word2">充电价格</view>
				<view class="dc_message_word3">停车费用：暂无</view>
				<view class="dc_message_word4">停车信息：暂无</view>
			</view> -->
			<view class="dc_content" v-if="plie_active==0">
				<view class="dc_content_sub" v-for="(item, index) in pileInfo" :key="index">
					<image class="dc_content_img11" src="../../static/img/chongdianzhuang_icon3x.png"></image>
					<view class="dc_content_word11">充电桩编号：{{item.egCode}}</view>
					<image class="dc_content_img12" src="../../static/img/chongdianqiang_icon3x.png"></image>
					<view class="dc_content_word12">充电桩编号：{{item.gunName}}</view>
					<view class="border"></view>
					<view class="dc_content_word13">终端类型：<span class='colo'>{{item.type}}</span></view>
					<view class="dc_content_word14">充电接口：<span class='colo'>{{item.standard}}</span></view>
					<view class="dc_content_word15">功率：<span class='colo'>{{item.power}}</span></view>
					<view class="dc_content_word16">电压：<span class='colo'>{{item.upperLimit}}-{{item.lowerLimit}}</span></view>
					<view class="dc_content_word17">插口类型：<span class='colo'>{{item.chargeType}}</span></view>
					<view v-if="item.status==0" class="dc_content_img16">离网</view>
					<view v-if="item.status==1" class="dc_content_img13">空闲</view>
					<view v-if="item.status==2||item.status==4" class="dc_content_img14">占用</view>
					<view v-if="item.status==3" class="dc_content_img17">充电中</view>
					<view v-if="item.status==255" class="dc_content_img15">故障</view>
					<!-- 百分比 -->
					<!-- 					<view v-if="item.status==3" class="dc_content_img_percent">
						<view class="dc_content_img_percent_sub" :style="'height:'+item.realTimeSoc*0.9+'rpx'"></view>
						<view style="font-size:30rpx;color: #ffffff;text-align: center;position: relative;z-index: 10;">{{parseFloat(item.realTimeSoc)||0}}%</view>
					</view> -->
				</view>
			</view>
			<view class="dc_content" v-if="plie_active==1">
				<view class="dc_content_sub">
					<image class="dc_content_img1" src="../../static/img/chongdianqiang_icon3x.png"></image>
					<view class="dc_content_word1">302</view>
					<view class="dc_content_word2">双枪一体式充电机</view>
					<view class="dc_content_img2">A</view>
					<view class="dc_content_word3">空闲</view>
					<view class="dc_content_img3">B</view>
					<view class="dc_content_word4">充电中</view>
					<image class="dc_content_img4" src="../../static/img/xiangqing3x.png"></image>
				</view>
				<view class="dc_content_sub">
					<image class="dc_content_img1" src="../../static/img/chongdianqiang_icon3x.png"></image>
					<view class="dc_content_word1">302</view>
					<view class="dc_content_word2">双枪一体式充电机</view>
					<view class="dc_content_img2">A</view>
					<view class="dc_content_word3">空闲</view>
					<view class="dc_content_img3">B</view>
					<view class="dc_content_word4">充电中</view>
					<image class="dc_content_img4" src="../../static/img/xiangqing3x.png"></image>
				</view>
				<view class="dc_content_sub">
					<image class="dc_content_img1" src="../../static/img/chongdianqiang_icon3x.png"></image>
					<view class="dc_content_word1">302</view>
					<view class="dc_content_word2">双枪一体式充电机</view>
					<view class="dc_content_img2">A</view>
					<view class="dc_content_word3">空闲</view>
					<view class="dc_content_img3">B</view>
					<view class="dc_content_word4">充电中</view>
					<image class="dc_content_img4" src="../../static/img/xiangqing3x.png"></image>
				</view>
				<view class="dc_content_sub">
					<image class="dc_content_img1" src="../../static/img/chongdianqiang_icon3x.png"></image>
					<view class="dc_content_word1">302</view>
					<view class="dc_content_word2">双枪一体式充电机</view>
					<view class="dc_content_img2">A</view>
					<view class="dc_content_word3">空闲</view>
					<view class="dc_content_img3">B</view>
					<view class="dc_content_word4">充电中</view>
					<image class="dc_content_img4" src="../../static/img/xiangqing3x.png"></image>
				</view>
				<view class="dc_content_sub">
					<image class="dc_content_img1" src="../../static/img/chongdianqiang_icon3x.png"></image>
					<view class="dc_content_word1">302</view>
					<view class="dc_content_word2">双枪一体式充电机</view>
					<view class="dc_content_img2">A</view>
					<view class="dc_content_word3">空闲</view>
					<view class="dc_content_img3">B</view>
					<view class="dc_content_word4">充电中</view>
					<image class="dc_content_img4" src="../../static/img/xiangqing3x.png"></image>
				</view>
				<view class="dc_content_sub">
					<image class="dc_content_img1" src="../../static/img/chongdianqiang_icon3x.png"></image>
					<view class="dc_content_word1">302</view>
					<view class="dc_content_word2">双枪一体式充电机</view>
					<view class="dc_content_img2">A</view>
					<view class="dc_content_word3">空闲</view>
					<view class="dc_content_img3">B</view>
					<view class="dc_content_word4">充电中</view>
					<image class="dc_content_img4" src="../../static/img/xiangqing3x.png"></image>
				</view>
			</view>
			<view class="dc_content" v-if="plie_active==2">
				<view class="dc_content_title">暂无</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import swiperDot from "../swiperDot/swiperDot2.vue"
	import utlis from "../../static/js/utlis.js"
	export default {
		components: {
			swiperDot
		},
		data() {
			return {
				// 轮播
				list: [{
						content: '内容 A',
						src: "../../static/img/chongdianxiangqing.jpg"
					}
					// ,
					// {
					// 	content: '内容 B',
					// 	src: '../../static/img/xiangqing3x.png'
					// },
					// {
					// 	content: '内容 C',
					// 	src: '../../static/img/cheweifenxiang_icon2x.png'
					// }
				],
				current: 0,
				plie_active: 0,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				id: '',
				stationId: '',
				pileInfo: '',
				addr: '',
				esName: '',
				lat: '',
				lng: '',
				img_url: '',
				listTimeSlot: [],
				parkFee: '',
				siteGuide: '',
				curElecPrice: 0,
				origElecPrice: 0,
				pileFree: 0,
				pileTotal: 0,
				aaa: true
			}
		},
		onLoad(e) {
			let self = this;
			self.id = e.id;
			self.stationId = e.stationId;
			self.addr = e.addr;
			self.esName = e.esName;
			self.lat = e.lat;
			self.lng = e.lng;
			self.getData()
			setTimeout(()=>{
				self.getImg()
			},100)
		},
		methods: {
			openMap: function(event) {
				let self = this;
				uni.openLocation({
					latitude: Number(self.lat),
					longitude: Number(self.lng),
					name: self.esName,
					address: self.addr,
					success: function() {
						console.log('success');
					}
				});
			},
			change(e) {
				this.current = e.detail.current;
			},
			changePile(e) {
				if (this.plie_active != e.currentTarget.dataset.index) {
					if (this.plie_active == 0) {
						this.plie_active = 1
					} else {
						this.plie_active = 0
					}
				}
			},
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			showNavi() {
				uni.navigateTo({
					url: '/pages/navi/navi'
				});
			},
			//获取电站详情
			getData() {
				let self = this;
				let data = {
					esCode: self.stationId
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'appElectricPileInfoHj', data, function(res) {
					if (res.status == "success") {
						self.pileInfo = res.pileInfo
						self.pileFree = res.pileFree
						self.pileTotal = res.pileTotal
						self.curElecPrice = res.curElecPrice
						self.origElecPrice = res.origElecPrice
						self.listTimeSlot = res.listTimeSlot
						self.parkFee = res.parkFee
						self.siteGuide = res.siteGuide
						uni.hideLoading()
					} else {
						uni.hideLoading()
					}
				})
			},
			//获取电站图片
			getImg() {
				let self = this;
				let data = {
					userSource: 2,
					imgType: 1,
					stationId: self.stationId
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'appImg', data, function(res) {
					if (res.status == "success") {
						self.img_url = res.url
						uni.hideLoading()
					} else {
						uni.hideLoading()
					}
				})
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #F3F3F3;
		height: 100vh;
		width: 100%;
		position: relative;
	}

	.scroll-Y {
		width: 100%;
		height: 100%;
	}

	.scroll-Y ::-webkit-scrollbar {
		display: none;
	}

	/* 轮播图 */
	.swip {
		width: 100%;
		height: 360rpx;
		text-align: center;
		position: relative;
		top: 0;
	}

	.swiper-img {
		width: 100%;
		height: 360rpx;
		margin: 0 auto;
	}

	/* 地址 */
	.address {
		width: 100%;
		height: 310rpx;
		position: relative;
		top: 0;
		background: #FFFFFF;
	}

	.add_title {
		font-size: 34rpx;
		position: absolute;
		left: 30rpx;
		top: 30rpx;
		font-weight: bold;
	}

	/* 2020.8.17时段电价 */
	.add_curElec {
		position: absolute;
		right: 60rpx;
		top: 34rpx;
		color: #ff4000;
		font-weight: normal;
		font-size: 28rpx;
	}

	.time {
		text-align: center;
	}

	.time_img {
		position: absolute;
		top: 114rpx;
		left: 30rpx;
		width: 28rpx;
		height: 28rpx;
		display: inline-block;
	}

	.time_word {
		position: absolute;
		top: 108rpx;
		left: 72rpx;
		color: #666666;
		font-size: 28rpx;
		display: inline-block;
	}

	.time2 {
		text-align: center;
	}

	.time_img2 {
		position: absolute;
		top: 168rpx;
		left: 32rpx;
		width: 28rpx;
		height: 28rpx;
		display: inline-block;
	}

	.time_word2 {
		position: absolute;
		top: 162rpx;
		left: 72rpx;
		color: #666666;
		font-size: 28rpx;
		display: inline-block;
	}

	.time_word4 {
		position: absolute;
		top: 214rpx;
		left: 72rpx;
		color: #666666;
		font-size: 28rpx;
		display: inline-block;
	}

	.time_word5 {
		position: absolute;
		top: 264rpx;
		left: 72rpx;
		color: #666666;
		font-size: 28rpx;
		display: inline-block;
	}

	.time3 {
		text-align: center;
	}

	.time_img3 {
		position: absolute;
		top: 112rpx;
		right: 68rpx;
		width: 44rpx;
		height: 44rpx;
	}

	.time_word3 {
		position: absolute;
		top: 162rpx;
		right: 54rpx;
		color: #FEA503;
		font-size: 26rpx;
	}

	/* 直流桩 */
	.pile_fixed {
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
		height: 90rpx;
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		text-align: center;
		border-bottom: 10rpx solid #F3F3F3;
	}

	.dc_pile {
		width: 100%;
		height: 90rpx;
		background: #FFFFFF;
		position: relative;
		top: 0;
		display: flex;
		flex-direction: row;
		text-align: center;
	}

	.dc_pile_sub {
		flex: 1;
		line-height: 90rpx;
		font-size: 26rpx;
		font-weight: bold;
	}

	.dc_pile_sub_word {
		color: #FEA503;
	}

	.dc_pile_sub_active {
		background: #FEA503;
		width: 54rpx;
		height: 4rpx;
		margin: 0 auto;
	}

	.dc_message_fixed {
		width: 100%;
		height: 180rpx;
		position: fixed;
		top: 100rpx;
		z-index: 10;
		background: #FFFFFF;
		border-bottom: 10rpx solid #F3F3F3;
	}

	.dc_message {
		width: 100%;
		height: 180rpx;
		position: absolute;
		top: 710rpx;
		background: #FFFFFF;
	}

	.dc_message_word1 {
		font-family: 苹方-简 中黑体;
		font-size: 44rpx;
		font-weight: bold;
		position: absolute;
		top: 32rpx;
		left: 142rpx;
	}

	.dc_message_word2 {
		font-family: 苹方-简 中黑体;
		font-size: 26rpx;
		position: absolute;
		top: 112rpx;
		left: 134rpx;
		color: #999999;
	}

	.dc_message_word3 {
		font-family: 苹方-简 中黑体;
		font-size: 26rpx;
		position: absolute;
		top: 44rpx;
		right: 132rpx;
		color: #999999;
	}

	.dc_message_word4 {
		font-family: 苹方-简 中黑体;
		font-size: 26rpx;
		position: absolute;
		bottom: 44rpx;
		right: 132rpx;
		color: #999999;
	}

	/* 详情 */
	.dc_content {
		width: 100%;
		position: relative;
		top: 16rpx;
	}

	.dc_content_title {
		width: 100%;
		color: #999999;
		font-size: 45rpx;
		text-align: center;
		position: absolute;
		top: 60rpx;
		font-family: 苹方-简 常规体;
	}

	.dc_content_sub {
		height: 384rpx;
		width: 100%;
		background: #FFFFFF;
		position: relative;
		margin-bottom: 10rpx;
	}

	.dc_content_img1 {
		width: 64rpx;
		height: 66rpx;
		position: absolute;
		left: 30rpx;
		top: 58rpx;
	}

	.dc_content_img2 {
		width: 36rpx;
		height: 36rpx;
		line-height: 36rpx;
		position: absolute;
		left: 134rpx;
		top: 126rpx;
		background: #4FB773;
		border-radius: 50%;
		font-family: 苹方-简 中黑体;
		font-size: 24rpx;
		color: #FFFFFF;
		text-align: center;
	}

	.dc_content_img3 {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		left: 134rpx;
		top: 126rpx;
		background: rgb(255, 156, 0);
		border-radius: 50%;
		font-family: 苹方-简 中黑体;
		font-size: 24rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 36rpx;
	}

	.dc_content_img9 {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		left: 134rpx;
		top: 126rpx;
		background: #d42323;
		border-radius: 50%;
		font-family: 苹方-简 中黑体;
		font-size: 24rpx;
		color: #d42323;
		text-align: center;
		line-height: 36rpx;
	}

	.dc_content_img4 {
		width: 32rpx;
		height: 32rpx;
		position: absolute;
		right: 30rpx;
		top: 74rpx;
	}

	.dc_content_word1 {
		position: absolute;
		left: 134rpx;
		top: 20rpx;
		font-size: 34rpx;
		font-weight: bold;
	}

	.dc_content_word2 {
		position: absolute;
		left: 134rpx;
		top: 70rpx;
		font-size: 28rpx;
		color: #666666;
	}

	.dc_content_word3 {
		position: absolute;
		left: 180rpx;
		top: 126rpx;
		font-size: 26rpx;
		color: #4FB773;
		font-family: 苹方-简 常规体;
	}

	.dc_content_word4 {
		position: absolute;
		left: 180rpx;
		top: 126rpx;
		font-size: 26rpx;
		color: rgb(255, 156, 0);
		font-family: 苹方-简 常规体;
	}

	.dc_content_word9 {
		position: absolute;
		left: 180rpx;
		top: 126rpx;
		font-size: 26rpx;
		color: #d42323;
		font-family: 苹方-简 常规体;
	}

	.dc_content_img11 {
		width: 34rpx;
		height: 36rpx;
		position: absolute;
		left: 30rpx;
		top: 34rpx;
	}

	.dc_content_img12 {
		width: 30rpx;
		height: 34rpx;
		position: absolute;
		left: 30rpx;
		top: 96rpx;
	}

	.dc_content_word11 {
		position: absolute;
		left: 76rpx;
		top: 30rpx;
		font-size: 30rpx;
		color: #000000;
		font-weight: 500;
	}

	.dc_content_word12 {
		position: absolute;
		left: 76rpx;
		top: 92rpx;
		font-size: 30rpx;
		color: #000000;
		font-weight: 500;
	}

	.border {
		width: 690rpx;
		height: 2rpx;
		background: #E5E5E5;
		position: absolute;
		left: 30rpx;
		top: 162rpx;
	}

	.colo {
		color: #000000;
	}

	.dc_content_word13 {
		position: absolute;
		bottom: 150rpx;
		left: 30rpx;
		color: #666666;
		font-size: 28rpx;
		font-weight: 500;
	}

	.dc_content_word14 {
		position: absolute;
		bottom: 150rpx;
		right: 152rpx;
		color: #666666;
		font-size: 28rpx;
		font-weight: 500;
	}

	.dc_content_word15 {
		position: absolute;
		bottom: 90rpx;
		left: 30rpx;
		color: #666666;
		font-size: 28rpx;
		font-weight: 500;
	}

	.dc_content_word16 {
		position: absolute;
		bottom: 90rpx;
		right: 204rpx;
		color: #666666;
		font-size: 28rpx;
		font-weight: 500;
	}

	.dc_content_word17 {
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		color: #666666;
		font-size: 28rpx;
		font-weight: 500;
	}

	.dc_content_img13 {
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		position: absolute;
		right: 30rpx;
		bottom: 30rpx;
		background: #4FB773;
		border-radius: 50%;
		font-size: 30rpx;
		color: #ffffff;
		text-align: center;
	}

	.dc_content_img_percent {
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		position: absolute;
		right: 30rpx;
		bottom: 30rpx;
		background: #feb55b;
		border-radius: 50%;
		font-size: 30rpx;
		color: #FEA503;
		text-align: center;
		overflow: hidden;
		border: 2rpx solid #FEA503;
	}

	.dc_content_img_percent_sub {
		width: 90rpx;
		height: 9rpx;
		line-height: 90rpx;
		position: absolute;
		right: 0;
		bottom: 0;
		background: #ff8e03;
	}

	.dc_content_img14 {
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		position: absolute;
		right: 30rpx;
		bottom: 30rpx;
		background: rgb(255, 156, 0);
		border-radius: 50%;
		font-size: 30rpx;
		color: #ffffff;
		text-align: center;
	}

	.dc_content_img15 {
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		position: absolute;
		right: 30rpx;
		bottom: 30rpx;
		background: #d42323;
		border-radius: 50%;
		font-size: 30rpx;
		color: #ffffff;
		text-align: center;
	}

	.dc_content_img16 {
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		position: absolute;
		right: 30rpx;
		bottom: 30rpx;
		background: grey;
		border-radius: 50%;
		font-size: 30rpx;
		color: #ffffff;
		text-align: center;
	}

	.dc_content_img17 {
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		position: absolute;
		right: 30rpx;
		bottom: 30rpx;
		background: #0099FF;
		border-radius: 50%;
		font-size: 26rpx;
		color: #ffffff;
		text-align: center;
	}

	.price {
		width: 100%;
		background-color: #FFFFFF;
		padding-bottom: 4rpx;
	}

	.price_table {
		width: 93%;
		margin-left: 3.5%;
		display: flex;
		height: 70rpx;
		margin-top: 0rpx;
		text-align: left;
		font-weight: bold;
		background: #fafafa;
	}

	.price_content {
		flex: 1;
		height: 70rpx;
		line-height: 70rpx;
		border: 2rpx solid #999999;
		font-size: 25rpx;
		padding-left: 10rpx;
	}

	.price_table2 {
		width: 93%;
		margin-left: 3.5%;
		display: flex;
		height: 70rpx;
		background: #ffffff;
		text-align: left;
		color: #808080;
	}

	.price_content2 {
		flex: 1;
		height: 70rpx;
		line-height: 70rpx;
		border: 2rpx solid #999999;
		font-size: 25rpx;
		border-top: none;
		padding-left: 10rpx;
	}
</style>
