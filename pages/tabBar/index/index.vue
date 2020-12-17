<template>
	<view class="index">
		<!-- 顶部导航条 -->
		<header :style="`height:${customBarH}px;background-color:${theme_color.main_color};`">
			<view class="header-box" :style="`height:${customBarH}px;padding-top:${statusBarH}px;color:${theme_color.font_color};`">
				<view></view>
				<text>朝阳站设备智慧管控平台</text>
				<view>
					<view class="scanCode"></view>
				</view>
			</view>
		</header>
		<scroll-view class="main-scroll-view" scroll-y>
			<!-- banner -->
			<swiper class="banner-swiper" indicator-dots indicator-color="rgba(255,255,255, .3)" interval="2000" autoplay
			 indicator-active-color="rgba(39,100,251,.8)">
				<swiper-item class="banner-swiper-item" v-for="(item,index) in banners" :key="index">
					<view class="banner-img" :style="{'background-image': 'url('+item+')'}"></view>
				</swiper-item>
			</swiper>

			<!-- 菜单 -->
			<ul class="card-box menu-box" >
				<li v-for="(item,index) in menus" :key="index" @tap="toMenu(item.url)">
					<view class="icon-box" :style="{backgroundColor:item.bgColor}"></view>
					<view class="title">{{item.title}}</view>
				</li>
			</ul>

			<!-- 车站环境 -->
			<view class="card-box">
				<view class="main-title">车站环境</view>
				<scroll-view class="station-scroll-view" scroll-x>
					<ul class="station-box">
						<li v-for="(item,index) in stations" :key="index" :style="{backgroundColor:item.bgColor}">
							<view class="sub-title-box">
								<view class="icon-box"></view>
								<text class="sub-title">{{item.title}}</text>
								<text class="state">{{item.state}}</text>
							</view>
							<view class="content-box">
								<text class="content">{{item.value}}</text>
								<text class="unit">{{item.unit}}</text>
							</view>
						</li>
					</ul>
				</scroll-view>
			</view>

			<!-- 能耗和运维 -->
			<view class="card-box">
				<view class="main-title">能耗和运维</view>
				<ul class="other-box">
					<li v-for="(item,index) in others" :key="index">
						<view class="value">{{item.value}}</view>
						<view class="date-box">
							<text class="date">{{item.date}}</text>
							<text>{{item.unit}}</text>
						</view>
					</li>
				</ul>
			</view>

			<!-- 累计用能统计 -->
			<view class="card-box">
				<view class="main-title">累计用能统计</view>
				<view class="total-box">
					<!-- #ifdef APP-PLUS || H5  -->
					<view id="container"></view>
					<!-- #endif -->
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarH: this.statusBar, //状态高度
				customBarH: this.customBar, //自定义高度
				banners: ["../../../static/banner/bannner1.png", "../../../static/banner/bannner1.png"],
				//能耗和运维列表
				others: [{
						value: '1000',
						date: '今日电耗',
						unit: '(kwh)'
					},
					{
						value: '759',
						date: '今日水耗',
						unit: '(t)'
					},
					{
						value: '23',
						date: '今日报警',
						unit: ''
					},
					{
						value: '256',
						date: '今日工单',
						unit: ''
					}
				],
				//车站环境列表
				stations: [{
						icon: '',
						title: 'CO2',
						unit: 'kwh',
						bgColor: '#5195FB',
						value: '688',
						state: '良好'
					},
					{
						icon: '',
						title: 'PM2.5',
						unit: 'ug/m³',
						bgColor: '#2BD7B5',
						value: '32',
						state: '优'
					},
					{
						icon: '',
						title: '平均温度',
						unit: 'ug/m³',
						bgColor: '#56B6F3',
						value: '32',
						state: '良好'
					}
				],
				//菜单列表
				menus: [{
						title: '车站能耗',
						icon: '',
						bgColor: '#F6BC4D'
					},
					{
						title: '车站环境',
						icon: '',
						bgColor: '#2BD7B5'
					},
					{
						title: '机房能效',
						icon: '',
						bgColor: '#916EE5',
						url:'/pages/energyEfficiency/machineRoom/machineRoom'
					},
					{
						title: '车站安全',
						icon: '',
						bgColor: '#6384F2'
					},
					{
						title: '运行监控',
						icon: '',
						bgColor: '#5E99F1'
					},
					{
						title: '运维统计',
						icon: '',
						bgColor: '#56B6F3'
					},
					{
						title: '人员统计',
						icon: '',
						bgColor: '#F5A45C'
					},
					{
						title: '人员统计',
						icon: '',
						bgColor: '#2BD5D7'
					}
				]
			}
		},
		computed: {
			// style() {
			// 	return `height:${this.customBarH}rpx;`
			// },
			currentTheme() {
				return this.$store.getters["theme/currentTheme"]
			}
		},
		methods: {
			toMenu(url){
				console.log(url)
				if(url){
					console.log(url)
					uni.navigateTo({
						url
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		height: 100%;

		// 头部
		header {
			.header-box {
				display: flex;
				align-items: center;

				view {
					width: 10%;
					text-align: center;
					box-sizing: border-box;

					.scanCode {
						width: 32rpx;
						height: 32rpx;
						border: 1rpx solid #ffffff;
					}
				}

				text {
					flex: 1;
					text-align: center;
					font-size: 34rpx;
					color: #FFFFFF;
				}
			}
		}

		// 主体部分
		.main-scroll-view {
			height: calc(100% - 85rpx);
			box-sizing: border-box;

			.card-box {
				background-color: $bg-main;
				border-radius: 24rpx;
				margin-top: 24rpx;

				.main-title {
					padding-top: 24rpx;
					padding-left: 40rpx;
					font-size: 32rpx;
					color: #323336;
					font-weight: bold;
				}

				//累计用能统计
				.total-box {
					padding: 23rpx 32rpx 31rpx;
					height:320rpx;
				}

				//能耗和运维
				.other-box {
					display: flex;
					padding: 0 40rpx;

					li {
						width: 25%;
						text-align: center;
						word-wrap: break-word;
						word-break: normal;

						.value {
							font-family: $font-family-num;
							color: #444444;
							font-size: 46rpx;
							padding: 40rpx 0 28rpx;
						}

						.date-box {
							color: #999999;
							font-size: 22rpx;

							.date {
								font-size: 26rpx;
								font-weight: 500;
								padding-right: 5rpx;
							}
						}
					}
				}

				//车站环境
				.station-scroll-view {
					box-sizing: border-box;

					.station-box {
						display: flex;
						align-items: center;
						padding: 24rpx 0 28rpx 38rpx;

						li {
							width: 260rpx;
							border-radius: 16rpx;
							box-shadow: 0rpx 3rpx 8rpx 5rpx rgba(77, 77, 77, 0.2);
							margin-right: 24rpx;
							flex-shrink: 0;
							padding: 0 23rpx;
							box-sizing: border-box;
							color: #fff;

							.content-box {
								padding-bottom: 22rpx;

								.content {
									font-size: 34rpx;
									font-family: $font-family-num;
									padding-right: 8rpx;
								}

								.unit {
									font-size: 24rpx;
								}
							}

							.sub-title-box {
								padding: 24rpx 0 19rpx;
								display: flex;
								align-items: center;
								position: relative;

								.state {
									position: absolute;
									right: 0;
									top: 15rpx;
									font-style: oblique;
									font-size: 26rpx;
								}

								.icon-box {
									width: 28rpx;
									height: 28rpx;
									border-radius: 50%;
									background-color: #fff;
									margin-right: 7rpx;
								}

								.sub-title {
									font-size: 28rpx;
									font-weight: bold;
								}
							}
						}
					}
				}

				// 菜单
				&.menu-box {
					padding: 6rpx 43rpx 32rpx;
					border-radius: 0 0 24rpx 24rpx;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					margin-top: 0;

					li {
						box-sizing: border-box;
						margin-right: 80rpx;

						&:nth-child(4n) {
							margin-right: 0;
						}

						.icon-box {
							width: 106rpx;
							height: 106rpx;
							border-radius: 16rpx;
							margin: 40rpx auto 15rpx;
							box-shadow: 0rpx 3rpx 11rpx 7rpx rgba(77, 77, 77, 0.2);
						}

						.title {
							font-size: 26rpx;
							color: #666;
						}
					}
				}

			}
		}

		//广告
		.banner-swiper {
			width: 100%;
			height: 320rpx;

			.banner-img {
				height: 100%;
				background-size: cover;
			}
		}
	}
</style>
