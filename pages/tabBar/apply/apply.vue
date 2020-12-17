<template>
	<view class="apply-page" :style="`padding-top:${this.customBar}px;`">
		<my-header title="应用"></my-header>
		<scroll-view scroll-y="true" style="height:100%;">
			<ul class="main-ul">
				<li class="main-li" v-for="(item,index) in list" :key="index">
					<view class="img-box" :style="{backgroundColor:item.bgColor}"></view>
					<view class="title">{{item.title}}</view>
				</li>
			</ul>
		</scroll-view>
	</view>
</template>

<script>
	import myHeader from "../module/header.vue"
	// import {
	// 	ywGDGetInfo
	// } from "@/common/api/user.js"
	export default {
		name:'apply-page',
		components:{myHeader},
		data() {
			return {
				list:[
					{bgColor:'#F6BC4D',title:'维修',icon:'',url:''},
					{bgColor:'#2BD7B5',title:'保养',icon:'',url:''},
					{bgColor:'#9068ED',title:'巡检',icon:'',url:''},
					{bgColor:'#5B87F4',title:'报修',icon:'',url:''},
					{bgColor:'#4FAEFE',title:'设备',icon:'',url:''},
					{bgColor:'#4FAEFE',title:'配件',icon:'',url:''},
					{bgColor:'#4FAEFE',title:'监控',icon:'',url:''},
					{bgColor:'#4FAEFE',title:'能管',icon:'',url:''},
					{bgColor:'#4FAEFE',title:'知识库',icon:'',url:''}
				]
			}
		},
		onLoad(){
		},
		onShow(){
			// ywGDGetInfo({
			// 	userID: "6ED10B",
			// 	userPwd: "6ED30B7CED45",
			// 	userSrc: "web"
			// })
		},
		onReady(){
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.apply-page{
		height:100%;
		box-sizing: border-box;
		.main-ul{
			padding:40rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.main-li{
				margin-right:40rpx;
				text-align: center;
				&:nth-child(4n){
					margin-right: 0;
				}
				.img-box{
					width:106rpx;
					height:106rpx;
					border-radius: 16rpx;
					box-shadow: 0rpx 3rpx 11rpx 7rpx rgba(77,77,77,0.2); 
				}
				.title{
					margin: 15rpx 0 40rpx;
					font-size:26rpx;
					font-weight: 500;
					color:#666666;
				}
			}
		}
	}
</style>
