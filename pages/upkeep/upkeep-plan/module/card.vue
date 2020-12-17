<template>
	<ul class="uni-card-ul" @tap="toDetail">
		<li class="title-box">
			<text class="title">编号: {{info.num}}</text>
			<text class="sub-title" :style="{color:statusColor[info.status]}">{{statusText[info.status]}}</text>
		</li>
		<li>
			<text class="side-title">设备名称</text>
			<text class="content">{{info.sbName}}</text>
		</li>
		<li>
			<text class="side-title">保养类型</text>
			<text class="content">{{info.type}}</text>
		</li>
		<li>
			<text class="side-title">保养人</text>
			<text class="content">{{info.name}}</text>
		</li>
		<li>
			<text class="side-title">计划时间</text>
			<text class="content">{{info.date}}</text>
		</li>
	</ul>
</template>

<script>
	export default{
		props:{
			info:{
				type:Object,
				required:true
			}
		},
		data(){
			return{
				statusColor:{
					1:"#F6AF31",
					2:'#898989'
				},
				statusText:{
					1:'待保养',
					2:'未开始'
				}
			}
		},
		methods:{
			toDetail(){
				uni.navigateTo({
					url:'/pages/upkeep/plan-detail/plan-detail'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
