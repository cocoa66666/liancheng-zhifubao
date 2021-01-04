<template>
	<view class="content">
		<view class="update_title">{{version}}</view>
		<rich-text :nodes="content" type='text'></rich-text>
		<!-- <view @tap="toOtherApplets">123321123</view> -->
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js';
	import parse from 'mini-html-parser2';
	export default {
		data() {
			return {
				version: '',
				content: ''
			}
		},
		onShow() {
			this.getVersion();
		},
		methods: {
			//前往其他小程序
			// toOtherApplets() {
			// 	uni.navigateToMiniProgram({
			// 		appId: 'wxd5b706797f401a0d',
			// 		path: '',
			// 		extraData: {
			// 			'data1': 'test'
			// 		},
			// 		success(res) {
			// 			// 打开成功
			// 			console.log('success')
			// 		}
			// 	})
			// },
			// 获取版本信息
			getVersion() {
				let self = this;
				let data = {
					userSource: 2,
					xmType: 1
				}
				uni.showLoading({
					title: '加载中'
				})
				utlis.http("POST", 'cdxmVersion', data, function(res) {
					if (res.status == "success") {
						self.version = res.version;
						self.content = res.content;
						parse(self.content, (err, text) => {
							if (!err) {
								self.content = text;
							};
						});
						uni.setStorageSync('version', res.version)
						uni.hideLoading()
					} else {
						uni.hideLoading()
					}
				})
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
		width: 100%;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.update_title {
		margin-top: -400rpx;
		margin-bottom: 50rpx;
	}

	.update_content {
		color: #666666;
		margin-top: 6rpx;
		margin-bottom: 6rpx;
		word-break: break-all;
		line-height: 50rpx;
	}
</style>
