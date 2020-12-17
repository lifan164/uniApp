<template>
	<view class="manage-page">
		<ul class="card-ul">
			<li class="card-li">
				<view class="sub-title">
					<text v-if="btnShow">*</text>开始时间
				</view>
				<dateTimePicker placeholder="" :start="startDate" :defaultValue="info.repStartTime" :end="endDate" @change="startDateChange"></dateTimePicker>
			</li>
			<li class="card-li">
				<view class="sub-title">
					<text v-if="btnShow">*</text>结束时间
				</view>
				<dateTimePicker placeholder="" :start="startDate" :defaultValue="info.repEndTime" :end="endDate" @change="endDateChange"></dateTimePicker>
			</li>
			<li class="card-li">
				<view class="sub-title">维修用时</view>
				<view class="center">{{info.gdWhen}}{{info.gdWhen ? '小时' : ''}}</view>
			</li>
			<li class="card-li">
				<view class="sub-title">维修费用(元)</view>
				<input type="number" placeholder="请输入维修费用" v-model="info.gdFee" class="center">
			</li>
			<li class="card-li">
				<view class="sub-title">是否停机</view>
				<radio-group name="sex" class="center" @change="(e) => {info.isDown = e.detail.value}">
					<label v-for="(item,index) in downtimeList" :key="index" class="lable">
						<radio :value="item.value" style="transform: scale(0.7);" :checked="info.isDown == item.value" /><text>{{item.text}}</text>
					</label>
				</radio-group>
			</li>
			<li class="card-li">
				<view class="sub-title">
					<text>*</text>维修状态
				</view>
				<picker class="center" @change="serviceChange" :value="service.current" :range="service.list" range-key="rName">
					<view class="text-box">
						<text>{{service.list[service.current] ? service.list[service.current].rName : ''}}</text>
						<text class="icon"></text>
					</view>
				</picker>
			</li>
		</ul>

		<ul class="card-ul">
			<li class="card-li">
				<view class="sub-title"><text>*</text>故障原因</view>
				<input class="center textarea" v-model="info.faultReason" placeholder="请输入故障原因" />
			</li>
			<li class="card-li">
				<view class="sub-title"><text>*</text>故障等级</view>
				<picker class="center" @change="levelChange" :value="level.current" :range="level.list" range-key="label">
					<view class="text-box">
						<text>{{level.list[level.current] ? level.list[level.current].label : ''}}</text>
						<text class="icon"></text>
					</view>
				</picker>
			</li>
		</ul>

		<ul class="card-ul">
			<li class="card-li" style="border-bottom: none;">
				<i class="sub-title">维修图片</i>
				<ul class="center img-ul">
					<template v-if="imgList.length > 0">
						<li class="img-li" v-for="(item,index) in imgList" :key="index" @tap="previewImage(index)" :style="`background-image:url(${item})`">
							<text @tap.stop="deleteImg(index)"></text>
						</li>
					</template>
					<li class="img-li" v-if="imgList.length < 6" @tap="addImg"></li>
				</ul>
			</li>
		</ul>
	</view>
</template>

<script>
	import dateTimePicker from "@/components/datetime-picker/datetime-picker.vue"
	import {
		getTime,
		getTimestamp,
		getHours
	} from "@/utils/date.js"
	import {
		ywGetGDResultII
	} from "@/common/api/service.js"
	export default {
		name:'manage-page',
		props: {
			info: {
				type: Object,
				required:true
			},
			imgList:{
				type:Array,
				required:true
			},
			btnShow:{
				type:Boolean,
				default:false
			}
		},
		components: {
			dateTimePicker
		},
		data() {
			return {
				startDate: '', //开始时间
				endDate: '', //结束时间
				hours:'',//小时
				minutes:'',//分钟
				downtimeList: [{
						value: '20',
						text: '是'
					},
					{
						value: '10',
						text: '否'
					}
				],
				//维修状态
				service: { 
					current: "",
					list: []
				},
				//故障等级
				level: {
					current: "",
					list: [{
							label: "核心部件",
							value: 10
						},
						{
							label: "辅件",
							value: 20
						},
						{
							label: "主备机切换",
							value: 30
						},
						{
							label: "参数调整",
							value: 40
						}
					]
				}
			}
		},
		created() {
			console.log('*****************************')
			console.log(this.info)
			let date = new Date();
			this.startDate = `${date.getFullYear()-1}-01-01 00:00`;
			this.endDate = `${date.getFullYear()+1}-12-31 23:59`;
			this.getYwGetGDResultII()
		},
		watch: {
			//开始时间发生改变时
			"info.repStartTime"(newVal){
				let info = this.info
				if(info.repEndTime){
					let {hours,minutes} = getHours(newVal,info.repEndTime)
					this.info.gdWhen = hours + Number((minutes/60).toFixed(1))
				}
			},
			"info.repEndTime"(newVal){
				let info = this.info
				if(info.repStartTime){
					let {hours,minutes} = getHours(info.repStartTime,newVal)
					this.info.gdWhen = hours + Number((minutes/60).toFixed(1))
				}
			},
			//维修状态的监听
			"info.rValue": {
				immediate: true,
				handler(newVal) {
					if (!newVal) return
					let list = this.service.list;
					for (let i = 0; i < list.length; i++) {
						if (list[i].value == newVal) {
							this.service.current = i;
							return
						}
					}
				}
			}
		},
		methods: {
			//获取维修状态列表
			async getYwGetGDResultII(){
				this.service.list = await ywGetGDResultII();
			},
			//删除图片
			deleteImg(index) {
				this.imgList.splice(index, 1);
			},
			//图片预览
			previewImage(index) {
				uni.previewImage({
					urls: this.imgList,
					current: this.imgList[index]
				});
			},
			//维修状态发生改变
			serviceChange(e) {
				this.service.current = e.detail.value;
				console.log('****************')
				console.log(this.info)
				this.info.rValue = this.service.list[e.detail.value].rValue
			},
			//故障等级发生改变
			levelChange(e) {
				let index = e.detail.value;
				this.level.current = index;
				this.info.gdLeixing = this.level.list[index].value
			},
			//上传图片
			addImg() {
				let _this = this;
				uni.chooseImage({
					count: 6 - this.imgList.length,
					sizeType: ['original', 'compressed'],
					success: function(res) {
						_this.imgList.push(...res.tempFilePaths)
					}
				})
			},
			//开始时间发生改变
			startDateChange(e) {
				let info = this.info;
				if (!info.repEndTime) {
					info.repStartTime = e.f3
				} else {
					if(getTimestamp(e.f3) - getTimestamp(info.repEndTime) > 0) {
						uni.showToast({
							title: '开始时间需小于结束时间',
							icon: 'none'
						})
					}else{
						info.repStartTime = e.f3
					}
				}
			},
			//结束日期发生改变
			endDateChange(e) {
				let info = this.info;
				if(!info.repStartTime){
					info.repEndTime = e.f3
				}else{
					if(getTimestamp(e.f3) - getTimestamp(info.repStartTime) > 0) {
						info.repEndTime = e.f3
					}else{
						uni.showToast({
							title: '结束时间需大于开始时间',
							icon: 'none'
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-ul {
		background-color: $bg-main;
		margin-top: 32rpx;
		padding: 20rpx 38rpx 28rpx;
		border-radius: 24rpx;
		font-size: 28rpx;
		font-weight: 500;

		.card-li {
			padding: 25rpx 0;
			display: flex;
			align-items: flex-start;
			border-bottom: 1rpx solid #dcdcdc;

			.sub-title {
				width: 170rpx;
				color: #666666;
				flex-shrink: 0;

				text {
					color: red;
					padding-right: 5rpx;
				}
			}

			.center {
				flex: 1;
				color: #333333;

				&.img-ul {
					display: flex;
					align-items: center;
					justify-content: space-between;
					flex-wrap: wrap;

					&::after {
						content: "";
						width: 150rpx;
					}
				}

				.lable {
					padding-right: 87rpx;

					&:last-child {
						padding-right: 0;
					}
				}

				.text-box {
					display: flex;
					width: 100%;
					justify-content: space-between;
				}

				.img-li {
					width: 150rpx;
					height: 150rpx;
					border-radius: 16rpx;
					box-shadow: 0rpx 3rpx 8rpx 5rpx rgba(77, 77, 77, 0.2);
					background: #dedede;
					margin-bottom: 30rpx;
					background-size: cover;
					position: relative;
				}
			}

			.icon {
				width: 14rpx;
				height: 23rpx;
				border: 1rpx solid #999999;
				padding: 10rpx;
				flex-shrink: 0;
			}
		}
	}
</style>
