<template>
	<view class="tabs" :style="`background-color:${bgColor}`">
		<scroll-view :scroll-x="true" :scroll-left="scrollLeft" :scroll-with-animation="scroll" :show-scrollbar="false" id="scrollContainer">
			<view class="tabs-container">
				<view class="tabs-container-item" :style="`padding:${paddingTopBot}rpx ${paddingLeftRight}rpx;`" v-for="(item,index) in tabs" :index="index" :class="{active:currentIndex==index}"
				 @tap="changeTabs(index)">{{item}}</view>
				<view class="tabs-container-line" :style="{width: lineWidth + 'px',left: lineLeft + 'px',transform: `translateX(-${lineWidth / 2}px)`}"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			currentIndex: {//当前选中的index
				type: Number,
				default: 0
			},
			tabs:{//tab标题
				type:Array,
				default:[]
			},
			bgColor:{
				type:String,
				default:'#fff'
			},
			itemPadding:{
				type:String,
				default:"63rpx"
			},
			paddingTopBot:{
				type:Number,
				default:26
			},
			paddingLeftRight:{
				type:Number,
				default:30
			}
		},
		data() {
			return {
				containerWidth: 0, //
				currentWidth: 0, //当前滑块的宽度
				lineWidth:0, //
				lineLeft:0, // 滑块距离左侧的位置
				pillsLeft: 0, // 胶囊距离左侧的位置
				scrollLeft: 0, // 距离左边的位置
				lineScale: 0.5,
				scroll:true
			}
		},
		watch:{
			currentIndex(newVal){
				this.changeTabs(newVal)
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getTabItemWidth();
			})
		},
		methods: {
			// scrollWithAnimation(){},
			//tabs发生改变
			changeTabs(index) {
				this.$emit("update:currentIndex",index);
				this.$nextTick(() => {
					this.getTabItemWidth();
				})
			},
			getTabItemWidth() {
				//创建查询条件
				let query = uni.createSelectorQuery().in(this)

				//获取容器宽度
				query.select('#scrollContainer').boundingClientRect(data => {
					if (!this.containerWidth && data) {
						this.containerWidth = data.width
					}
				}).exec();

				//获取所有tab-item的宽度
				query
					.selectAll('.tabs-container-item')
					.boundingClientRect((data) => {
						if (!data) {
							return
						}
						let lineLeft = 0
						let currentWidth = 0
						if (data) {
							for (let i = 0; i < data.length; i++) {
								if (i < this.currentIndex) {
									lineLeft += data[i].width
								} else if (i == this.currentIndex) {
									currentWidth = data[i].width
								} else {
									break
								}
							}
						}
						// 当前滑块的宽度
						this.currentWidth = currentWidth
						// 缩放后的滑块宽度
						// this.lineWidth = currentWidth * this.lineScale * 1
						this.lineWidth = 44;
						// 滑块作移动的位置
						this.lineLeft = lineLeft + currentWidth / 2
						// 胶囊距离左侧的位置
						this.pillsLeft = lineLeft
						// 计算滚动的距离左侧的位置
						// if (this.scroll) {
							this.scrollLeft = this.lineLeft - this.containerWidth / 2
						// }
					})
					.exec()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs {
		padding:0 22rpx;
		::-webkit-scrollbar {
			display: none;
		}

		&-container {
			min-width: 100%;
			position: relative;
			display: inline-flex;
			align-items: center;
			white-space: nowrap;
			overflow: hidden;

			&-item {
				box-sizing: border-box;
				position: relative;
				// padding: 26rpx 30rpx;
				font-size: 28rpx;
				color:#666666;
				&.active {
					// position: relative;
					color: $bg-active;
				}
			}

			&-line {
				height: 4rpx;
				border-radius: 4rpx;
				background-color: $bg-active;
				position: absolute;
				bottom: 0;
				transition: all 0.3s linear;
			}
		}
	}
</style>
