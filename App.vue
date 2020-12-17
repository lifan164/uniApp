<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			this.getSystemInfo();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			//获取系统信息--并配置导航条高度
			getSystemInfo() {
				uni.getSystemInfo({
					success: function(e) {
						//状态栏高度
						Vue.prototype.statusBar = e.statusBarHeight
						/* #ifndef MP */
						//自定义导航条高度
						if (e.platform == 'android') {
							Vue.prototype.customBar = e.statusBarHeight + 50
						} else {
							Vue.prototype.customBar = e.statusBarHeight + 45
						}
						/* #endif */

						/* #ifdef MP-WEIXIN */
						let custom = wx.getMenuButtonBoundingClientRect()
						Vue.prototype.customBar = custom.bottom + custom.top - e.statusBarHeight
						/* #endif */
						
						/* #ifdef MP-ALIPAY */
						Vue.prototype.customBar = e.statusBarHeight + e.titleBarHeight
						/* #endif */
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	// @import "./common/scss/mixin.scss";
	page {
		height: 100%;
		background-color: $bg-basis;
		font-weight: 400;
		font-family: $font-family-text;
	}

	//导航栏不显示时，手机顶部状态栏会被页面内容覆盖。需设置占位标签
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
