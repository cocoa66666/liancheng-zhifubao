<template>
	<view class="content">
		<view class="top">
			<image class="phoImg" src="../../static/img/touxiang23x.png"></image>
			<view class="phoNum">
				{{phone}}
			</view>
		</view>
		<view class="service">
			<view class="service_content">
				<!-- 				<view class="ser_con">
					<image class="ser_con_img" src="../../static/img/cheweifenxiang_icon3x.png"></image>
					<view class="ser_con_word">车位分享</view>
					<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
				</view> -->
				<!-- 				<view class="ser_con" data-id="100" @tap="discount">
					<image class="ser_con_img" src="../../static/img/youhuikaquan_icon3x.png"></image>
					<view class="ser_con_word">优惠卡卷</view>
					<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
				</view> -->
				<!--<view class="ser_con">
					<image class="ser_con_img" src="../../static/img/wodexiaoxi_icon3x.png"></image>
					<view class="ser_con_word">我的消息</view>
					<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
				</view> -->
				<view class="ser_con" @tap="about">
					<image class="ser_con_img" src="../../static/img/guanyuwomen_icon3x.png"></image>
					<view class="ser_con_word">关于我们</view>
					<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
				</view>
				<view>
					<button class="ser_con btn" open-type="contact" @contact="handleContact">
						<image class="ser_con_img3" src="../../static/img/zaixiankefu.png"></image>
						<view class="ser_con_word">在线客服</view>
						<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
					</button>
				</view>
				<view class="ser_con" @tap="customerPhone">
					<image class="ser_con_img" src="../../static/img/kefudianhua_icon3x.png"></image>
					<view class="ser_con_word">电话客服</view>
					<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
				</view>
<!-- 				<view class="ser_con" @tap="showMywallet">
					<image class="ser_con_img" src="../../static/img/qianbaohei3x.png"></image>
					<view class="ser_con_word">我的钱包</view>
					<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
				</view> -->
				<view class="ser_con" @tap="showMywalletDetail">
					<image class="ser_con_img" src="../../static/img/zhangdanxiangqing_icon3x.png"></image>
					<view class="ser_con_word">账单明细</view>
					<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
				</view>
				<view class="ser_con" @tap="version1">
					<image class="ser_con_img" src="../../static/img/banbengengxin_icon3x.png"></image>
					<view class="ser_con_word">版本信息</view>
					<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
					<view class="redDot" v-if="ver==1"></view>
				</view>
				<view class="ser_con" @tap="exit">
					<image class="ser_con_img" src="../../static/img/tuichudenglu_icon3x.png"></image>
					<view class="ser_con_word">退出登录</view>
					<image class="ser_con_img2" src="../../static/img/xiangqing_icon3x.png"></image>
				</view>
			</view>
		</view>
		<view class="mask" v-if="showModal==1">
			<view class="modal">
				<view class="modal_content">
					拨打电话<span style="color: #FEA503;padding-left:12rpx;font-size: 34rpx;">400-1080-448</span>
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
	import utlis from "../../static/js/utlis.js"
	export default {
		data() {
			return {
				phoneNum: '',
				phone: '',
				showModal: 0,
				version: '',
				ver: 0
			}
		},
		onLoad() {
			let phoneNum = uni.getStorageSync('phoneNum')
			this.phoneNum = phoneNum
			this.getUserInfo(this.phoneNum)
		},
		onShow() {
			this.getVersion();
		},
		methods: {
			discount(e) {
				console.log(e.currentTarget.dataset.id)
			},
			about() {
				uni.navigateTo({
					url: '/pages/aboutUs/aboutUs'
				});
			},
			// 客服电话
			customerPhone() {
				this.showModal = 1;
			},
			modal_cancel() {
				this.showModal = 0;
			},
			modal_confirm() {
				this.showModal = 0;
				uni.makePhoneCall({
					// 手机号
					phoneNumber: '4001080448',
					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},
			version1() {
				uni.navigateTo({
					url: '/pages/version/version'
				});
			},
			exit() {
				uni.clearStorageSync();
				uni.reLaunch({
					url: '/pages/power/power'
				});
			},
			// 获取版本信息
			getVersion() {
				let self = this;
				let data = {
					userSource: 2,
					xmType: 1
				}
				utlis.http("POST", 'cdxmVersion', data, function(res) {
					if (res.status == "success") {
						self.version = res.version;
						if (self.version != uni.getStorageSync('version')) {
							self.ver = 1;
						} else {
							self.ver = 0;
						}
					} else {
					}
				})
			},
			//获取用户信息
			getUserInfo(e) {
				let self = this;
				let data = {
					custName: e
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'appCustCenter', data, function(res) {
					if (res.status == "success") {
						uni.hideLoading()
						uni.setStorageSync("custName", res.custName);
						self.phone = res.custName;
					} else {
						uni.hideLoading()
					}
				})
			},
			//跳转到钱包页面
			showMywallet() {
				uni.navigateTo({
					url: '/pages/myWallet/myWallet'
				});
			},
			//跳转到钱包页面详情
			showMywalletDetail() {
				uni.navigateTo({
					url: '/pages/myWalletDetail/myWalletDetail'
				});
			},
			//在线客服
			handleContact(e) {
				console.log(e)
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

	.modal {
		position: fixed;
		left: 85rpx;
		top: 346rpx;
		width: 580rpx;
		height: 252rpx;
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
		top: 60rpx;
		left: 105rpx;
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

	/* 顶部 */
	.top {
		width: 100%;
		height: 304rpx;
		background: linear-gradient(rgba(250, 166, 4, 1), rgba(255, 162, 2, 1));
		position: absolute;
		top: 0;
	}

	.phoImg {
		width: 130rpx;
		height: 130rpx;
		position: absolute;
		left: 40rpx;
		top: 80rpx;
	}

	.phoNum {
		position: absolute;
		top: 121rpx;
		left: 200rpx;
		color: #FFFFFF;
		font-size: 34rpx;
	}

	/* 服务 */
	.service {
		width: 100%;
		height: 982rpx;
		background: #FFFFFF;
		border-radius: 40rpx;
		position: absolute;
		top: 248rpx;
		box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.4);
	}

	.service_content {
		text-align: center;
		/* display: flex; */
		/* flex-direction: column; */
		padding-top: 20rpx;
	}

	.ser_con {
		/* flex: 1; */
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		position: relative;
		text-align: center;
	}

	.ser_con_img {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		left: 40rpx;
		top: 30rpx;
	}

	.ser_con_img3 {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		left: 35rpx;
		top: 25rpx;
	}

	.ser_con_word {
		position: absolute;
		left: 120rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.ser_con_img2 {
		width: 28rpx;
		height: 28rpx;
		position: absolute;
		right: 40rpx;
		top: 36rpx;
	}

	.btn {
		background: none;
		border: none;
	}

	button::after {
		border: none;
	}

	.redDot {
		width: 14rpx;
		height: 14rpx;
		background: red;
		position: absolute;
		left: 84rpx;
		top: 20rpx;
		border-radius: 50%;
	}
</style>
