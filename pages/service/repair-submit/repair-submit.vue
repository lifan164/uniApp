<!-- 报修 -->
<template>
	<view class="repair-submit" :style="`padding-top:${this.customBar}px;`">
		<header-bar :isBack="true">
			<text slot="title">报修</text>
		</header-bar>

		<scroll-view class="scroll-view" scroll-y="true">
			<ul class="main-ul equipment">
				<li class="main-title">设备信息</li>
				<li class="main-li" style="padding:0;">
					<picker class="uni-search-box" @change="equipmentChange" :value="equipment.current" :range="equipment.list"
					 range-key="dName">
						<view class="text-box">
							<text class="info-text" :class="{haveText:formData.dName}">{{formData.dName ? formData.dName : '请选择报修设备'}}</text>
							<text class="icon"></text>
						</view>
					</picker>
					<view class="scan" @tap="scanCode"></view>
				</li>
				<template v-if="formData.dName">
					<li class="main-li">
						<view class="sub-title"><text class="required">*</text>设备编号</view>
						<view class="center">{{formData.dNum}}</view>
					</li>
					<li class="main-li">
						<view class="sub-title">规格型号</view>
						<view class="center">{{formData.spec}}</view>
					</li>
					<li class="main-li">
						<view class="sub-title">设备位置</view>
						<view class="center">{{formData.installAddress}}</view>
					</li>
				</template>
			</ul>
			<ul class="main-ul">
				<li class="main-title">故障信息</li>
				<li class="main-li basics-box">
					<view class="sub-title"><text class="required">*</text>发生时间</view>
					<dateTimePicker placeholder="" :start="startDate" :defaultValue="formData.gdFsShij" placeholder="请选择发生日期" :end="endDate"
					 @change="(e) => {formData.gdFsShij = e.f3}"></dateTimePicker>
				</li>
				<li class="main-li basics-box">
					<view class="sub-title"><text class="required">*</text>故障类型</view>
					<picker class="center" @change="faultTypeChange" :value="faultType.current" :range="faultType.list" range-key="faultname">
						<view class="text-box">
							<text class="info-text">{{formData.faultname ? formData.faultname : '请选择故障类型'}}</text>
							<text class="icon"></text>
						</view>
					</picker>
				</li>
				<li class="main-li basics-box">
					<view class="sub-title">紧急程度</view>
					<picker class="center" @change="nervousChange" :value="nervous.current" :range="nervous.list" range-key="vName">
						<view class="text-box">
							<text class="info-text">{{ formData.gdTaskJjName ? formData.gdTaskJjName : '请选择紧急程度'}}</text>
							<text class="icon"></text>
						</view>
					</picker>
				</li>
				<li class="main-li basics-box">
					<view class="sub-title"><text class="required">*</text>故障描述</view>
					<input type="text" class="center" v-model="formData.bxBeizhu" placeholder="请输入故障信息">
				</li>
				<li class="main-li basics-box">
					<view class="sub-title">报修语音</view>
					<view class="center">
						<view class="voice-box" v-if="!formData.voicePath" @touchstart="startRecord" @longpress="recording" @touchend="endRecord">
							<text class="voiceIcon"></text>
							<text>点击录音</text>
						</view>
						<view class="voice-box have-voice" v-else>
							<view class="voice" @tap="playVoice">
								<text class="icon"></text>
								<text>{{formData.second}}″</text>
							</view>
							<text class="delete-voice" @tap="() => {formData.voicePath = ''}"></text>
						</view>
					</view>
				</li>
				<li class="main-li basics-box">
					<view class="sub-title">故障图片</view>
					<ul class="center img-box">
						<li v-for="(item,index) in formData.files" :key="index" :style="`background-image:url(${item})`"></li>
						<li class="add-img" v-if="formData.files.length < 6" @tap="addImg"></li>
					</ul>
				</li>
			</ul>

			<ul class="main-ul">
				<li class="main-title">其他信息</li>
				<li class="main-li basics-box">
					<text class="sub-title">报修人</text>
					<text class="center">{{formData.userName}}</text>
				</li>
				<li class="main-li basics-box">
					<text class="sub-title">报修电话</text>
					<input type="number" maxlength="11" class="center" v-model="formData.bxDianhua" placeholder="请输入保修电话">
				</li>
			</ul>
		</scroll-view>

		<view class="btn-box">
			<view class="btn" :class="{isSubmit:isSubmit}" @tap="submit">提交</view>
		</view>
	</view>
</template>

<script>
	import dateTimePicker from "@/components/datetime-picker/datetime-picker.vue"
	const recorderManager = uni.getRecorderManager(); //录音
	const innerAudioContext = uni.createInnerAudioContext(); //播放
	import {
		ywDIGetDevs,
		ywGetFaultInfo,
		ywGDAddII,
		ywGDFileUploadProgress,
		ywGetGDUrgencyII
	} from "@/common/api/service.js"
	export default {
		components: {
			dateTimePicker
		},
		data() {
			return {
				timeObj: '', //录音定时器
				isSubmit: false, //是否可以提交
				startDate: "", //时间组件开始时间
				endDate: "", //时间组件结束时间
				//设备信息
				equipment: {
					current: "",
					list: null //设备
				},
				//故障类型
				faultType: {
					current: "",
					list: null
				},
				//紧急程度
				nervous: {
					current: '',
					list:null
				},
				//报修数据
				formData: {  
					dName: '', //设备名字
					dNum: '', //设备编号
					spec: '', //规格型号
					installAddress: '', //设备位置
					gdFsShij: '', //发生时间
					faultnum: '', //故障类型
					faultname: '', //故障类型名字
					gdTaskJj: '', //紧急程度
					gdTaskJjName:'',//紧急程度名字
					userName:JSON.parse(uni.getStorageSync("userInfo")).userName,//报修人
					bxDianhua:'',//联系人电话
					bxBeizhu:'',//故障描述
					files: [],
					bxkeshi:JSON.parse(uni.getStorageSync("userInfo")).data.departName, //保修科室
					second:0,//录音时长
					b_DepartNum:JSON.parse(uni.getStorageSync("userInfo")).data.departNum
				}
			}
		},
		onLoad() {
			let _this = this;
			recorderManager.onStop(async res => {
				_this.formData.voicePath = res.tempFilePath;
			});
		},
		watch: {
			formData: {
				deep: true,
				handler(newVal) {
					if (newVal.gdFsShij && newVal.faultnum && newVal.dNum && newVal.bxBeizhu!='') {
						this.isSubmit = true;
					}else{
						this.isSubmit = false;
					}
				}
			}
		},
		created() {
			let date = new Date();
			this.startDate = `${date.getFullYear()-1}-01-01 00:00`;
			this.endDate = `${date.getFullYear()+1}-12-31 23:59`;
			this.getywGetGDUrgencyII();
			this.getywDIGetDevs();
			this.getywGetFaultInfo();
		},
		methods: {
			//提交表单
			async submit() {
				if(!this.isSubmit) return;
				let info = this.formData;
				//上传后的文件集合
				let gFiles = [];
				//上传图片
				if(info.files.length > 0){
					for (let i = 0; i < info.files.length; i++) {
						let result = await ywGDFileUploadProgress(info.files[i], {
							protType: 1,
							second:0
						});
						gFiles.push(result)
					}
				}
				//上传语音
				if(info.voicePath){
					let result = await ywGDFileUploadProgress(info.voicePath, {
						protType: 1,
						second:info.second
					});
					gFiles.push(result)
				}
				let params = JSON.parse(JSON.stringify(info));
				delete params.files;
				params.gFiles = gFiles;
				
				//提交报修
				let result = await ywGDAddII(params);
				uni.redirectTo({
					url: `/pages/service/order/order?currentIndex=0`
				});
			},
			//设备扫码
			scanCode() {
				let _this = this;
				/* #ifdef APP-PLUS */
				uni.scanCode({
					success(res) {
						let formData = _this.formData;
						[ formData.dNum,formData.dName,formData.spec,formData.installAddress] = res.result.split('|');
					}
				});
				/* #endif */
			},
			//故障类型发生改变时
			faultTypeChange(e) {
				let index = e.detail.value;
				this.faultType.current = index;
				this.formData.faultnum = this.faultType.list[index].faultnum;
				this.formData.faultname = this.faultType.list[index].faultname;
			},
			//紧急程度发生改变时
			nervousChange(e) {
				let index = e.detail.value;
				this.formData.gdTaskJj = this.nervous.list[index].vValue;
				
				this.formData.gdTaskJjName = this.nervous.list[index].vName;
				console.log(this.formData)
			},
			//设备信息 -- 报修设备发生改变
			equipmentChange(e) {
				let index = e.detail.value;
				let selected = this.equipment.list[index];
				console.log(selected)
				let formData = this.formData;
				this.equipment.current = index;

				formData.dName = selected.dName;
				formData.dNum = selected.dNum;
				formData.spec = selected.spec;
				formData.installAddress = selected.installAddress;
			},
			//添加故障图片
			addImg() {
				let _this = this;
				uni.chooseImage({
					count: 6 - this.formData.length, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: async function(res) {
						_this.formData.files = _this.formData.files.concat(res.tempFilePaths);
					}
				});
			},
			//开始录音
			startRecord() {
				console.log('开始录音')
				this.second = 0;
			},
			//结束录音
			async endRecord() {
				console.log('结束录音')
				clearInterval(this.timeObj)
				recorderManager.stop();
			},
			//录音中
			recording() {
				console.log('录音中')
				this.formData.second = 0;
				recorderManager.start();
				this.timeObj = setInterval(() => {
					this.formData.second++;
				}, 1000)
			},
			//播放录音
			playVoice() {
				if (this.formData.voicePath) {
					innerAudioContext.src = this.formData.voicePath;
					innerAudioContext.play();
				}
			},
			//获取设备列表
			async getywDIGetDevs() {
				this.equipment.list = await ywDIGetDevs();
			},
			//获取故障类型
			async getywGetFaultInfo() {
				this.faultType.list = await ywGetFaultInfo();
			},
			//获取紧急程度列表
			async getywGetGDUrgencyII(){
				this.nervous.list = await ywGetGDUrgencyII();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.repair-submit {
		height: 100%;
		box-sizing: border-box;
		padding-bottom: 111rpx;
	}

	.scroll-view {
		box-sizing: border-box;
		height: 100%;

		.main-ul {
			padding: 24rpx 38rpx 0;
			background-color: $bg-main;
			border-radius: 24rpx;
			margin-top: 32rpx;

			&.equipment {
				.main-li {
					padding: 5rpx 0;

					.center {
						color: #323336;
					}
				}
			}

			&:first-child {
				margin-top: 0;
				border-radius: 0 0 24rpx 24rpx;
				padding-bottom: 32rpx;
			}

			li {
				&.main-title {
					font-size: 32rpx;
					font-weight: 700;
					font-family: $font-family-title;
				}

				&.basics-box {
					padding: 24rpx 0;
					align-items: flex-start !important;
					border-bottom: 1rpx solid #DCDCDC;

					&:last-child {
						border-bottom: none;
					}

					input {
						font-size: 28rpx;
					}

					.center {
						font-size: 28rpx;

						.voice-box {
							color: #898989;
							display: flex;
							align-items: center;

							&.have-voice {
								justify-content: space-between;

								.voice {
									padding: 10rpx 16rpx;
									border: 1rpx solid #dcdcdc;
									border-radius: 8rpx;
									display: flex;
									align-items: center;

									.icon {
										width: 32rpx;
										height: 30rpx;
										margin-right: 17rpx;
									}
								}

								.delete-voice {
									width: 24rpx;
									height: 24rpx;
									background: #b4b4b4;
									border-radius: 50%;
								}
							}

							.voiceIcon {
								width: 32rpx;
								height: 32rpx;
								background: #999999;
								border-radius: 50%;
								margin-right: 12rpx;
							}
						}

						&.img-box {
							display: flex;
							justify-content: space-between;
							flex-wrap: wrap;
							align-items: center;

							&::after {
								content: '';
								width: 30%;
							}

							li {
								width: 30%;
								height: 120rpx;
								background-size: cover;
								border-radius: 16rpx;
								margin-bottom: 20rpx;

								&.add-img {
									background: #dedede;
									box-shadow: 0rpx 3rpx 8rpx 5rpx rgba(77, 77, 77, 0.2);
								}
							}
						}

						.text-box {
							display: flex;
							justify-content: space-between;
							align-items: center;

							.info-text {
								color: #333333;
							}
						}
					}
				}

				&.main-li {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 24rpx;
					font-size: 28rpx;
					font-weight: 500;

					.sub-title {
						width: 133rpx;
						flex-shrink: 0;
						color: #666666;

						.required {
							color: red;
						}
					}

					.center {
						flex: 1;
					}

					.uni-search-box {
						flex: 1;
						padding: 23rpx 24rpx;
						background: #fafbff;
						border-radius: 16rpx;

						.text-box {
							display: flex;
							align-items: center;
							justify-content: space-between;

							.info-text {
								flex: 1;
								color: #999999;

								&.haveText {
									color: #323336;
								}
							}
						}
					}

					.scan {
						width: 40rpx;
						height: 40rpx;
						border: 1rpx solid #2764FB;
						margin-left: 32rpx;
						flex-shrink: 0;
					}

					.icon {
						width: 24rpx;
						height: 14rpx;
						border: 1rpx solid #999999;
					}
				}
			}

		}
	}
</style>
