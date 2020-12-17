//主题状态管理

const state = {
	//主题列表
	themes:[
		{name:"蓝色",themeType:1,main_color:'#2764FB',font_color:"#FFFFFF"},
		{name:'红色',themeType:2,main_color:'red',font_color:'blue'}
	],
	//当前主题
	currentTheme:{}
}

const mutations = {
	SET_CURRENTTHEME(state,type){
		state.currentTheme = state.themes.filter(item => item.themeType == type)[0];
		 uni.setStorageSync('theme_type', type);
	}
}

const actions = {
	
}

const getters = {
	getThemes: state => state.themes,
	getCurrentTheme: state => state.currentTheme
}

export default {
	namespaced: true,
	state,
	actions,
	getters,
	mutations
}