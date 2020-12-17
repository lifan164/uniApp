<template>
	<view class="workbench-page" :style="`padding-top:${this.customBar}px;`">
		<my-header title="工作台"></my-header>

		<scroll-view scroll-y="true" style="height:100%;">
			<ul class="main-ul">
				<!-- 故障维修 和 计划管理 -->
				<block v-for="(item,index) in servicesAndPlan" :key="index">
					<li class="main-li">
						<view class="title">{{item.title}}</view>
						<ul class="card-ul">
							<block v-for="(subItem,subIndex) in item.menu" :key="subIndex">
								<!-- v-if="subItem.roles.includes(role)" -->
								<li class="card-li" @tap="toOrderOrPlan(item.type,subItem)" >
									<view class="handle-number">{{subItem.number}}</view>
									<view class="state-text">{{subItem.title}}</view>
								</li>
							</block>
						</ul>
					</li>
				</block>

				<!-- 能耗监控 -->
				<li class="main-li">
					<view class="title">能耗监控</view>
					<view class="sross-li" v-for="(item,index) in crosss" :key="index">
						<view class="left">{{item.title}}</view>
						<view class="center">
							<text class="icon"></text>
							<text class="number">{{item.centerNum}}</text>
							<text class="unit">{{item.centerUnit}}</text>
						</view>
						<view class="right">
							<text class="icon"></text>
							<text class="number">{{item.rightNum}}</text>
							<text class="unit">{{item.rightUnit}}</text>
						</view>
					</view>
				</li>
				<!-- 监控报警 -->
				<li class="main-li">
					<view class="title">监控报警</view>
					<ul class="monitor-ul" :class="(monitors.length>3 && monitors.length%6==0) ? 'even-ul' : 'odd-ul'">
						<li class="monitor-li" v-for="(item,index) in monitors" :key="index" :style="{width:(monitors.length==3 ? '30%' : '25%')}">
							<view class="number" :style="`color:${item.color}`">{{item.number}}</view>
							<view>{{item.title}}</view>
						</li>
					</ul>
				</li>

				<!-- 数据统计 -->
				<li class="main-li">
					<view class="title">数据统计</view>
					<ul class="data-ul">
						<li v-for="(item,index) in  datas" :key="index">
							<text></text>
							<view>{{item.title}}</view>
						</li>
					</ul>
				</li>
			</ul>
		</scroll-view>
	</view>
</template>

<script>
	import myHeader from "../module/header.vue"
	export default {
		name: 'workbench-page',
		components: {
			myHeader
		},
		data() {
			return {
				//故障维修 和 计划管理
				servicesAndPlan: [{
						title: "故障维修",
						type: "order",
						menu: [{
								title: '待接单',
								number: 1,
								isOrder: true,
								currentIndex: 1,
								roles: ["test1", "test2"]
							},
							{
								title: '维修中',
								number: 645,
								isOrder: true,
								currentIndex: 2,
								roles: ["test1"]
							},
							{
								title: '全部工单',
								number: 878,
								isOrder: true,
								currentIndex: 0,
								roles: ["test1", "test2"]
							},
							{
								title: '报修',
								number: 788,
								url: '/pages/service/repair-submit/repair-submit',
								roles: ["test1", "test2"]
							},
							{
								title: '快速保修',
								number: 687,
								url: '',
								roles: ["test1"]
							},
							{
								title: '报修单',
								number: 65768,
								url: '',
								roles: ["test1", "test2"]
							}
						]
					},
					{
						title: "计划管理",
						type: "plan",
						menu: [{
								title: '保养计划',
								number: 0,
								url: '/pages/upkeep/upkeep-plan/upkeep-plan',
								roles: ["test1", "test2"]
							},
							{
								title: '巡检计划',
								number: 45,
								url: '',
								roles: ["test1", "test2"]
							},
							{
								title: '保养工单',
								number: 645,
								url: '',
								roles: ["test1", "test2"]
							},
							{
								title: '巡检工单',
								number: 878,
								url: '',
								roles: ["test1", "test2"]
							}
						]
					}
				],
				//能耗监控
				crosss: [{
						title: '监测总面积',
						centerIcon: '',
						centerNum: 136873.91,
						centerUnit: "㎡",
						rightIcon: '',
						rightNum: 546,
						rightUnit: ''
					},
					{
						title: '日总能耗',
						centerIcon: '',
						centerNum: 13239.6,
						centerUnit: "kwh",
						rightIcon: '',
						rightNum: 45,
						rightUnit: 't'
					},
					{
						title: '月总能耗',
						centerIcon: '',
						centerNum: 12434,
						centerUnit: "m²",
						rightIcon: '',
						rightNum: 655,
						rightUnit: 't'
					},
					{
						title: '年总能耗',
						centerIcon: '',
						centerNum: 12434,
						centerUnit: "m²",
						rightIcon: '',
						rightNum: 565,
						rightUnit: 't'
					}
				],
				//监控报警
				monitors: [{
						number: 0,
						title: '新增报警',
						color: '#F7BA4F'
					},
					{
						number: 0,
						title: '未处理报警',
						color: '#FA5E5E'
					},
					{
						number: 0,
						title: '已处理报警',
						color: '#898989'
					},
					{
						number: 0,
						title: '报警总数',
						color: '#444444'
					},
					{
						number: 0,
						title: '特急报警',
						color: '#FD5353'
					},
					{
						number: 0,
						title: '紧急报警',
						color: '#FD8049'
					},
					{
						number: 0,
						title: '普通报警',
						color: '#F7B747'
					}
				],
				//数据统计
				datas: [{
						icon: '',
						title: '运维统计'
					},
					{
						icon: '',
						title: '能耗统计'
					},
					{
						icon: '',
						title: '监控统计'
					},
					{
						icon: '',
						title: '人员统计'
					}
				]
			}
		},
		methods: {
			//故障维修 或 计划管理 页面跳转
			toOrderOrPlan(type, info) {
				switch (type) {
					case 'order': // 点击故障维修 卡片
						if (info.isOrder) { //跳转到维修工单
							uni.navigateTo({
								url: `/pages/service/order/order?currentIndex=${info.currentIndex}`
							});
						} else {
							uni.navigateTo({
								url: info.url
							})
						}
						break;
					case 'plan': //  点击计划管理 卡片
						uni.navigateTo({
							url: info.url
						})
						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.workbench-page {
		height: 100%;
		box-sizing: border-box;

		.main-ul {
			.main-li {
				background-color: #FFFFFF;
				padding: 24rpx 38rpx 32rpx;
				border-radius: 24rpx;
				margin-bottom: 32rpx;

				&:first-child {
					border-radius: 0 0 24rpx 24rpx;
				}

				.title {
					font-family: $font-family-title;
					color: #323336;
					font-weight: 700;
					font-size: 32rpx;
				}

				.card-ul {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					&:after {
						content: '';
						width: 30%;
						border: 1px solid transparent;
					}

					.card-li {
						padding: 28rpx;
						box-shadow: 0rpx 3rpx 11rpx 7rpx rgba(77, 77, 77, 0.2);
						border-radius: 16rpx;
						margin-top: 24rpx;
						width: 208rpx;
						box-sizing: border-box;

						.handle-number {
							display: inline-block;
							color: #444444;
							font-size: 46rpx;
							text-align: left;
							font-family: $font-family-num;

							&::after {
								content: '';
								display: block;
								width: 32rpx;
								height: 6rpx;
								background-color: #2764FB;
								border-radius: 6rpx;
							}
						}

						.state-text {
							color: #999999;
							font-size: 26rpx;
							margin-top: 17rpx;
						}
					}
				}

				.sross-li {
					border: 1rpx solid #cfd2dd;
					margin-top: 24rpx;
					padding: 23rpx 25rpx;
					border-radius: 16rpx;
					display: flex;
					flex: 0;
					align-items: center;
					color: #555555;

					>view {
						flex: 1;
					}

					.left {
						font-size: 28rpx;
						font-weight: 500;
					}

					.center {
						display: flex;
						align-items: center;

						.icon {
							width: 15rpx;
							height: 24rpx;
							border: 1rpx solid #2764fb;
							display: inline-block;
						}

						.number {
							font-size: 34rpx;
							padding: 0 16rpx 0 5rpx;
							font-family: $font-family-num;
						}

						.unit {
							font-size: 26rpx;
						}
					}

					.right {
						display: flex;
						justify-content: flex-end;
						align-items: center;

						.icon {
							width: 19rpx;
							height: 24rpx;
							border: 1rpx solid #2764fb;
						}

						.number {
							font-size: 34rpx;
							padding: 0 16rpx 0 5rpx;
							font-family: $font-family-num;
						}

						.unit {
							font-size: 26rpx;
						}
					}
				}

				.monitor-ul {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					&.even-ul::after {
						content: '';
						width: 49%;
						border: 1px solid transparent;
					}

					&.odd-ul::after {
						content: '';
						width: 24%;
						border: 1px solid transparent;
					}

					.monitor-li {
						text-align: center;
						font-size: 26rpx;
						color: #999999;

						.number {
							font-size: 46rpx;
							margin: 40rpx 0 28rpx;
							font-family: $font-family-num;
						}
					}
				}

				.data-ul {
					display: flex;
					justify-content: space-between;
					align-items: center;

					li {
						width: 25%;
						text-align: center;

						text {
							display: inline-block;
							width: 64rpx;
							height: 64rpx;
							border: 1rpx solid #2764FB;
							margin: 32rpx 0 15rpx;
						}

						view {
							color: #999999;
							font-size: 26rpx;
						}
					}
				}
			}
		}
	}
</style>
