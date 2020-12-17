<template>
	<view class="order-basic-info">
		<!-- 设备信息 -->
		<ul class="card-ul">
			<li class="title">设备信息</li>
			<li>
				<text class="sub-title">设备编号</text>
				<text class="info right">{{detailInfo.dNum}}</text>
			</li>
			<li>
				<text class="sub-title">设备名称</text>
				<text class="info right">{{detailInfo.dName}}</text>
			</li>
			<template v-if="isMore">
				<li>
					<text class="sub-title">规格型号</text>
					<text class="info right">{{detailInfo.spec}}</text>
				</li>
				<li>
					<text class="sub-title">设备类型</text>
					<text class="info right">{{detailInfo.dcName}}</text>
				</li>
				<li>
					<text class="sub-title">设备位置</text>
					<text class="info right">{{detailInfo.installAddress}}</text>
				</li>
			</template>
			<li class="more">
				<text @tap="() => {isMore = !isMore}">{{isMore ? "收起" : "显示全部"}}</text>
			</li>
		</ul>
		
		<!-- 故障信息 -->
		<ul class="card-ul">
			<li class="title">故障信息</li>
			<li>
				<text class="sub-title">报修单号</text>
				<text class="fault right">{{detailInfo.gdCode}}</text>
			</li>
			<li>
				<text class="sub-title">发生时间</text>
				<text class="fault right">{{getTime(detailInfo.gdFsShij).d1}}</text>
			</li>
			<li>
				<text class="sub-title">报修电话</text>
				<text class="fault right">{{detailInfo.bxDianhua}}</text>
			</li>
			<li>
				<text class="sub-title">故障类型</text>
				<text class="fault right">{{detailInfo.faultname}}</text>
			</li>
			<li>
				<text class="sub-title">紧急程度</text>
				<text class="fault right">紧急</text>
			</li>
			<li>
				<text class="sub-title">故障描述</text>
				<text class="fault right">{{detailInfo.bxBeizhu}}</text>
			</li>
			<li v-if="record">
				<text class="sub-title">报修语音</text>
				<view class="voice right" @tap="play">
					<text class="icon"></text>
					<text class="date">{{record.second}}</text>
				</view>
			</li>
		</ul>
		<!-- 保修信息 -->
		<ul class="card-ul" style="padding-bottom:38rpx;">
			<li class="title">保修信息</li>
			<li>
				<text class="sub-title">报修人</text>
				<text class="fault right">{{detailInfo.bxRenName}}</text>
			</li>
			<li>
				<text class="sub-title">报修部门</text>
				<text class="fault right">{{detailInfo.bxkeshi}}</text>
			</li>
			<li>
				<text class="sub-title">报修电话</text>
				<text class="fault right">{{detailInfo.bxDianhua}}</text>
			</li>
		</ul>
		
		<!-- 故障图片 -->
		<ul class="card-ul" v-if="imgs.length > 0">
			<li class="title">故障图片</li>
			<li class="img-box">
				<view class="img" v-for="(item,index) in imgs" :key="index" :style="`background-image:url(${item})`" @tap="previewImage(index)"></view>
			</li>
		</ul>
	</view>
</template>

<script>
	import {
		getTime
	} from "@/utils/date.js"
	export default{
		name:'order-basic-info',
		props:{
			detailInfo:{
				required:true
			}
		},
		data(){
			return{
				isMore:false, //设备显示全部
				imgs:[],//图片
				record:null //录音
			}
		},
		watch:{
			detailInfo:{
				immediate:true,
				deep:true,
				handler(newVal){
					let gdFiles = this.detailInfo.gdFiles;
					if(gdFiles && gdFiles.length > 0){
						gdFiles.forEach( item => {
							if(item.fileUrl.indexOf('.mp3') > -1){ //录音
								this.record = item
							}else{//图片
								this.imgs.push(item.fileUrl)
							}
						})
					}
				}
			}
		},
		methods:{
			getTime,
			//图片详情
			previewImage(index){
				uni.previewImage({
					urls:this.imgs,
					current:this.imgs[index]
				});
			},
			//播放录音
			play(){
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.src = this.record.fileUrl;
				innerAudioContext.play();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-basic-info{
		.card-ul{
			background-color: $bg-main;
			padding:24rpx 39rpx 30rpx;
			border-radius: 24rpx;
			font-size:28rpx;
			font-weight: 500;
			margin-bottom: 32rpx;
			&:first-child{
				border-radius: 0 0 24rpx 24rpx;
			}
			&:last-child{
				padding-bottom: 1rpx;
			}
			li{
				display: flex;
				align-items: flex-start;
				margin-bottom: 30rpx;
				&.img-box{
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					&::after{
						content: '';
						width:30%;
					}
					.img{
						width:30%;
						height:160rpx;
						border-radius: 16rpx;
						background-size:cover ;
						margin-bottom: 30rpx;
					}
				}
				&:last-child{
					margin-bottom: 0;
				}
				&.more{
					justify-content: center;
					color: #666666;
					font-size:24rpx;
					padding-top:10rpx;
				}
				&.title{
					font-family: $font-family-title;
					color: #323336;
					font-size:32rpx;
					font-weight: 700;
				}
				.sub-title{
					color: #666666;
					width:170rpx;
				}
				.right{
					flex:1;
					&.info{
						font-weight: 700;
						font-family: $font-family-title;
						color: #323336;
					}
					&.fault{
						color:#333333;
						font-family: $font-family-text;
					}
					&.voice{
						flex:0;
						display: flex;
						align-items: center;
						padding:10rpx 16rpx;
						border: 1rpx solid #dcdcdc;
						border-radius: 8rpx;
						.date{
							color:#333333;
						}
						.icon{
							width:32rpx;
							height:30rpx;
							display: inline-block;
							border:1rpx solid #898989;
							margin-right: 17rpx;
						}
					}
				}
		
			}
		}
	}
</style>
