<template>
	<view class="order-page" :style="`padding-top:${this.customBar}px;`">
		<header-bar :isBack="true">
			<text slot="title">维修工单</text>
			<text slot="right1" class="scan" @tap="sorting">排</text>
		</header-bar>

		<view class="main">
			<!-- 搜索框 -->
			<view class="uni-search">
				<view class="search-box">
					<view class="search">
						<text class="icon" @tap="test"></text>
						<input type="text" v-model="vagueSearch" placeholder="搜索设备名称、编号、单号">
					</view>
					<text class="scan" @tap="scanCode"></text>
				</view>
			</view>
			<!-- tabs -->
			<tabs :tabs="tabs" :currentIndex.sync="currentIndex" :height="97" :paddingTopBot="26" :paddingLeftRight="50"></tabs>

			<swiper class="swiper" :current="currentIndex">
				<swiper-item v-for="i of 4" :key="i" class="swiper-item" @touchmove.stop="() => true">
					<my-scroll-view ref="scrollView" @refresh="refresh" @getMore="getMore" :total="pageInfo.total" :pageSize="pageInfo.pageSize"
					 :pageNum="pageInfo.pageNum">
						<template v-show="orders">
							<ul class="order-item" @tap="toDetail(item)" v-for="(item,index) in orders" :key="index">
								<li class="code-box">
									<text class="order-code">工单号: {{item.gdCode}}</text>
									<text class="status" :style="`color:${statusColor[item.gdZht]}`">{{statusText[item.gdZht]}}</text>
								</li>
								<li class="info-box">
									<view>
										<text class="sub-title">设备名称</text>
										<text>{{item.dName}}</text>
									</view>
									<text>{{getTime(item.gdShij).d1}}</text>
								</li>
								<li class="info-box">
									<view>
										<text class="sub-title">故障类型</text>
										<text>{{item.faultname}}</text>
									</view>
								</li>
								<li class="info-box">
									<view>
										<text class="sub-title">故障等级</text>
										<text>{{nervousList.filter(nervous => nervous.vValue == item.gdTaskJj)[0].vName}}</text>
									</view>
									<view>
										<text></text>
										<text>{{item.installAddress}}</text>
									</view>
								</li>
							</ul>
							<view style="text-align: center;padding:30rpx 0;" v-if="(pageInfo.total - pageInfo.pageNum * pageInfo.pageSize) %  pageInfo.pageSize < pageInfo.pageSize && orders">暂无更多数据</view>
						</template>
						<view v-show="!orders" style="text-align: center;padding-top:30rpx;">暂无数据</view>
					</my-scroll-view>
				</swiper-item>
			</swiper>
		</view>

	</view>
</template>

<script>
	import tabs from "@/components/tabs/tabs.vue"
	import myScrollView from "@/components/my-scroll-view/my-scroll-view.vue"
	import {
		getTime
	} from "@/utils/date.js"
	import {
		ywGDGetInfoII,
		ywGetGDUrgencyII
	} from "@/common/api/service.js"
	export default {
		name: "service-order",
		components: {
			tabs,
			myScrollView
		},
		data() {
			return {
				tabs: ["全部", "待接单", "维修中", "已完成"],
				currentIndex: 0,
				value: 9,
				vagueSearch:'',//查询条件
				pageInfo: {
					pageNum: 1,
					total: 0,
					pageSize: 4
				},
				nervousList: null, //紧急程度
				gdZhts: ['', 30, 40, 60], //状态  
				b_UserRole: '', //角色
				orders: null, //工单列表
				statusText: {
					10: '待下发',
					20: '待分派',
					21: '已撤销',
					30: '待接单',
					31: '已召回',
					40: '执行中',
					41: '待确认',
					42: '等待外修', 
					43: '外修中',
					44: '等待备件',
					50: '待验收',
					51: '验收中',
					60: '关单',
				},
				statusColor: {
					30: '#F6AF31',
					40: '#FA5E5E',
					60: '#2764FB',
					3: '#898989'
				}
			}
		},
		onLoad(params) {
			this.currentIndex = params.currentIndex != 'undefined' ? Number(params.currentIndex) : 0;
		},
		watch: {
			currentIndex(newVal){
				this.getData('update')
			}
		},
		async created() {
			this.b_UserRole = JSON.parse(uni.getStorageSync("userInfo")).data.role;
			this.getywGetGDUrgencyII();
			this.getData('update')
		},
		methods: {
			getTime,
			test() {
				this.currentIndex = 0;
				this.getData('update')
			},
			//加载更多
			getMore() {
				this.pageInfo.pageNum += 1;
				this.getData('getMore')
			},
			//刷新
			refresh(){
				this.getData('update')
			},
			//排序
			sorting(){
				this.orders = this.orders ? this.orders.reverse() : this.orders
			},
			//详情页
			toDetail(info) {
				let gdZht = info.gdZht;
				let url1 = '/pages/service/order-detail/order-detail' //未接单详情
				let url2 = '/pages/service/order-service/order-service' //接单后详情
				uni.navigateTo({
					url:gdZht < 40 ? `${url1}?gdCode=${info.gdCode}&gdZht=${gdZht}` : `${url2}?gdCode=${info.gdCode}&gdZht=${gdZht}`
				})
			},
			//获取数据
			async getData(getType){
				if(getType == 'update'){
					this.pageInfo.pageNum = 1;
				}
				let params = {
					pageNum: this.pageInfo.pageNum,
					gdZht: this.gdZhts[this.currentIndex],
					pageSize: this.pageInfo.pageSize,
					b_UserRole: this.b_UserRole,
					vagueSearch:this.vagueSearch
				}
				let result = await ywGDGetInfoII(params);
				if (result) {
					let {
						list,
						total
					} = result;
					if(getType == 'update'){
						this.orders = list;
						this.pageInfo.total = total;
					}else{
						this.orders = this.orders.concat(list)
					}
				} else {
					this.orders = result;
					this.pageInfo.total = 0;
				}
				if(getType == 'update'){
					this.$refs.scrollView[this.currentIndex].triggered = false
					this.$refs.scrollView[this.currentIndex]._freshing = false
				}
			},
			//扫码
			scanCode() {
				/* #ifdef APP-PLUS */
				let _this = this;
				uni.scanCode({
					success(res) {
						let arr = res.result.split('|');
						_this.vagueSearch = arr[1];
						_this.currentIndex = 0;
						_this.getData('update')
					}
				});
				/* #endif */
			},
			//获取紧急程度列表
			async getywGetGDUrgencyII() {
				this.nervousList = await ywGetGDUrgencyII();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-page {
		height: 100%;
		box-sizing: border-box;

		.main {
			height: 100%;
			box-sizing: border-box;

			.uni-search {
				padding: 24rpx 38rpx 0;
				background-color: $bg-main;
			}

			.swiper {
				height: calc(100% - 195rpx);

				.order-item {
					box-shadow: 0rpx 3rpx 11rpx 7rpx rgba(77, 77, 77, 0.2);
					background-color: $bg-main;
					border-radius: 24rpx;
					padding: 24rpx 30rpx 31rpx;
					box-sizing: border-box;
					margin: 24rpx 38rpx 0;

					&:last-child {
						margin-bottom: 24rpx;
					}

					li {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 26rpx;
						font-weight: 500;
						margin-bottom: 30rpx;

						&.code-box {
							font-weight: 700;

							.order-code {
								font-family: $font-family-title;
								color: $font-color-title;
								font-size: 32rpx;
							}
						}

						&.info-box {
							color: #333;

							.sub-title {
								color: #666666;
								padding-right: 23rpx;
							}
						}

						&:last-child {
							margin-bottom: 0;
						}
					}
				}
			}
		}
	}
</style>
