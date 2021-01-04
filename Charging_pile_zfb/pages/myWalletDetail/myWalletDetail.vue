<template>
	<view class="content">
		<view class="top_change">
			<!-- 			<view class="top_change_sub" :class="top_active==0?'top_change_sub_word':''" data-index="0" @tap="changeTop">
				预充值记录
				<view :class="top_active==0?'top_change_sub_active':''"></view>
			</view> -->
			<view class="top_change_sub" :class="top_active==1?'top_change_sub_word':''" data-index="1" @tap="changeTop">
				消费记录
				<view :class="top_active==1?'top_change_sub_active':''"></view>
			</view>
		</view>
		<view class="detail_box" v-if="top_active==0&&top_data==1">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll" @scrolltolower="lower">
				<block v-for="(item,index) in data1" :key='index'>
					<view class="detail_content">
						<view class="detail_content_word1">{{list[item.busiType-1]}}</view>
						<view class="detail_content_word2">{{item.transAmtVo||0}}元</view>
						<!-- <view class="detail_content_word3">余额支付10.00元</view> -->
						<view class="detail_content_date">{{item.finishTime|timestampTo}}</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<view class="detail_box" v-if="top_active==1&&top_data==1">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll" @scrolltolower="lower">
				<!-- 				<view class="detail_content">
					<view class="detail_content_word1">充电消费</view>
					<view class="detail_content_word2">10.00元</view>
					<view class="detail_content_word3">微信支付</view>
					<view class="detail_content_date">2019/12/11 15:20:28</view>
				</view> -->
				<block v-for="(item,index) in data2" :key='index'>
					<view class="detail_content">
						<view class="detail_content_word1">{{list2[item.orderType-1]}}</view>
						<view class="detail_content_word2">{{item.orderAmtVo||0}}元</view>
						<view class="detail_content_word3">充电量{{item.totalPowerVo||0}}度</view>
						<view class="detail_content_date">{{item.createTime|timestampTo}}</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<view class="detail_empty" v-if="top_data==0">
			暂无记录
		</view>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js';
	export default {
		data() {
			return {
				top_active: 1,
				top_data: 0,
				custName: '',
				list: ['支付押金', '租车支付', '钱包预充值', '停车支付', '充电支付'],
				list2: ['充电', '停车', '待定'],
				data1: [],
				data2: [],
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				pageNum: 0,
				pageSize: 10,
				a: []
			}
		},
		onLoad(e) {
			console.log(e)
			this.getExpensesrecord()
		},
		onShow() {

		},
		methods: {
			lower: function(e) {
				let self = this;
				self.pageNum++;
				if (self.top_active == 0) {
					self.getTopuprecord()
				} else if (self.top_active == 1) {
					self.getExpensesrecord()
				}
			},
			scroll: function(e) {
				// console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			changeTop(e) {
				let self = this;
				if (self.top_active != e.currentTarget.dataset.index) {
					self.pageNum = 0;
					self.a = [];
					self.data1 = [];
					self.data2 = [];
					self.top_data = 0;
					if (e.currentTarget.dataset.index == 0) {
						self.getTopuprecord()
						self.top_active = e.currentTarget.dataset.index
					} else if (e.currentTarget.dataset.index == 1) {
						self.getExpensesrecord()
						self.top_active = e.currentTarget.dataset.index
					}
				}
			},
			// 获取充值记录
			getTopuprecord() {
				let self = this;
				self.custName = uni.getStorageSync('custName')
				let data = {
					custName: self.custName,
					pageNum: self.pageNum,
					pageSize: self.pageSize
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'rechargeRecord', data, function(res) {
					if (res.status == "success") {
						// if (self.stopReachBottom == true) {
						// 	return;
						// }
						self.top_data = 1;
						self.a = res.rechargeRecord;
						self.data1 = self.data1.concat(self.a);
						uni.hideLoading()
						if (self.data1 == null || self.data1 == undefined || self.data1 == []) {
							self.top_data = 0;
						} else {
							self.top_data = 1;
						}
						// if (res.data.last == true) {
						// 	self.stopReachBottom = true;
						// }
					}
				})
			},
			// 获取消费记录
			getExpensesrecord() {
				let self = this;
				self.custName = uni.getStorageSync('custName')
				let data = {
					custName: self.custName,
					pageNum: self.pageNum,
					pageSize: self.pageSize
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'consumeRecord', data, function(res) {
					if (res.status == "success") {
						self.top_data = 1;
						self.a = res.consumeRecord;
						self.data2 = self.data2.concat(self.a);
						uni.hideLoading()
						if (self.data2 == null || self.data2 == undefined || self.data2 == []) {
							self.top_data = 0;
						} else {
							self.top_data = 1;
						}
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
				return Y + M + D + h + m + s;
			}
		}
	}
</script>

<style>
	.scroll-Y {
		width: 100%;
		height: 1100rpx;
	}

	.scroll-Y ::-webkit-scrollbar {
		display: none;
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

	.top_change {
		width: 100%;
		height: 90rpx;
		display: flex;
		flex-direction: row;
		text-align: center;
		background: #FFFFFF;
		position: absolute;
		top: 0;
		left: 0;
		box-shadow: 0 6rpx 8rpx 0 rgba(0, 0, 0, 0.05);
	}

	.top_change_sub {
		flex: 1;
		line-height: 90rpx;
		font-size: 30rpx;
		font-weight: bold;
	}

	.top_change_sub_word {
		color: #FEA503;
	}

	.top_change_sub_active {
		background: #FEA503;
		width: 54rpx;
		height: 4rpx;
		margin: 0 auto;
	}

	.detail_box {
		position: absolute;
		top: 114rpx;
	}

	.detail_empty {
		font-size: 32rpx;
		color: #999999;
		margin: 0 auto;
		position: absolute;
		top: 248rpx;
		font-family: 苹方-简;
		letter-spacing: 2rpx;
	}

	.detail_content {
		width: 680rpx;
		height: 106rpx;
		margin: 0 auto;
		background: #FFFFFF;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		position: relative;
	}

	.detail_content_word1 {
		position: absolute;
		left: 26rpx;
		top: 12rpx;
		font-size: 30rpx;
		font-family: 苹方-简 常规体;
		font-weight: 500;
	}

	.detail_content_word2 {
		position: absolute;
		right: 24rpx;
		top: 12rpx;
		font-size: 30rpx;
		font-family: 苹方-简 常规体;
		font-weight: 500;
	}

	.detail_content_word3 {
		position: absolute;
		right: 24rpx;
		bottom: 12rpx;
		font-size: 24rpx;
		font-family: 苹方-简 常规体;
		color: #999999;
	}

	.detail_content_date {
		position: absolute;
		left: 26rpx;
		bottom: 12rpx;
		font-size: 24rpx;
		font-family: 苹方-简 常规体;
		color: #999999;
	}
</style>
