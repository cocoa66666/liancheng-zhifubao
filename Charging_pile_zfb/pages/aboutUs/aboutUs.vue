<template>
	<view class="content">
		<view class="part">
			<block v-for="(item,index) in part" :key="index">
				<text class="part_content">
					{{item.content}}
				</text>
				<br>
			</block>
		</view>
		<view class="slogan" v-for="(item,index) in list" :key="index">
			<view class="slogan_wrap">
				<view class="slogan_pic"></view>
				<view class="slogan_title">{{item.title}}</view>
			</view>
			<view>{{item.content}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				part: [{
					content: '“联城联充”是武汉联城一家智慧能源有限公司重点打造的智能管理平台，创新"大数据+全平台"思维，构建智慧商业平台。利用互联网平台、云技术计算，从远程监控，财务汇总、数据分析、车辆共享等方面实现公司资产的集中式管理，网络化、数字化、大联网，实现信息系统的综合采集、综合存储、综合整理、综合利用，从而达到提高公司资产利用率、降低管理成本。'
				}],
				list: [{
						title: '核心价值观',
						content: "高效、环保、创新、共赢"
					},
					{
						title: '使命',
						content: '建设智慧城市，倡导绿色出行'
					},
					{
						title: '愿景',
						content: '打造智慧城市共享出行服务生态'
					}
				]
			}
		}
	}
</script>

<style>
	.content {
		background: #FFFFFF;
		height: 100vh;
		overflow: hidden;
		position: relative;
		font-size: 30rpx;
		font-weight: 500;
	}

	.slogan {
		margin-left: 30rpx;
		margin-top: 10rpx;
	}

	.slogan_wrap {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}

	.slogan_pic {
		width: 10rpx;
		height: 32rpx;
		background: #FEA503;
		display: inline-block;
		vertical-align: middle;
	}

	.slogan_title {
		display: inline-block;
		padding-left: 10rpx;
		font-weight: 600;
		font-size: 32rpx;
		vertical-align: middle;
		letter-spacing: 2rpx;
	}

	.part {
		margin-top: 32rpx;
		width: 690rpx;
		margin-left: 30rpx;
	}

	.part_content {
		font-size: 30rpx;
		padding-left: 60rpx;
		font-weight: 500;
	}
</style>
