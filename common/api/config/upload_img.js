import urlConfig from './config.js'

//上传单张图片
export const upload_one = (url, path) => {
	console.log('上传图片')
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: urlConfig + url,
			filePath: path,
			name: 'file',
			success: (res) => {
				console.log(res)
				let {
					data
				} = res;
				data = JSON.parse(data)
				if (res.statusCode == 200) {
					resolve(data)
				} else {
					console.log(typeof data)
					uni.showToast({
						title: data.message,
						duration: 1500,
						icon: 'none'
					});
				}
			},
			fail: (err) => {
				console.log('失败了', err)
				reject(err)
			},
			complete() {
				uni.hideLoading()
			}
		});
	})
}


