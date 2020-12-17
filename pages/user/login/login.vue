<template>
	<view class="login-page">
		<view class="bg-img">
			<view class="container">
				<view class="logo_img"></view>
				<view class="logo_title">智慧运维管理</view>
			</view>
		</view>
		<view class="main">
			<ul>
				<li>
					<view class="left_box">
						<text class="icon"></text>
						<input v-model="formData.userID" type="text" placeholder="用户名" />
					</view>
					<view class="right_box"></view>
				</li>
				<li>
					<view class="left_box">
						<text class="icon"></text>
						<input v-model="formData.userPwd" :password="isShow" type="text" placeholder="密码" />
					</view>
					<view class="right_box" @tap.stop="isShow = !isShow"></view>
				</li>
				<li @tap.stop="setSite">
					<view class="left_box">
						<text class="icon"></text>
						<input v-model="formData.servicename" disabled type="text" placeholder="站点" />
					</view>
					<view class="right_box"></view>
				</li>
			</ul>
			<view class="checkbox_box">
				<checkbox-group @change="test">
					<checkbox style="transform: scale(0.7);" value="lalalalla" :checked="isSave"/>记住密码
				</checkbox-group>
			</view>
			<view class="login_btn" :style="{'background-color': isLogin ? theme_color.main_color : '#DCDCDC'}" @tap="login">登录</view>
			<!-- 设置 -->
			<!-- <view class="setBox"> -->
				<text class="set" @tap.stop="toServer"></text>
			<!-- </view> -->
		</view>

	</view>
</template>

<script>
	import {
		Login5
	} from '@/common/api/user.js'
	import {
		throttle
	} from "@/common/js/utils.js"
	import Went from "@/common/js/encryption.js"
	export default {
		name: 'login-page',
		data() {
			return {
				formData: {
					userID: '',
					userPwd: '',
					servicename: '',
					beewebapi:'',
					userSrc:'mobile'
				},
				//是否可提交
				isLogin: false,
				//是否显示密码
				isShow:true,
				isSave:false//是否保存密码
			}
		},
		watch:{
			formData:{
				deep:true,
				handler(newVal){
					console.log('新值',newVal)
					if(newVal.userID && newVal.userPwd && newVal.servicename){
						this.isLogin = true
					}else{
						this.isLogin = false
					}
				}
			}
		},
		created() {
			//获取用户信息 站点信息
			let configInfo = uni.getStorageSync("configInfo");
			if(configInfo){
				this.formData = JSON.parse(configInfo);
				this.isSave = true;
			}
		},
		methods: {
			test(e){
				console.log(e.detail.value)
				this.isSave = e.detail.value.length > 0
			},
			//登录
			async login() {
				if(!this.isLogin) return
				let info = JSON.parse(JSON.stringify(this.formData));
				//加密
				info.userID = Went.utility.wCoder.wEncode(info.userID)
				info.userPwd =  Went.utility.wCoder.wEncode(info.userPwd)
				//保存请求地址
				uni.setStorageSync("serverUrl",info.beewebapi);
				//登录
				let result = await Login5(info);
				if(this.isSave){
					//解密 保存用户信息 站点信息
					info.userID = Went.utility.wCoder.wDecode(info.userID);
					info.userPwd =  Went.utility.wCoder.wDecode(info.userPwd);
					uni.setStorageSync("configInfo",JSON.stringify(info));
				}else{
					uni.removeStorageSync("configInfo")
				}
				//登录成功 保存用户信息
				uni.setStorageSync('userInfo',JSON.stringify(result));
				uni.switchTab({
				    url: '/pages/tabBar/index/index'
				});
				
			},
			//设置站点
			setSite(){
				uni.navigateTo({
					url:'/pages/user/site/site'
				})
			},
			//选择服务器
			toServer(){
				uni.navigateTo({
					url:"/pages/user/server/server"
				})
			}
			//设置主题
			// setTheme(type) {
			// 	this.$store.commit('theme/SET_CURRENTTHEME',type)
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.login-page {
		min-height: 100%;
		box-sizing: border-box;

		.bg-img {
			height: 750rpx;
			background-image: url(../../../static/img/login_bg.png);
			background-size: cover;
			box-sizing: border-box;
			padding-top: 190rpx;
			text-align: center;

			.container {
				display: inline-block;
				text-align: center;

				.logo_img {
					width: 210rpx;
					height: 210rpx;
					background-image: url(../../../static/img/login_logo.png);
					background-size: cover;
					display: inline-block;
				}

				.logo_title {
					font-size: 56rpx;
					font-weight: 500;
					color: #fff;
				}
			}
		}

		.main {
			height: calc(100vh - 600rpx);
			background: #FFFFFF;
			position: fixed;
			bottom: 0;
			width: 100%;
			border-radius: 24rpx 24rpx 0 0;
			box-sizing: border-box;
			padding: 2rpx 56rpx 37rpx;

			ul {
				li {
					border-bottom: 1rpx solid #DCDCDC;
					padding: 64rpx 0 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left_box {
						flex-grow: 1;
						display: flex;
						align-items: center;

						.icon {
							width: 32rpx;
							height: 32rpx;
							border: 1rpx solid #DCDCDC;
							margin-right: 14rpx;
						}

						input {
							flex-grow: 1;
							font-size: 30rpx;
						}
					}

					.right_box {
						width: 24rpx;
						height: 24rpx;
						border: 1px solid #dcdcdc;
					}
				}
			}

			.checkbox_box {
				margin: 40rpx 0 63rpx;
			}

			.login_btn {
				line-height: 80rpx;
				text-align: center;
				width: 100%;
				border-radius: 16rpx;
				color: #fff;
				font-size: 36rpx;
				font-weight: 400;
			}
					.set{
						display: inline-block;
						width:38rpx;
						height:38rpx;
						border:1rpx solid #dcdcdc;
						position: absolute;
						right:55rpx;
						bottom:37rpx;
					}
		}
	}
</style>
