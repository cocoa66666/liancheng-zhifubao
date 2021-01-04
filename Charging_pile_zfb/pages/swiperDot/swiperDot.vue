<template>
	<view class="dot-main">
		<view :class="['dot-item',current==index?'active':'']" v-for="(item,index) in list" :key="index"></view>
	</view>
</template>
<style>
	.dot-main {
		margin-top: 20rpx;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 20rpx;
		left: -100rpx;
	}

	.dot-item {
		width: 14rpx;
		height: 14rpx;
		border: 1rpx solid rgba(79, 183, 115, 1);
		margin: 0 6rpx;
		box-sizing: border-box;
		border-radius: 50%;
	}

	.active {
		background: rgba(79, 183, 115, 1);
	}
</style>
<script>
	export default {
		props: ['list', 'current'],
		data() {
			return {

			};
		},
		methods:{
		}
	}
</script>
