import Calendar from '@/components/ren-calendar/ren-calendar.vue';
export default {
	components: {
		Calendar
	},
	data() {
		return {
			markShowList: [{
				color: '#FF0005',
				textVal: '急需改善'
			}, {
				color: '#F5D812',
				textVal: '一般'
			}, {
				color: '#279DE0',
				textVal: '良好'
			}, {
				color: '#1FE812',
				textVal: '优势'
			}],
			markDays:[{
				time:'2020-12-18',
				showClass: 'redClass'
			},{
				time:'2020-12-19',
				showClass: 'yellowClass'
			},{
				time:'2020-12-20',
				showClass: 'blueClass'
			},{
				time:'2020-12-25',
				showClass: 'redClass'
			}],
			curDate:'',
		}
	},
	onLoad() {
		
	},
	onReadly(){
		let today = this.$refs.ren.getToday().date;
		this.curDate = today;
		this.markDays.push(today);
	},
	methods: {
		onDayClick:function (data){
			this.curDate = data.date;
		},
		changeMonth: function (data){
			console.log(data)
			this.markDays = [{
				time:`${data.nowMonth}-20`,
				showClass: 'yellowClass'
			},{
				time:`${data.nowMonth}-22`,
				showClass: 'redClass'
			},{
				time:`${data.nowMonth}-23`,
				showClass: 'blueClass'
			}]
			console.log(this.markDays)
		}
	}
}
