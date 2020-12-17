<template>
	<view class="top-bar" :style="`height:${customBarH}px;background-color:${theme_color.main_color};`">
		<view class="custom-bar" :style="`height:${customBarH}px;padding-top:${statusBarH}px;color:${theme_color.font_color};`">
			<!-- 左侧 -->
			<view class="left-bar">
				<!-- 返回按钮 -->
				<text @click="navigateBack" v-if="isBack">返回</text>
			</view>
			<!-- 中部 -->
			<view class="center-bar">
				<slot name="title"></slot>
			</view>
			<!-- 右侧 -->
			<view class="right-bar">
				<slot name="right1"></slot>
				<slot name="right2"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isBack: {
				type: Boolean,
				default: false
			},
			isSearch: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				//状态高度
				statusBarH: this.statusBar,
				//自定义高度
				customBarH: this.customBar
			}
		},
		created() {},
		computed: {
			// style() {
			// 	return `height:${this.customBarH}rpx;`
			// },
			currentTheme() {
				return this.$store.getters["theme/currentTheme"]
			}
		},
		methods: {
			//返回上一页
			navigateBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top-bar {
		// background-color: $bg-navigation;
		box-sizing: border-box;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 999;
		font-size: 34rpx;
		font-weight: 500;

		.custom-bar {
			box-sizing: border-box;
			padding-left: 38rpx;
			padding-right: 38rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			>view {
				flex: 1;
			}

			.left-bar {}

			.center-bar {
				text-align: center;
			}

			.right-bar {
				text-align: right;
			}
		}
	}
</style>
