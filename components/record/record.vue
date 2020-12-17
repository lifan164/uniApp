<template>
	<view class="record">
		<slot></slot>
		<!-- 遮罩层 -->
		<view class="mask" @tap.stop="closePicker" v-if="isShow" @touchmove.stop.prevent="moveHandle"></view>
		<!-- 多选控件 -->
		<view class="conbox record pickerShow">
			<view class="time">
				{{showRecordTime}}
			</view>
			<view class="c999">
				最短{{minTime}}秒，最长{{maxTime}}秒
			</view>
			<!-- @longpress="record" @touchend="end" @touchmove.stop.prevent="moveHandle" -->
			<view class="record-box" @touchstart="start" @touchend="end">
				<span class="stop" @touchstart.stop="stopVoice" v-if="voicePath && playing==1"></span>
				<span class="paly" @touchstart.stop="playVoice" v-if="voicePath && playing==0"></span>
				<canvas class="canvas" canvas-id="canvas">
					<span class="recording"></span>
				</canvas>
				<span class="confirm" @touchstart.stop="okClick" v-if="voicePath"></span>
			</view>
			<view class="c666 fz32 domess">长按录音</view>
		</view>
	</view>
</template>

<script>
	const recorderManager = uni.getRecorderManager(); //录音
	const innerAudioContext = uni.createInnerAudioContext(); //播放
	export default {
		props: {
			voicePath: { //音频地址
				type: String,
				default: ''
			},
			maxTime: { // 录音最大时长，单位秒
				type: Number,
				default: 15
			},
			minTime: { // 录音最大时长，单位毫秒
				type: Number,
				default: 5
			}
		},
		data() {
			return {
				isShow: true,
				recordTime: 0, //录音时长
			}
		},
		onLoad() {
			//获取录音权限
			uni.authorize({
				scope: 'scope.record',
				success() {}
			})
		},
		computed: {
			showRecordTime() {
				var strs = "";
				var m = Math.floor(this.recordTime / 60);
				if (m < 10) strs = "0" + m;

				var s = this.recordTime % 60;
				strs += (s < 10) ? ":0" + s : ":" + s;
				return strs
			}
		},
		methods: {
			//开始录音
			start() {
				// this.canvasObj = uni.createCanvasContext('canvas');
				console.log('开始了开始了')
			},
			//结束录音
			end(){
				console.log('结束录音')
			},
			record() {
				console.log('dfdf')
				let _this = this;
				recorderManager.start();
				_this.timeObj = setInterval(function() {
					_this.recordTime++;
					if (_this.recordTime == _this.maxTime) _this.end();
				}, 1000);
			},
			closePicker() {

			},
			moveHandle() {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.record {
		.mask {
			position: fixed;
			z-index: 1000;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
		}

		.conbox {
			transition: all .3s ease;
			transform: translateY(100%);

			&.pickerShow {
				transform: translateY(0);
			}

			position: fixed;
			z-index: 1000;
			right: 0;
			left: 0;
			bottom: 0;
			background: #fff;
		}

		.c666 {
			color: #666;
		}

		.c999 {
			color: #999;
		}

		.fz28 {
			font-size: 28upx;
		}

		.fz32 {
			font-size: 32upx;
		}


		.record {
			text-align: center;

			.time {
				text-align: center;
				font-size: 60upx;
				color: #000;
				line-height: 100upx;
				margin-top: 50upx;
			}

			.domess {
				margin-bottom: 50upx;
			}


			.record-box {
				display: flex;
				flex-direction: row;
				justify-content: center;
			}

			canvas {
				margin: 10upx 60upx;
				position: relative;
				width: 200upx;
				height: 200upx;
				z-index: 10;

				.recording {
					position: absolute;
					top: 20upx;
					left: 20upx;
					width: 160upx;
					height: 160upx;
					border: 1px dashed #fe3b54;
					border-radius: 100upx;
					background: #fe3b54 url(../../static/jsfun-record/recording.png) no-repeat 50% 50%;
					background-size: 50% 50%;
					z-index: 100;
				}
			}

			.btncom {
				margin-top: 70upx;
				width: 80upx;
				height: 80upx;
				border-radius: 80upx;
			}

			.stop {
				@extend .btncom;
				background: url(../../static/jsfun-record/stop.png) no-repeat;
				background-size: 100% 100%;
			}

			.paly {
				@extend .btncom;
				background: url(../../static/jsfun-record/play.png) no-repeat;
				background-size: 100% 100%;
			}

			.confirm {
				@extend .btncom;
				background: url(../../static/jsfun-record/confirm.png) no-repeat 100% 100%;
				background-size: 100% 100%;
			}


		}
	}
</style>
