<template>
	<view class="spare-parts-info">
		<ul class="main-ul" v-for="(item,index) in info" :key="index">
			<li>
				<text class="sub-title">备件名称</text>
				<text class="content">{{item.name}}</text>
			</li>
			<li>
				<text class="sub-title">备件编号</text>
				<text class="content">{{item.num}}</text>
			</li>
			<li>
				<text class="sub-title">规格型号</text>
				<text class="content">{{item.type}}</text>
			</li>
			<li class="last-li">
				<text class="sub-title">库&#8195;&#8195;存</text>
				<text class="content">{{item.remain}}</text>
				<text @tap="handle(index)">{{item.isJoin ? '取消备件' : '加入备件'}}</text>
			</li>
		</ul>
	</view>
</template>

<script>
	export default {
		name: 'spare-parts-info',
		props: {
			info: {
				type: Array,
				required: true
			}
		},
		methods: {
			handle(index) {
				let info = JSON.parse(JSON.stringify(this.info));
				info[index].isJoin = info[index].isJoin ? false : true;
				this.$emit("update:info",info);
				this.$emit('handle',info[index])
			}
		}
	}
</script>

<style lang="scss" scoped>
	.spare-parts-info {
		.main-ul {
			background-color: $bg-main;
			margin-top: 32rpx;
			border-radius: 24rpx;
			padding: 38rpx 38rpx 0;
			font-size: 28rpx;
			font-weight: 500;

			li {
				display: flex;
				align-items: center;
				margin-bottom: 38rpx;

				&.last-li {
					padding-bottom: 35rpx;
					justify-content: space-between;

					.content {
						flex: 1;
					}
				}

				.left-box {
					flex: 1;
					border: 1px solid blue;

					.sub-title {
						width: 174rpx;
						flex-shrink: 0;
						border: 1rpx solid red;
					}
				}

				.sub-title {
					width: 174rpx;
					color: #666666;
					flex-shrink: 0;
					// border:1px solid red;
				}

				.content {
					color: #333;
					// border:1px solid red;
				}
			}
		}
	}
</style>
