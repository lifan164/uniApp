<template>
	<view class="site-page" :style="`padding-top:${this.customBar}px;`">
		<header-bar :isBack="true">
			<text slot="title">选择站点</text>
		</header-bar>
		<view class="main">
			<view class="uni-search-box">
				<view class="text-box">
					<picker @change="bindPickerChange" :value="siteClass.current" :range="siteClass.class" range-key="name">
						<view class="uni-input">{{siteClass.class[siteClass.current]}}</view>
					</picker>
					<text class="icon"></text>

				</view>
				<view class="search">
					<text class="icon"></text>
					<input type="text" v-model="siteName" placeholder="请输入站点名称">
				</view>
			</view>
			<scroll-view :style="`height:calc(100% - 120rpx);`" class="scroll-view" scroll-y="true">
				<ul class="site-ul" v-if="sites && sites.length>0">
					<li class="site-li" v-for="(item,index) in sites" :key="index" @tap.stop="selectSite(item)">
						<view class="site-img" :style="`background-image:url(${item.logo})`"></view>
						<view class="site-name">{{item.servicename}}</view>
					</li>
				</ul>
				<view v-else style="text-align: center;">暂无数据</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		UtilGetServices
	} from "@/common/api/user.js"
	export default {
		name: 'site-page',
		data() {
			return {
				//站点数据
				sitesAll: null,
				sites:null,
				//站点分类
				siteClass: {
					current: 0,
					class:['全部']
				},
				siteName: ''
			}
		},
		watch: {
			siteName(newVal) {
				newVal = newVal.trim();
				if(newVal){
					let reg = new RegExp(newVal)
					this.sites = this.sitesAll.filter(item => item.servicename.indexOf(newVal)>-1)
				}else{
					this.siteClass.current = 0;
					this.sites = this.sitesAll;
				}
			}
		},
		created() {
			this.getSite();
		},
		methods: {
			bindPickerChange(e) {
				this.siteName = ''
				let index = e.detail.value
				this.siteClass.current = index
				if(index == 0){//查询全部
					this.sites = this.sitesAll;
				}else{
					let selected = this.siteClass.class[index];
					this.sites = this.sitesAll.filter(item => item.districtname == selected)
				}
			},
			selectSite(info) {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.$vm.formData.servicename = info.servicename;
				prevPage.$vm.formData.beewebapi = info.beewebapi;
				uni.navigateBack()
			},
			//获取站点
			async getSite() {
				let {
					list
				} = await UtilGetServices();
				this.sitesAll = list //全部数据
				let historys = uni.getStorageSync('serverHistory');
				if(historys){
					this.sitesAll = this.sitesAll.concat(JSON.parse(historys));
				}
				//提取分类 并去重
				let classes = new Set(this.sitesAll.map(item => item.districtname));
				this.siteClass.class = 	this.siteClass.class.concat([...classes]) //分类
				this.sites = this.sitesAll //渲染数据
			}
		}
	}
</script>

<style lang="scss" scoped>
	.site-page {
		height: 100%;
		box-sizing: border-box;

		.main {
			height: 100%;
			box-sizing: border-box;
			padding-top:1rpx;

			.uni-search-box {
				background: #fafbff;
				border: 1rpx solid #cfd2dd;
				border-radius: 16rpx;
				height: 72rpx;
				box-shadow: 0rpx 2rpx 10rpx 4rpx rgba(0, 0, 0, 0.18);
				display: flex;
				align-items: center;
				box-sizing: border-box;
				margin-bottom: 12rpx;
				margin: 24rpx 38rpx;;

				.text-box {
					border-right: 1rpx solid #cfd2dd;
					box-sizing: border-box;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0 25rpx;

					.uni-input {
						color: #555555;
						font-size: 30rpx;
						margin-right: 11rpx;
					}

					.icon {
						border: 1rpx solid #999999;
						width: 24rpx;
						height: 14rpx;
						display: inline-block;
					}
				}

				.search {
					flex-grow: 1;
					height: 100%;
					display: flex;
					align-items: center;

					.icon {
						width: 31rpx;
						height: 31rpx;
						border: 1rpx solid #666666;
						margin: 0 7rpx 0 20rpx;
					}

					input {
						font-size: 30rpx;
						flex-grow: 1;
					}
				}
			}
			.scroll-view {
				box-sizing: border-box;
				.site-ul {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					padding:  24rpx 38rpx;
					box-sizing: border-box;

					&::after {
						content: '';
						width: 30%;
						border: 1px solid transparent;
					}

					.site-li {
						width:30%;
						.site-img {
							width: 208rpx;
							height: 160rpx;
							border-radius: 16rpx;
							box-shadow: 0px 3rpx 11rpx 7rpx rgba(77, 77, 77, 0.2);
							background-size: cover;
						}

						.site-name {
							text-align: center;
							font-size: 24rpx;
							color: #666666;
							margin: 20rpx 0 32rpx;
							overflow-wrap: break-word;
							word-break: break-word;
							word-wrap: break-word;
						}
					}
				}
			}
		}

		.uni-list-cell-db {
			width: 100%;
			height: 50%;
			background: #fff;
			position: fixed;
			bottom: 0
		}
	}
</style>
