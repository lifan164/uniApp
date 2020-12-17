<template>
	<view>
		<view class="item_box">帆帆，爱你呦！</view>
		<view class="item_box">
			<view class="title">实时能效</view>
		</view>
		<view class="item_box">
			<view class="title">能效日历</view>
			<view class="mark_box">
				<view class="mark_item" v-for="(item,index) in markShowList" :key="index">
					<view class="radius_box" v-bind:style="{'background': item.color}"></view>
					<view>{{item.textVal}}</view>
				</view>
			</view>
			<view class="Calendar_box">
				<Calendar ref='ren' :markDays='markDays' :headerBar='true' @onDayClick='onDayClick'
				@changeMonth='changeMonth'></Calendar>
			</view>
		</view>
	</view>

</template>

<script src="./machineRoom.js"></script>
<style>
	@import url("./machineRoom.css");
</style>
