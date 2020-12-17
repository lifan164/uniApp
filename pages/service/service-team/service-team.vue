<template>
	<view class="service-team" :style="`padding-top:${this.customBar}px;`">
		<header-bar :isBack="true">
			<text slot="title">班组</text>
			<text slot="right1" @tap="submit">{{type=='team' ? '下发' : '分派'}}</text>
		</header-bar>

		<ul class="uni-card-box">
			<li class="uni-card-ul search-box" style="padding-bottom: 28rpx;">
				<view class="search">
					<text class="icon" @tap="getData"></text>
					<input type="text" v-model="searchName" :placeholder="type=='team' ? '班组名' : '搜索姓名'">
				</view>
			</li>
			<li class="border-box">
				<view class="border-li header">
					<!-- 班组长 -->
					<template v-if="type == 'team'">
						<text class="item1">选择</text>
						<text class="item2">班组名称</text>
						<text class="item2">班组长</text>
						<text class="item3">电话</text>
					</template>
					<!-- 维修人员 -->
					<template v-else>
						<text class="item1">选择</text>
						<text class="item2">姓名</text>
						<text class="item2">维修中</text>
						<text class="item3">电话</text>
					</template>
				</view>

				<scroll-view scroll-y class="scroll-view">

					<ul class="border-ul" v-if="dataList.length > 0">
						<li class="border-li" v-for="(item,index) in dataList" :key="index">
							<!-- 班组长列表 -->
							<template v-if="type == 'team'">
								<view class="item1" @tap="selectHandle(item)">
									<view class="select" :class="{isSelect:isSelect(item.id)}"></view>
								</view>
								<text class="item2">{{item.departName}}</text>
								<text class="item2">{{item.userName}}</text>
								<text class="item3">{{item.phone}}</text>
							</template>

							<!-- 维修人员列表 -->
							<template v-else>
								<view class="item1" @tap="selectHandle(item)">
									<view class="select" :class="{isSelect:isSelect(item.id)}"></view>
								</view>
								<text class="item2">{{item.userName}}</text>
								<text class="item2">{{item.undNum}}</text>
								<text class="item3">{{item.phone}}</text>
							</template>
						</li>
					</ul>
					<view v-else style="text-align: center;padding:30rpx;">暂无数据</view>
				</scroll-view>
			</li>
		</ul>
	</view>
</template>

<script>
	import {
		ywGetWXLeaders,
		ywGDAllotToBZII,
		ywGetWXRens,
		ywGDAllotToWxRII
	} from "@/common/api/service.js"
	export default {
		data() {
			return {
				params: {
					userName: '',
					gdCode: ''
				},
				type: '',
				searchName: '',
				selects: [], //选择的班组
				dataList: [], //班组列表
			}
		},
		onLoad(e) {
			this.params.userName = e.userName
			this.params.gdCode = e.gdCode
			this.type = e.type
		},
		created() {
			this.getData();
		},
		methods: {
			//选择
			selectHandle(info) {
				let selects = this.selects;
				if (selects.length == 0) {
					selects.push(info)
				} else {
					let selectIndex = '';
					let isHas = selects.some((item, index) => {
						if (item.id == info.id) {
							selectIndex = index
							return true
						}
					})
					if (isHas) { // 已有数据 删除
						selects.splice(selectIndex, 1)
					} else { // 没有数据 添加
						selects.push(info)
					}
				}
			},
			//判断是否选择
			isSelect(id) {
				return this.selects.some(item => {
					if (item.id == id) {
						return true
					}
				})
			},
			//下发提交
			async submit() {
				let selects = this.selects;
				if (selects.length == 0) { //没有选择班组
					let title = this.type == 'team' ? '请选择下发班组' : '请选择维修人员'
					uni.showToast({
						title,
						duration: 1500,
						icon: 'none'
					});
				} else {
					let params = this.params;
					let selects = this.selects;
					if (this.type == 'team') { //下发到班组长
						let pgUserNames = ''
						let pgUserIds = ''
						let wxLeaders = []
						selects.forEach((item, index) => {
							pgUserNames += index != selects.length - 1 ? `${item.userName},` : item.userName
							pgUserIds += index != selects.length - 1 ? `${item.userNum},` : item.userNum
							wxLeaders.push({
								wxRen: item.userNum,
								wxRName: item.userName,
								wxRDh: item.phone,
								gdCode: params.gdCode
							})
						})
						params.pgUserNames = pgUserNames
						params.pgUserIds = pgUserIds
						params.wxLeaders = wxLeaders
						let result = await ywGDAllotToBZII(params);
						uni.showToast({
							title: '下发成功',
							duration: 1500,
							icon: 'none'
						});
						uni.navigateBack();
					} else { //分派维修人员
						let wxUserIds = ''
						let wxUserNames = ''
						let wxKeshiNum = ''
						let wxkeshi = ''
						let wxRens = []
						selects.forEach((item, index) => {
							wxUserIds += index != selects.length - 1 ? `${item.userNum},` : item.userNum
							wxUserNames += index != selects.length - 1 ? `${item.userName},` : item.userName
							wxKeshiNum += index != selects.length - 1 ? `${item.departNum},` : item.departNum
							wxkeshi += index != selects.length - 1 ? `${item.departName},` : item.departName
							wxRens.push({
								wxRen: item.userNum,
								wxRName: item.userName,
								wxRDh: item.phone,
								gdCode:params.gdCode
							})
						})
						params.wxUserIds = wxUserIds
						params.wxUserNames = wxUserNames
						params.wxKeshiNum = wxKeshiNum
						params.wxkeshi = wxkeshi
						params.wxRens = wxRens
						let result = await ywGDAllotToWxRII(params);
						uni.showToast({
							title: '分派成功',
							duration: 1500,
							icon: 'none'
						});
						uni.navigateBack();
					}
				}
			},
			//获取数据列表
			async getData() {
				if (this.type == 'team') { //班组列表
					this.dataList = await ywGetWXLeaders({
						departName: this.searchName
					});
				} else { //维修人员
					this.dataList = await ywGetWXRens({
						userName2: this.searchName
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.service-team {
		height: 100%;
		box-sizing: border-box;

		.uni-card-box {
			.border-box {
				height: calc(100% - 168rpx);
				box-sizing: border-box;
				margin-bottom: 0;
				padding: 0;

				.border-li {
					display: flex;
					text-align: center;
					font-weight: 400;

					&.header {
						background-color: #E4EBFB;
						padding: 26rpx 38rpx;
						box-sizing: border-box;
						font-size: 30rpx;
						border-radius: 24rpx 24rpx 0 0;
						font-weight: 500;
					}

					.item1 {
						width: 15%;
					}

					.item2 {
						width: 25%;
					}

					.item3 {
						width: 35%;
					}
				}

				.scroll-view {
					height: calc(100% - 90rpx);

					.border-ul {
						background-color: $bg-main;
						padding: 0 38rpx;

						.border-li {
							padding: 35rpx 0;
							border-bottom: 1rpx solid #DCDCDC;

							&:last-child {
								border-bottom: 0;
								font-size: 26rpx;
							}

							.select {
								width: 32rpx;
								height: 32rpx;
								display: inline-block;
								box-sizing: border-box;
								border-radius: 50%;
								border: 1rpx solid #DCDCDC;

								&.isSelect {
									border: 0;
									background-color: #2764FB;
								}
							}

							.item1,
							.item2,
							.item3 {
								font-family: $font-family-num;
							}
						}
					}
				}
			}
		}
	}
</style>
