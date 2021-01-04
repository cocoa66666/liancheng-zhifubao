<template>
	<view class="dot-main">
		<view :class="['dot-item',current==index?'active':'']" v-for="(item,index) in list" :key="index"></view>
	</view>
</template>
<style>
	.dot-main {
		margin-top: -30rpx;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 20rpx;
	}

	.dot-item {
		width: 14rpx;
		height: 14rpx;
		border: none;
		margin: 0 6rpx;
		box-sizing: border-box;
		border-radius: 50%;
		z-index: 999;
		background: #919191;
	}

	.active {
		background: #333333;
	}
</style>
<script>
	export default {
		props: ['list', 'current'],
		data() {
			return {

			};
		},
		methods: {}
	}
</script>
