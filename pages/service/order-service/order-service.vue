<!-- 维修单详情 -->
<template>
	<view class="order-service" :style="`padding-top:${this.customBar}px;`">
		<header-bar :isBack="true">
			<text slot="title">维修单详情</text>
			<text slot="right2" v-if="currentIndex == 3" @tap="addSpareParts">添加</text>
		</header-bar>
		<tabs :tabs="tabs" :currentIndex.sync="currentIndex" :height="97"></tabs>

		<swiper class="swiper" :class="btnShow ? 'haveBtn' : 'noBtn'" current-item-id="1" :current="currentIndex" @change="(e) => {currentIndex = e.detail.current}">
			<swiper-item v-for="i of tabs.length" :key="i" @touchmove.stop="() => true">
				<scroll-view style="height: 100%;" scroll-y>
					<template v-if="i==1">
						<!-- 设备故障 -->
						<order-basic-info :detailInfo="detailInfo" style="margin-top:32rpx;"></order-basic-info>
					</template>
					<template v-else-if="i==2">
						<!-- 处理信息 -->
						<manage-page :info.sync="detailInfo" :imgList.sync="imgList" :btnShow="btnShow"></manage-page>
					</template>
					<template v-else-if="i==3">
						<!-- 维修进度 -->
						<steps :steps="detailInfo.wxLog"></steps>
					</template>
					<template v-else>
						<!-- 更换备件 -->
						<uni-swipe-action>
							<uni-swipe-action-item class="action-item" v-for="(item,index) in detailInfo.wxCls" :key="index" :right-options="options2" :auto-close="false" @click="bindClick($event,index)">
								<ul class="action-ul">
									<li class="action-li">
										<text class="sub-title">备件名称</text>
										<view class="center">{{item.itemName}}</view>
									</li>
									<li class="action-li">
										<text class="sub-title">备件编号</text>
										<view class="center">{{item.itemNum}}</view>
									</li>
									<li class="action-li">
										<text class="sub-title">规格型号</text>
										<view class="center">{{item.size}}</view>
									</li>
									<li class="action-li">
										<text class="sub-title">使用数量</text>
										<view class="center">
											<text class="subtract" @tap.stop="subtractNum(index)">-</text>
											<text class="number">{{item.clShul}}</text>
											<text class="add" @tap.stop="addNum(index)">+</text>
										</view>
									</li>
								</ul>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
		
		<view class="btn-box" v-if="btnShow">
			<view class="btn" :class="{isSubmit}" @tap="submit">提交</view>
		</view>
	</view>
</template>

<script>
	import orderBasicInfo from "../components/order-basic-info.vue"
	import managePage from './module/manage.vue'
	import steps from './module/steps.vue'
	import {
		ywGDGetDetailsII,
		ywGDFileUploadProgress,
		ywGDWxPerTaskII
	} from "@/common/api/service.js"
	export default {
		name: 'order-service',
		components: {
			orderBasicInfo,
			managePage,
			steps
		},
		data() {
			return {
				gdCode:'',//工单编号
				gdZht:'',//工单状态
				detailInfo:{//工单详情 表单提交
					repStartTime:'',
					repEndTime:'',
					gdWhen:'',//用时
					gdFee:'',//费用
					isDown:10,//是否停机
					faultReason:'',//故障原因
					rValue:"",//维修状态
					gdLeixing:'',//故障等级
					gFiles:[],//文件
					wxCls:[] //备件
				},
				btnShow:false, //是否显示按钮
				userInfo: JSON.parse(uni.getStorageSync("userInfo")).data,
				tabs: ['设备故障', '处理信息', '维修进度', '更换备件'],
				currentIndex: 0,
				imgList:[],//图片列表
				options2: [
					{
						text: '取消',
						style: {
							backgroundColor: '#dcdcdc',
							color:'#333333'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#fe4141',
							color:'#fff'
						}
					}
				],
				
				
				
				
				isSubmit:false,//是否可以提交
				// detailInfo:{  
					
				// }
			}
		},
		watch:{
			detailInfo:{
				deep:true,
				handler(newVal){
					console.log('新值')
					if(newVal.repStartTime && newVal.repEndTime && newVal.rValue && newVal.faultReason && newVal.gdLeixing){
						this.isSubmit = true;
					}else{
						this.isSubmit = false;
					}
				}
			},
			"detailInfo.gdZht"(newVal){
				let role = this.userInfo.role;
				if(newVal == 40 && role == 'WXBZ11'){
					this.btnShow = true
				}
			},
			imgList:{
				deep:true,
				handler(newVal){
					console.log('新值心智')
					console.log(newVal)
				}
			}
		},
		onLoad(e) {
			this.gdCode = e.gdCode;
			this.gdZht = e.gdZht;
		},
		created() {
			this.getDetailInfo();
		},
		methods: {
			async submit(){
				let params = JSON.parse(JSON.stringify(this.detailInfo));
				//备件信息
				if(params.wxCls.length > 0){
					let wxCls = params.wxCls.map(item => ({
						wxCl:item.itemNum,
						wxClName:item.itemName,
						clShul:item.clShul,
						gdCode:this.gdCode
					}))
					params.wxCls = wxCls
				}
				params.gFiles = []
				//上传图片
				if(this.imgList.length > 0){
					for (let i = 0; i < this.imgList.length; i++) {
						let result = await ywGDFileUploadProgress(this.imgList[i], {
							protType: 1,
							second:0
						});
						params.gFiles.push(result)
					}
				}				
				console.log(params)
				params.gdCode = this.gdCode;
				let result = await ywGDWxPerTaskII(params)
				uni.showToast({
					title:'提交成功',
					icon:'none'
				})
				uni.navigateBack()
			},
			//添加备件
			addSpareParts(){
				let list = JSON.stringify(this.detailInfo.wxCls)
				uni.navigateTo({
					url:`/pages/service/add-spare-parts/add-spare-parts?dNum=${this.detailInfo.dNum}&selecteds=${list}`
				})
			},
			//获取工单详情
			async getDetailInfo(){
				this.detailInfo = await ywGDGetDetailsII({
					gdCode: this.gdCode
				});
			},
			//增加备件
			addNum(index){
				let list = JSON.parse(JSON.stringify(this.detailInfo.wxCls))
				list[index].clShul += 1;
				this.detailInfo.wxCls = list;
			},
			//减少备件
			subtractNum(index){
				if(this.detailInfo.wxCls[index].clShul == 1){
					uni.showToast({
						title:'备件数量不能再少了',
						icon:'none'
					})
				}else{
					let list = JSON.parse(JSON.stringify(this.detailInfo.wxCls))
					list[index].clShul -= 1;
					this.detailInfo.wxCls = list;
				}
			},
			bindClick(e,index){
				let {content} = e;
				if(content.text != "删除") return
				uni.showModal({
					content: '是否删除',
					success: res => {
						if (res.confirm) {
							this.detailInfo.wxCls.splice(index, 1);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-service {
		height: 100%;
		box-sizing: border-box;
		.swiper {
			box-sizing: border-box;
			&.noBtn{
				height: calc(100% - 89rpx);
			}
			&.haveBtn{
				height: calc(100% - 200rpx);
			}
		}
		.action-item{
			background-color: $bg-main;
			margin-top:33rpx;
			border-radius: 24rpx;
			font-weight: 500;
			.action-ul{
				margin:38rpx 38rpx 0;
				width:100%;
				.action-li{
					display: flex;
					align-items: center;
					margin-bottom: 37rpx;
					.sub-title{
						width:174rpx;
						color:#666666;
					}
					.center{
						flex:1;
						color:#333333;
						display: flex;
						justify-content: flex-start;
						align-items: stretch;
						.subtract,.add{
							color: #666666;
							border: 1rpx solid #dcdcdc;
							padding:10rpx 15rpx;
						}
						.subtract{
							border-right:0;
							border-radius:4rpx 0 0 4rpx;
						}
						.number{
							padding:10rpx 33rpx;
							border: 1rpx solid #dcdcdc;
						}
						.add{
							border-left: 0;
							border-radius: 0 4rpx 4rpx 0;
						}
					}
				}
			}
		}
	}
</style>
