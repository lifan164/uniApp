<template>
	<header-bar>
		<text slot="title">{{title}}</text>
		<text slot="right1" class="scan">扫</text>
		<text slot="right2" class="message">信</text>
	</header-bar>
</template>

<script>
	export default{
		props:{
			title:{
				type:String,
				required:true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scan,.message{
		width:32rpx;
		height:32rpx;
		margin-left: 41rpx;
	}
</style>
