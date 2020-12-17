<template>
	<view class="server-page" :style="`padding-top:${this.customBar}px;`">
		<header-bar :isBack="true">
			<text slot="title">服务器设置</text>
			<text slot="right1" @tap="submit">确认</text>
		</header-bar>

		<view class="main">
			<ul>
				<li>
					<view class="title-box">
						<text>站点名称</text>
					</view>
					<view class="input-box">
						<input type="text" v-model="activeInfo.servicename" placeholder="输入站点名称">
					</view>
				</li>
				<li>
					<view class="title-box">
						<text>选择或输入服务器地址</text>
					</view>
					<view class="input-box">
						<input type="text" v-model="activeInfo.beewebapi" placeholder="输入服务器地址">
						<text @tap="scan">扫</text>
					</view>
				</li>
			</ul>

			<ul>
				<li>
					<view class="title-box">
						<text>历史记录</text>
						<text class="other" @tap.stop="deleteHistory" v-if="historys && historys.length>0">清空</text>
					</view>
					<template v-if="historys">
						<view class="input-box" v-for="(item,index) in historys" :key="index">
							<text>{{item.servicename}}</text>
							<view class="selectBox" :class="{'active': activeIndex === index}" @tap.stop="select(index,item)"></view>
						</view>
					</template>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				historys: null, //历史站点
				activeIndex: '',
				activeInfo: {
					servicename: '', //站点名字
					beewebapi: '',
					districtname: '未分组',
					logo: 'http://47.95.9.50:8115/hqn000000/cq/hq.png'
				}
			}
		},
		onLoad() {
			this.getHistory()
		},
		methods: {
			//获取历史站点
			getHistory() {
				let historys = uni.getStorageSync('serverHistory');
				this.historys = historys ? JSON.parse(historys) : [];
			},
			//清空历史记录
			deleteHistory() {
				uni.showModal({
					content: "确定清空历史记录?",
					confirmText: "确定",
					cancelText: "取消",
					success: (res) => {
						if(res.confirm){//点击了确认
							uni.removeStorageSync('serverHistory');
							this.getHistory()
						}
					}
				})
			},
			//选择历史服务器
			select(index, info) {
				this.activeIndex = this.activeIndex === index ? '' : index;
				this.activeInfo = info;
			},
			//扫一扫
			scan() {
				uni.scanCode({
					success: (res) => {
						this.activeInfo.beewebapi = res.result;
					},
					fail: (err) => {
						// 需要注意的是小程序扫码不需要申请相机权限
					}
				});
			},
			submit() {
				let info = JSON.parse(JSON.stringify(this.activeInfo));
				if (info.servicename && info.beewebapi) {
					if (this.activeIndex!=='') { //选择了历史站点 直接返回
						this.setServer(info)
					} else {
						let reg = RegExp(/http:\/\//);
						if (!reg.test(info.beewebapi)) { //拼接地址
							info.beewebapi = `http://${info.beewebapi}/BEEWebAPI/api/`;
						}
						if (this.historys.length > 0) { //历史记录有数据，需判断是否有相同名站点
							let names = this.historys.map(item => item.servicename);
							//同名站点位置
							let index = names.indexOf(info.servicename);
							if (index > -1) { //包含同名站点
								uni.showModal({
									content: "已有同名站点，是否替换同名站点?",
									confirmText: "确定",
									cancelText: "取消",
									success: () => {
										this.historys[index] = info;
										this.setServer(info);
									}
								})
							} else {
								//向以后历史记录里添加站点
								this.historys.push(info);
								this.setServer(info)
							}
						} else {
							//向以后历史记录里添加站点
							this.historys.push(info);
							this.setServer(info)
						}
					}

				} else {
					uni.showToast({
						title: '站点名称与服务器地址不能为空',
						icon: 'none'
					})
				}
			},
			//设置站点并返回
			setServer(info) {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];

				uni.setStorageSync("serverHistory", JSON.stringify(this.historys))
				prevPage.$vm.formData.servicename = info.servicename;
				prevPage.$vm.formData.beewebapi = info.beewebapi;
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.server-page {
		height: 100%;
		box-sizing: border-box;

		.main {
			ul {
				background-color: #fff;
				padding: 24rpx 38rpx 32rpx;
				border-radius: 0 0 24rpx 24rpx;

				&:nth-of-type(n+2) {
					border-radius: 24rpx;
					margin-top: 40rpx;
				}

				li {
					.title-box {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 32rpx;
						font-weight: 700;
						margin-bottom: 24rpx;
						font-family: $font-family-title;

						.other {
							font-size: 30rpx;
							color: #2764FB;
							font-weight: 500;
							font-family: $font-family-text;
						}
					}

					.input-box {
						height: 72rpx;
						display: flex;
						align-items: center;
						background: #fafbff;
						border: 1rpx solid #cfd2dd;
						border-radius: 16rpx;
						box-shadow: 0rpx 3rpx 8rpx 5rpx rgba(77, 77, 77, 0.2);
						padding: 0 16rpx 0 25rpx;
						justify-content: space-between;
						margin-bottom: 32rpx;

						input {
							flex: 1;
						}

						input,
						text {
							color: #999999;
							font-size: 26rpx;
						}
					}

					.selectBox {
						width: 32rpx;
						height: 32rpx;
						border-radius: 50%;
						border: 1rpx solid #DCDCDC;

						&.active {
							background-color: #2764FB;
							border: none;
						}
					}
				}
			}
		}
	}
</style>
