// import urlConfig from './config.js'


//接口请求
export const request = (url = "", data = {}, methodType = "POST",other=1,isUserId=true) => {
	// other 1、用户自定义地址  非1写死地址
	if(other == 1){
		url = getServer() + url;
	}
	//是否配置userID参数
	if(isUserId){
		let userInfo = uni.getStorageSync("userInfo");
		if(userInfo){
			data.userId = JSON.parse(userInfo).userId
		}
	}
	console.log('请求地址',url)
	console.log('请求参数',data)
	//获取配置信息
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: ''
		});
		// data.userId = 'mch'
		uni.request({
			url,
			method: methodType,
			// methodType=="POST" ? "application/x-www-form-urlencode" : "application/json"
			header: {
				"content-type": "application/json"
			},
			data,
			success(res) {
				let {
					statusCode,
					data
				} = res;
				if (statusCode == 200) {
					console.log('请求成功返回值',data)
					uni.hideLoading();
					if (data.code == 200) {
						resolve(data.data)
					} else {
						uni.showToast({
							title: data.msg,
							duration: 1500,
							icon: 'none'
						});
					}
				}
			},
			fail: (err) => {
				uni.hideLoading();
				reject(err)
			}
		})
	})
}

//单张图片上传
export const upload_one = (url, path, data) => {
	console.log('dfdfdfdfdf')
	console.log(path)
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: getServer() + url,
			filePath: path,
			formData: data,
			name: 'file',
			success: (res) => {
				if (res.statusCode == 200) {
					let data = JSON.parse(res.data)
					if (data.code == 200) {
						//请求地址
						let serverUrl = "";
						/* #ifdef APP-PLUS */
							serverUrl = uni.getStorageSync('serverUrl')
						/* #endif */
						
						/* #ifndef APP-PLUS */
							serverUrl = "http://192.168.1.214/BEEWebAPI/api/";
						/* #endif */
						serverUrl = serverUrl.replace(/api\//, '');
						
						let [imgObj] = data.data;
						//拼接图片地址
						imgObj.fileUrl = serverUrl + imgObj.fileUrl.replace(/\\/, '/');
						resolve(imgObj)
					} else {
						uni.showToast({
							title: data.msg,
							duration: 1500,
							icon: 'none'
						});
					}
				}
			},
			fail: (err) => {
				console.log(err)
			},
			complete() {
				uni.hideLoading()
			}
		});
	})
}

//图片上传
export const upload_img = (url, files, data) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: getServer() + url,
			header: {
				// 'Content-Type': 'multipart/form-data',
				// 'Content-Type': 'application/x-www-form-urlencode',
			},
			files,
			formData: data,
			success: (res) => {
				if (res.statusCode == 200) {
					let {
						data
					} = res;
					data = JSON.parse(data)
					if (data.code == 200) {
						resolve(data)
					} else {
						uni.showToast({
							title: data.message,
							duration: 1500,
							icon: 'none'
						});
					}
				} else {
					uni.showToast({
						title: res.errMsg,
						duration: 1500,
						icon: 'none'
					});
				}
			},
			fail: (err) => {
				console.log(err)
			}
		})
	})
}

//获取服务器地址
function getServer() {
	let urlConfig = ""
	/* #ifdef APP-PLUS */
		urlConfig = uni.getStorageSync('serverUrl');
	/* #endif */
	
	/* #ifndef APP-PLUS */
		urlConfig = "/web/";
	/* #endif */
	return urlConfig
}