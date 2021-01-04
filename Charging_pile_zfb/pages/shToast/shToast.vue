<template>
	<view class="mask999">
		<view class="shToast">
			<image class="toastImg" :src="shImg"></image>
			{{content}}
		</view>
	</view>
</template>

<script>
	export default {
		props: ['content','shImg'],
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	.mask999 {
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
	}

	.shToast {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 300rpx;
		height: 300rpx;
		border-radius: 10rpx;
		background: rgba(0, 0, 0, .6);
		color: #FFFFFF;
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -150rpx;
		margin-top: -194rpx;
		box-sizing: border-box;
		padding-left: 20rpx;
		padding-right: 20rpx;
		word-break: break-all;
		z-index: 99;
	}

	.toastImg {
		width: 100rpx;
		height: 100rpx;
	}
</style>
