import Vue from 'vue'
import App from './App'
import store from './store'
//导航条
import headerBar from "./components/header-bar/header-bar"
Vue.component('header-bar', headerBar)
Vue.config.productionTip = false

App.mpType = 'app'
Vue.mixin({
	computed: {
		//获取主题
		theme_color() {
			let theme_type =  uni.getStorageSync('theme_type');
			if(theme_type){//有主题
				this.$store.commit("theme/SET_CURRENTTHEME",theme_type);
			}else{//无主题  设置默认主题
				this.$store.commit("theme/SET_CURRENTTHEME",1);
			}
			return this.$store.getters["theme/getCurrentTheme"]
		}
	}
})

const app = new Vue({
	store,
	...App
})
app.$mount()
