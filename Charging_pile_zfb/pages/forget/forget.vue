<template>
	<view class="content">
		<view class="top">
			<view class="title">找回密码</view>
		</view>
		<view class="container">
			<input type="number" @input="onKeyInputPhone" class="custName" placeholder="请输入手机号" placeholder-class="custName_pla"></input>
			<input type="number" @input="onKeyInputCode" class="custName2" placeholder="验证码" placeholder-class="custName_pla"></input>
			<input type="text" @input="onKeyInputPsd" password="true" class="custName3" placeholder="请输入密码" placeholder-class="custName_pla"></input>
			<input type="text" @input="onKeyInputPsdSec" password="true" class="custName4" placeholder="请再次输入密码"
			 placeholder-class="custName_pla"></input>
			<view class="code" @tap="reCode">{{code}}</view>
			<view class="confirm" @tap="showPro">确认</view>
		</view>
		<view class="prompt" v-if="showPrompt==1">{{prompt}}</view>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js';
	export default {
		data() {
			return {
				code: '获取验证码',
				prompt: '手机号输入有误，请重新输入',
				showPrompt: 0,
				phoneNum: '',
				password: '',
				passwordSec: '',
				smsCode: ''
			}
		},
		onLoad() {

		},
		methods: {
			onKeyInputPhone: function(event) {
				this.phoneNum = event.target.value
				console.log(this.phoneNum)
			},
			onKeyInputCode: function(event) {
				this.smsCode = event.target.value
				console.log(this.smsCode)
			},
			onKeyInputPsd: function(event) {
				this.password = event.target.value
				console.log(this.password)
			},
			onKeyInputPsdSec: function(event) {
				this.passwordSec = event.target.value
				console.log(this.passwordSec)
			},
			//获取验证码
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
							console.log(res)
							// 验证提示
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
				if (this.smsCode == '') {
					my.showToast({
						content: '验证码不能为空',
						duration: 2000,
						type: 'none'
					})
					return;
				}
				if (this.password == '' || this.passwordSec == '') {
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
					forget: 1,
					custName: self.phoneNum,
					smsCode: self.smsCode,
					password: self.password
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'appRegister', data, function(res) {
					if (res.status == "success") {
						console.log(res)
						uni.setStorageSync('phoneNum', self.phoneNum)
						console.log(1)
						// 提示
						uni.hideLoading()
						my.showToast({
							content: res.msg,
							duration: 2000,
							type: 'success'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 2000)
					} else {
						// 提示
						uni.hideLoading()
						my.showToast({
							content: res.msg,
							duration: 2000,
							type: 'none'
						})
					}
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

	.title {
		position: absolute;
		top: 28rpx;
		left: 80rpx;
		font-size: 60rpx;
		color: #FFFFFF;
	}

	.container {
		width: 690rpx;
		height: 750rpx;
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
		z-index: 4;
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
		z-index: 3;
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
		z-index: 2;
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
		z-index: 1;
	}

	.custName_pla {}

	.code {
		width: 260rpx;
		height: 120rpx;
		line-height: 120rpx;
		position: absolute;
		right: 40rpx;
		top: 144rpx;
		font-size: 30rpx;
		color: #FEA503;
		z-index: 6;
	}

	.confirm {
		position: absolute;
		bottom: 88rpx;
		left: 55rpx;
		width: 580rpx;
		height: 84rpx;
		line-height: 84rpx;
		background: #FEA503;
		font-size: 32rpx;
		color: #FFFFFF;
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
