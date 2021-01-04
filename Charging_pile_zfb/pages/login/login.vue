<template>
	<view class="content">
		<view class="top">
			<view class="title_left" :class="tab==0?'title_active':''" data-index="0" @tap="changeTab">登录</view>
			<view class="title_right" :class="tab==1?'title_active':''" data-index="1" @tap="changeTab">注册</view>
		</view>
		<view class="container" v-if="tab==0">
			<input type="number" @input="onKeyInputPhone" class="custName" placeholder="请输入手机号" placeholder-class="custName_pla"></input>
			<input type="text" password="true" @input="onKeyInputPsd" class="custName2" placeholder="请输入密码" placeholder-class="custName_pla"></input>
			<view class="confirm" @tap="showPro">确认</view>
			<view class="confirm2" @tap="cancel">取消</view>
			<view class="forget" @tap="forgetPsd">忘记密码?</view>
		</view>
		<view class="container2" v-if="tab==1">
			<input type="number" @input="onKeyInputPhone" class="custName" placeholder="请输入手机号" placeholder-class="custName_pla"></input>
			<input type="number" @input="onKeyInputCode" class="custName2" placeholder="验证码" placeholder-class="custName_pla"></input>
			<input type="text" password="true" @input="onKeyInputPsd" class="custName3" placeholder="请输入密码" placeholder-class="custName_pla"></input>
			<input type="text" password="true" @input="onKeyInputPsdSec" class="custName4" placeholder="请再次输入密码"
			 placeholder-class="custName_pla"></input>
			<view class="code" @tap="reCode">{{code}}</view>
			<view class="confirm3" @tap="showProRegister">确认</view>
			<view class="confirm4" @tap="cancel">取消</view>
		</view>
		<view class="prompt" v-if="showPrompt==1">{{prompt}}</view>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js';
	export default {
		data() {
			return {
				tab: 1,
				prompt: '手机号输入有误，请重新输入',
				showPrompt: 0,
				code: '获取验证码',
				disabled: true,
				phoneNum: '',
				password: '',
				passwordSec: '',
				smsCode: '',
				appCust: ''
			}
		},
		onLoad() {

		},
		methods: {
			onKeyInputPhone: function(event) {
				this.phoneNum = event.target.value
				// console.log(this.phoneNum)
			},
			onKeyInputCode: function(event) {
				this.smsCode = event.target.value
				// console.log(this.smsCode)
			},
			onKeyInputPsd: function(event) {
				this.password = event.target.value
				// console.log(this.password)
			},
			onKeyInputPsdSec: function(event) {
				this.passwordSec = event.target.value
				console.log(this.passwordSec)
			},
			// 获取验证码
			reCode() {
				let self = this;
				if (!utlis.checkMobile(this.phoneNum)) {
					my.showToast({
						content: '手机号输入有误，请重新输入',
						duration: 2000,
						type: 'none'
					})
					return;
				}
				var time = 60
				if (self.code == "获取验证码" || self.code == "重新获取") {
					self.code = time + "s后重获"
					let data = {
						phone: self.phoneNum,
						userSource: 2
					}
					uni.showLoading({
						title: '加载中'
					})
					utlis.http("POST", 'smsSend', data, function(res) {
						if (res.status == "success") {
							uni.hideLoading()
							my.showToast({
								content: res.msg,
								duration: 2000,
								type: 'success'
							})
						} else {
							// 验证提示
							uni.hideLoading()
							my.showToast({
								content: res.msg,
								duration: 2000,
								type: 'none'
							})
						}
					})
					var verification = setInterval(() => {
						time--;
						self.code = time + "s后重获";
						if (time == 0) {
							self.code = "重新获取";
							time = 60;
							clearInterval(verification)
						}
					}, 1000);
				}
			},
			// 提交
			showPro() {
				let self = this;
				if (!utlis.checkMobile(this.phoneNum)) {
					my.showToast({
						content: '手机号输入有误，请重新输入',
						duration: 2000,
						type: 'none'
					})
					return;
				}
				if (this.password == '') {
					my.showToast({
						content: '密码不能为空',
						duration: 2000,
						type: 'none'
					})
					return;
				}
				let data = {
					custName: self.phoneNum,
					password: self.password
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'appLoginHj', data, function(res) {
					if (res.status == "success") {
						uni.setStorageSync("token", res.token)
						uni.setStorageSync("refreshToken", res.refreshToken)
						uni.setStorageSync('phoneNum', self.phoneNum)
						uni.setStorageSync('custName', self.phoneNum)
						uni.setStorageSync('password', self.password)
						uni.setStorageSync("egCode", res.egCode)
						uni.setStorageSync("stationId", res.stationId)
						uni.setStorageSync("connectorID", res.connectorID)
						self.appCust = res.appCust
						// 登录提示
						uni.hideLoading()
						my.showToast({
							content: res.msg,
							duration: 2000,
							type: 'success'
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/power/power'
							})
						}, 2000)
					} else {
						// 登录提示
						uni.hideLoading()
						my.showToast({
							content: res.msg,
							duration: 2000,
							type: 'none'
						})
					}
				})
			},
			//注册提交
			showProRegister() {
				let self = this;
				if (!utlis.checkMobile(this.phoneNum)) {
					my.showToast({
						content: '手机号输入有误，请重新输入',
						duration: 2000,
						type: 'none'
					})
					return;
				}
				if (this.smsCode == '') {
					my.showToast({
						content: '验证码不能为空',
						duration: 2000,
						type: 'none'
					})
					return;
				}
				if (this.password == '') {
					my.showToast({
						content: '密码不能为空',
						duration: 2000,
						type: 'none'
					})
					return;
				}
				if (this.password != this.passwordSec) {
					my.showToast({
						content: '两次密码不一致，请重新输入',
						duration: 2000,
						type: 'none'
					})
					return;
				}
				let data = {
					forget: 0,
					custName: self.phoneNum,
					smsCode: self.smsCode,
					password: self.password,
					userSource: 2,
					xmType: 1
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'appRegister', data, function(res) {
					if (res.status == "success") {
						uni.setStorageSync("token", res.token)
						uni.setStorageSync("refreshToken", res.refreshToken)
						uni.setStorageSync('phoneNum', self.phoneNum)
						uni.setStorageSync('custName', self.phoneNum)
						// 注册提示
						uni.hideLoading()
						my.showToast({
							content: res.msg,
							duration: 2000,
							type: 'success'
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/power/power'
							})
						}, 2000)
					} else {
						// 注册提示
						uni.hideLoading()
						my.showToast({
							content: res.msg,
							duration: 2000,
							type: 'none'
						})
					}
				})

			},
			changeTab(e) {
				this.tab = e.target.dataset.index
			},
			forgetPsd(e) {
				uni.navigateTo({
					url: '/pages/forget/forget'
				})
			},
			cancel(e) {
				uni.reLaunch({
					url: '/pages/power/power'
				})
			},
		}
	}
</script>

<style>
	.content {
		align-items: center;
		justify-content: center;
		background: #F3F3F3;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		position: relative;
		text-align: center;
	}

	.top {
		width: 100%;
		height: 372rpx;
		position: absolute;
		top: 0;
		left: 0;
		background: linear-gradient(rgba(250, 166, 4, 1), rgba(255, 162, 2, 1));
	}

	.title_left {
		position: absolute;
		top: 28rpx;
		left: 80rpx;
		font-size: 42rpx;
		color: #FFFFFF;
	}

	.title_right {
		position: absolute;
		top: 28rpx;
		left: 252rpx;
		font-size: 42rpx;
		color: #FFFFFF;
	}

	.title_active {
		font-size: 60rpx;
		position: absolute;
		top: 14rpx;
	}

	.container {
		width: 690rpx;
		height: 680rpx;
		border-radius: 40rpx;
		background: #FFFFFF;
		position: absolute;
		top: 172rpx;
		left: 30rpx;
		color: #999999;
		font-size: 30rpx;
	}

	.container2 {
		width: 690rpx;
		height: 850rpx;
		border-radius: 40rpx;
		background: #FFFFFF;
		position: absolute;
		top: 172rpx;
		left: 30rpx;
		color: #999999;
		font-size: 30rpx;
	}

	.custName {
		width: 572rpx;
		height: 120rpx;
		position: absolute;
		top: 22rpx;
		left: 52rpx;
		text-align: left;
		color: #333333;
		border-bottom: 2rpx solid #F3F3F3;
		padding-left: 30rpx;
	}

	.custName2 {
		width: 572rpx;
		height: 120rpx;
		position: absolute;
		top: 142rpx;
		left: 52rpx;
		text-align: left;
		color: #333333;
		border-bottom: 2rpx solid #F3F3F3;
		padding-left: 30rpx;
	}

	.custName3 {
		width: 572rpx;
		height: 120rpx;
		position: absolute;
		top: 262rpx;
		left: 52rpx;
		text-align: left;
		color: #333333;
		border-bottom: 2rpx solid #F3F3F3;
		padding-left: 30rpx;
	}

	.custName4 {
		width: 572rpx;
		height: 120rpx;
		position: absolute;
		top: 402rpx;
		left: 52rpx;
		text-align: left;
		color: #333333;
		border-bottom: 2rpx solid #F3F3F3;
		padding-left: 30rpx;
	}

	.custName_pla {}

	.forget {
		position: absolute;
		right: 56rpx;
		bottom: 66rpx;
		font-size: 30rpx;
		color: #FEA503;
	}

	.code {
		width: 260rpx;
		height: 120rpx;
		line-height: 120rpx;
		position: absolute;
		right: 50rpx;
		top: 150rpx;
		font-size: 30rpx;
		color: #FEA503;
		z-index: 2;
	}

	.confirm {
		position: absolute;
		bottom: 242rpx;
		left: 55rpx;
		width: 580rpx;
		height: 84rpx;
		line-height: 84rpx;
		background: #FEA503;
		font-size: 32rpx;
		color: #FFFFFF;
		border-radius: 42rpx;
	}

	.confirm2 {
		position: absolute;
		bottom: 128rpx;
		left: 55rpx;
		width: 580rpx;
		height: 84rpx;
		line-height: 84rpx;
		border: 2rpx solid #ECECEC;
		font-size: 32rpx;
		color: #999999;
		border-radius: 42rpx;
	}

	.confirm3 {
		position: absolute;
		bottom: 202rpx;
		left: 55rpx;
		width: 580rpx;
		height: 84rpx;
		line-height: 84rpx;
		background: #FEA503;
		font-size: 32rpx;
		color: #FFFFFF;
		border-radius: 42rpx;
	}

	.confirm4 {
		position: absolute;
		bottom: 88rpx;
		left: 55rpx;
		width: 580rpx;
		height: 84rpx;
		line-height: 84rpx;
		border: 2rpx solid #ECECEC;
		font-size: 32rpx;
		color: #999999;
		border-radius: 42rpx;
	}

	.prompt {
		width: 414rpx;
		height: 40rpx;
		line-height: 40rpx;
		color: #FFFFFF;
		font-size: 24rpx;
		position: absolute;
		left: 168rpx;
		bottom: 172rpx;
		background: #000000;
		border-radius: 20rpx;
	}
</style>
