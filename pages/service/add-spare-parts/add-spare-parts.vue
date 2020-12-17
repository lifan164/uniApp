<template>
	<view class="add-spare-parts" :style="`padding-top:${this.customBar}px;`">
		<header-bar :isBack="true">
			<text slot="title">选择备件</text>
			<text slot="right1" @tap="submit">确认</text>
		</header-bar>
		<view class="main">
			<view class="card">
				<!-- 搜索框 -->
				<view class="search-box">
					<view class="left">
						<text class="icon" @tap="searchData"></text>
						<input type="text" v-model="searchKey" placeholder="搜索备件名称、编号、规格型号">
					</view>
					<text class="scan" @tap="scanCode"></text>
				</view>
				<!-- tabs -->
				<tabs :tabs="tabs" :currentIndex.sync="currentIndex" :height="97" :paddingTopBot="26" :paddingLeftRight="100"></tabs>
			</view>

			<swiper style="height:calc(100% - 215rpx);padding-bottom: 1rpx;" current-item-id="1" :current="currentIndex" @change="(e) => {currentIndex = e.detail.current}">
				<swiper-item v-for="i of tabs.length" :key="i">
					<scroll-view class="scroll-view" scroll-y>
						<template v-if="datas && datas.length > 0">
							<view class="ul-box" v-for="(item,index) in  datas" :key="index">
								<ul class="main-ul">
									<li>
										<text class="sub-title">备件名称</text>
										<text class="content">{{item.itemName}}</text>
									</li>
									<li>
										<text class="sub-title">备件编号</text>
										<text class="content">{{item.itemNum}}</text>
									</li>
									<li class="last-li">
										<text class="sub-title">规格型号</text>
										<text class="content">{{item.size}}</text>
										<text @tap="handle(item)">{{getText(item.id)}}</text>
									</li>
								</ul>
							</view>

						</template>
						<template v-else>
							<view style="text-align:center;padding:30rpx 0;">暂无数据</view>
						</template>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	// import sparePartsInfo from './module/spare-parts-info.vue'
	import myScrollView from "@/components/my-scroll-view/my-scroll-view.vue"
	import {
		ywGDDevAndItem,
		ywCKGetItem
	} from "@/common/api/service.js"
	export default {
		components: {
			// sparePartsInfo,
			myScrollView
		},
		data() {
			return {
				dNum: '', //设备编号
				currentIndex: 0,
				tabs: ["关联备件", "全部备件"],
				datas: null, //数据列表
				searchKey: '', //查询关键字
				selecteds: []
			}
		},
		created() {
			this.getData()
		},
		onLoad(e) {
			console.log(e)
			this.dNum = e.dNum;
			this.selecteds = JSON.parse(e.selecteds)
		},
		watch: {
			currentIndex(newVal) {
				this.getData()
			}
		},
		methods: {
			//扫码
			scanCode(){
				/* #ifdef APP-PLUS */
				let _this = this;
					uni.scanCode({
					    success: function (res) {
							_this.searchKey = res.result;
					    }
					});
				/* #endif */
			},
			submit() {
				if(this.selecteds.length == 0){
					uni.showToast({
						title:'请选择备件',
						icon:'none'
					})
				}else{
					let pages = getCurrentPages();
					let prevPage = pages[pages.length - 2];
					prevPage.$vm.formData.wxCls = this.selecteds;
					uni.navigateBack()
				}
			},
			getText(id) {
				return this.selecteds.map(a => a.id).indexOf(id) > -1 ? '取消备件' : '加入备件'
			},
			//加入 取消 备件
			handle(info) {
				let selecteds = this.selecteds;
				let index = selecteds.map(a => a.id).indexOf(info.id);
				if (index == -1) {
					info.clShul = 1;
					selecteds.push(info)
				} else {
					selecteds.splice(index, 1)
				}
				console.log(selecteds)
			},
			//查询数据
			searchData() {
				this.currentIndex == 1 ? this.getYwCKGetItem() : this.currentIndex = 1;
			},
			//获取全部备件列表
			async getYwCKGetItem() {
				this.datas = await ywCKGetItem({
					whereLamda: this.searchKey
				});
			},
			//获取关联备件列表
			async getYwGDDevAndItem() {
				this.datas = await ywGDDevAndItem({
					dNum: this.dNum
				})
			},
			//获取数据
			getData() {
				if (this.currentIndex == 0) {
					this.getYwGDDevAndItem();
				} else {
					this.getYwCKGetItem();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-spare-parts {
		height: 100%;
		box-sizing: border-box;

		.scroll-view {
			height: 100%;
			box-sizing: border-box;
			padding-bottom: 1rpx;

			.ul-box {
				margin-top: 32rpx;

				&:last-child {
					padding-bottom: 32rpx;
				}
			}

			.main-ul {
				background-color: $bg-main;
				border-radius: 24rpx;
				padding: 38rpx 38rpx 0;
				font-size: 28rpx;
				font-weight: 500;
				box-sizing: border-box;

				li {
					display: flex;
					align-items: center;
					padding-bottom: 38rpx;

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
					}

					.content {
						color: #333;
					}
				}
			}
		}

		.main {
			height: 100%;
			box-sizing: border-box;

			.card {
				background-color: $bg-main;
				border-radius: 0 0 24rpx 24rpx;
				padding: 24rpx 40rpx 0;

				.search-box {
					display: flex;
					align-items: center;
					padding-bottom: 20rpx;

					.left {
						flex: 1;
						background: #fafbff;
						border: 1rpx solid #cfd2dd;
						border-radius: 16rpx;
						padding: 20rpx;
						display: flex;
						align-items: center;

						.icon {
							width: 31rpx;
							height: 32rpx;
							border: 1rpx solid #666666;
							margin-right: 7rpx;
						}

						input {
							font-size: 30rpx;
							flex: 1;
						}
					}

					.scan {
						width: 40rpx;
						height: 40rpx;
						border: 1rpx solid #2764FB;
						padding-left: 32rpx;
						flex-shrink: 0;
					}
				}
			}
		}
	}
</style>
