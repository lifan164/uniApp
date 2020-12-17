let urlConfig = "";


//判断环境
if (process.env.NODE_ENV === 'development') { //开发环境
	/* #ifdef APP-PLUS */
	/* #endif */
	/* #ifndef APP-PLUS */
		urlConfig = "/web/";
	/* #endif */
} else { //生产环境
	// urlConfig = uni.getStorageSync("serverUrl")
	urlConfig = "http://192.168.1.214/BEEWebAPI/api/"
	// console.log('生产环境服务器地址')
	// console.log(urlConfig)
}


export default urlConfig
