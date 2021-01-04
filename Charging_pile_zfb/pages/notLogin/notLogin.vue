<template>
	<view class="content">
		<view class="title">您还没有登录，请前往登录</view>
		<view class="container" @tap="toLogin">登录/注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},

		methods: {
			toLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
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

	.title {
		width: 100%;
		color: #999999;
		font-size: 30rpx;
		position: absolute;
		top: 314rpx;
		font-family: 苹方-简 常规体;
	}

	.container {
		position: absolute;
		top: 466rpx;
		left: 85rpx;
		width: 580rpx;
		height: 84rpx;
		line-height: 84rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		background: #4FB773;
		border-radius: 42rpx;
	}
</style>
