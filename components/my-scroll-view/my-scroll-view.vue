<template>
	<scroll-view style="height:100%;" scroll-y @refresherpulling="onPulling" @refresherrefresh="onRefresh"
	 @refresherrestore="onRestore" @scrolltolower="getMore" :refresher-triggered="triggered" refresher-enabled="true">
		<slot></slot>
	</scroll-view>
</template>

<script>
	export default{
		props:['total'],
		props:{
			total:{
				type:Number,
				default:0
			},
			pageSize:{
				type:Number,
				default:10
			},
			pageNum:{
				type:Number,
				default:1
			}
		},
		data(){
			return {
				triggered: false, //下拉刷新是否被触发
				scroll_refresher_enabled: true,
				_freshing: false, // 是否正在刷新
			}
		},
		methods:{
			//自定义下拉刷新控件被下拉
			onPulling(){
				this.triggered = true; // 需要重置
			},
			// 自定义下拉刷新被触发
			onRefresh(){
				if (this._freshing) return;
				this._freshing = true;
				if (!this.triggered) this.triggered = true; //界面下拉触发，triggered可能不是true，要设为true 
				this.$emit('refresh')
				// this.triggered = false
				// this._freshing = false
			},
			// 自定义下拉刷新被复位
			onRestore() {
				this.triggered = false; // 需要重置
			},
			getMore(){
				if((this.total - this.pageNum * this.pageSize) > 0){
					this.$emit('getMore')
				}
			}
		}
	}
</script>

<style>
</style>
