<template>
	<view class="upkeep-plan" :style="`padding-top:${this.customBar}px;`">
		<header-bar :isBack="true">
			<text slot="title">保养计划</text>
			<text slot="right2" class="message" @tap="sortHandle">排</text>
		</header-bar>
		
		<!-- 查询 -->
		<view class="top-box">
			<view class="search-box">
				<view class="search">
					<text class="icon"></text>
					<input type="text" placeholder="搜索计划编号">
				</view>
			</view>
			<tabs :tabs="tabs" :currentIndex.sync="currentIndex" :height="97" :paddingTopBot="26" :paddingLeftRight="78"></tabs>
		</view>
		
		<!-- 主体部分 -->
		<swiper style="height:calc(100% - 195rpx);" current-item-id="1" :current="currentIndex" @change="(e) => {currentIndex = e.detail.current}">
			<swiper-item v-for="(item,index) in dataList" :key="index">
				<scroll-view style="height:100%;" scroll-y>
					<template v-if="item.length>0">
						<view class="uni-card-box">
							<block v-for="(subItem,subIndex) in item" :key="subIndex">
								<card :info="subItem"></card>
							</block>
						</view>
					</template>
					<template v-else>
						<text>暂无数据</text>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import card from './module/card.vue'
	export default {
		name:'upkeep-plan',
		components:{
			card
		},
		data() {
			return {
				tabs:["今日","本周","本月"],
				currentIndex:0,
				dataList:[
					[
						{num:'BXD20200101',sbName:'发动机机组1',status:1,type:'一级保养',name:'张三',date:'2020-02-02  09:10-12:10'},
						{num:'BXD20200102',sbName:'发动机机组2',status:2,type:'一级保养',name:'张三',date:'2020-02-02  09:10-12:10'},
						{num:'BXD20200103',sbName:'发动机机组3',status:1,type:'一级保养',name:'张三',date:'2020-02-02  09:10-12:10'},
						{num:'BXD20200104',sbName:'发动机机组4',status:1,type:'一级保养',name:'张三',date:'2020-02-02  09:10-12:10'}
					],
					[],
					[]
				]
			}
		},
		created() {
		},
		methods: {
			//数据排序
			sortHandle(){
				let list = this.dataList;
				list.forEach( item => {
					item = item.reverse();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.upkeep-plan{
	height:100%;
	box-sizing: border-box;
	.top-box{
		box-sizing: border-box;
		background-color: $bg-main;
		border-radius: 0 0 24rpx 24rpx;
		padding:24rpx 38rpx 0;
	}
	.uni-card-box{
		padding:24rpx 38rpx 0;
		box-sizing: border-box;
	}
}
</style>
