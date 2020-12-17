<template>
	<view class="steps-page">
		<ul class="steps-ul">
			<li class="steps-li" v-for="(item,index) in steps" :key="index">
				<view class="left">
						<view class="date">{{getTime(item.f_LogDate).d3}}</view>
						<view class="date">{{getTime(item.f_LogDate).d2}}</view>
						<view class="text">{{item.f_OperatorName}}</view>
				</view>
				<view class="center" :class="{before:index!=0,after:index != steps.length-1}">
					<view class="round"></view>
				</view>
				<view class="right">
					<view class="title">{{item.f_LogTitle}}</view>
					<view class="text" style="padding-right:20rpx;">{{item.description}}</view>
				</view>
			</li>
		</ul>
	</view>
</template>

<script>
	import {getTime} from '@/utils/date.js'
	export default {
		name: 'steps-page',
		props:['steps'],
		data() {
			return {
				typeObj: {
					1: '保修',
					2:'已分派',
					3:'已接受',
					4:'维修中',
					5:'已解决'
				}
			}
		},
		methods:{
			getTime
		}
	}
</script>

<style lang="scss" scoped>
	.steps-page {
		// height: 100%;
		padding: 32rpx 0;
		box-sizing: border-box;

		.steps-ul {
			background-color: $bg-main;
			height: 100%;
			border-radius: 24rpx;

			.steps-li {
				display: flex;
				font-weight: 500;
				padding:40rpx 0;
				.left {
					text-align: right;
					width: 43%;
					.date {
						color: #666666;
						font-size: 28rpx;
					}
				}

				.text {
					color: #333;
					font-size: 26rpx;
				}
				.center{
					width:14%;
					box-sizing: border-box;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					&.before::before,&.after::after{
						content: '';
						display: block;
						width:2rpx;
						background-color: #b5b5b5;
						height:calc(50% + 40rpx);
						position: absolute;
						opacity: 0.59;
					}
					&.before::before{
						top:-42rpx;
					}
					&.after::after{
						bottom:-45rpx;
					}
					.round{
						width:26rpx;
						height:26rpx;
						border: 3rpx solid #2764fb;
						border-radius: 50%;
						box-sizing: border-box;
						background-color: #fff;
						z-index:100;
					}
				}
				.right {
					width: 43%;

					.title {
						color: #2764FB;
						font-weight: 700;
						font-size: 30rpx;
						margin-bottom: 16rpx;
					}
				}
			}
		}
	}
</style>
