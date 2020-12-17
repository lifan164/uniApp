<!-- 工单详情 -->
<template>
	<view class="order-detail" :style="`padding-top:${this.customBar}px;`">
		<header-bar :isBack="true">
			<text slot="title">工单详情</text>
		</header-bar>
		<!--  -->
		<view class="main" :style="{paddingBottom:(isShow ? '110rpx' : '0')}">
			<scroll-view class="scroll-view" scroll-y>
				<basic-info :detailInfo='detailInfo'></basic-info>
			</scroll-view>

			<!-- 按钮 -->
			<view class="btn-box" v-if="isShow">
				<view class="btn isSubmit" @tap="handle">{{btnText}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import basicInfo from "../components/order-basic-info.vue"
	import {
		ywGDGetDetailsII,
		ywGDCallBZII,
		ywGDCallWxRII,
		ywGDTaskOrderII
	} from "@/common/api/service.js"
	export default {
		components: {
			basicInfo
		},
		data() {
			return {
				gdCode: '', //工单号
				detailInfo: {}, //工单详情
				userInfo: JSON.parse(uni.getStorageSync("userInfo")).data,
				btnText: '',
				// isShow: false //按钮是否显示
			}
		},
		onLoad(e) {
			this.gdCode = e.gdCode;
		},
		onShow() {
			this.getDetailInfo();
		},
		computed: {
			isShow() {
				let gdZht = this.detailInfo.gdZht
				let isShow = false
				if (gdZht) {
					let role = this.userInfo.role;
					if ((gdZht == 10 || gdZht == 21) && role == 'dd01') { //调度岗下发
						this.btnText = '下发'
						isShow = true;
					} else if (gdZht == 20 && role == 'dd01') { //调度岗撤销
						this.btnText = '撤销'
						isShow = true;
					} else if ((gdZht == 20 || gdZht == 31) && role == 'WXBZ01') { //班组长 分派
						this.btnText = '分派'
						isShow = true;
					}else if(gdZht == 30 && role == 'WXBZ01'){ //班组长  召回
						this.btnText = '召回'
						isShow = true;
					}else if(gdZht == 30 && role == 'WXBZ11'){//维修人  接单
						this.btnText = '接单'
						isShow = true;
					}
					// else if(gdZht == 40 && role == 'WXBZ11'){//维修人 执行
					// 	this.btnText = '开始维修'
					// 	isShow = true;
					// }
				}
				return isShow
			}
		},
		methods: {
			async getDetailInfo() {
				this.detailInfo = await ywGDGetDetailsII({
					gdCode: this.gdCode
				});
			},
			//点击按钮
			async handle() {
				let gdZht = this.detailInfo.gdZht //工单状态
				let gdCode = this.detailInfo.gdCode; //工单编号
				let role = this.userInfo.role; //角色
				let userName = this.userInfo.userName;
				let params = {
					userName,
					gdCode
				}
				console.log('状态', gdZht)
				if (gdZht == 10 || gdZht == 21) { //调度岗 下发   
					uni.navigateTo({
						url: `/pages/service/service-team/service-team?userName=${userName}&gdCode=${gdCode}&type=team`
					})
				}else if(gdZht == 20 && role == 'dd01'){//调度岗 撤销
					this.modalHandle('是否撤销该工单？', 1, params)
				}else if((gdZht == 20 || gdZht == 31) && role == 'WXBZ01'){//班组长 分派
					uni.navigateTo({
						url: `/pages/service/service-team/service-team?userName=${userName}&gdCode=${gdCode}&type=personnel`
					})
				}else if(gdZht == 30 && role == 'WXBZ01'){//班组长 召回
					this.modalHandle('是否召回该工单？', 2, params)
				}else if(gdZht == 30 && role == 'WXBZ11'){//维修执行人
					this.modalHandle('是否接单工单？', 3, params)
				}else if(gdZht == 40 && role == 'WXBZ11'){// 维修人员开始执行工单
					uni.navigateTo({
						url: `/pages/service/order-service/order-service?gdCode=${gdCode}`
					})
				}
			},

			modalHandle(title, type, params) {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: title,
					async success(res) {
						if (res.confirm) {
							switch (type) {
								case 1:
									let result1 = await ywGDCallBZII(params);
									uni.showToast({
										title: '撤销成功',
										duration: 1500,
										icon: 'none'
									});
									_this.getDetailInfo();
									break;
								case 2:
									let result2 = await ywGDCallWxRII(params);
									uni.showToast({
										title: '召回成功',
										duration: 1500,
										icon: 'none'
									});
									_this.getDetailInfo();
									break;
								case 3:
									let result3 = await ywGDTaskOrderII(params);
									uni.showToast({
										title: '接单成功',
										duration: 1500,
										icon: 'none'
									});
									_this.getDetailInfo();
									break;
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-detail {
		height: 100%;
		box-sizing: border-box;

		.main {
			height: 100%;
			box-sizing: border-box;

			.scroll-view {
				box-sizing: border-box;
				height: 100%;

			}
		}
	}
</style>
