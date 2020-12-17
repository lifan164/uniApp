import {
	request
} from './config/request.js'
//登录接口
export const Login5 = (data) => {
	return request(`Account/Login5`, data,"POST",1,false)
};

//站点列表
export const UtilGetServices = (data) => {
	let url = "/Utility/UtilGetServices";
	/* #ifdef APP-PLUS */
		url = `http://39.104.80.108/HqCeShi/BEEWebAPI/api${url}`
	/* #endif */
	
	/* #ifndef APP-PLUS */
		url = `/web${url}`
	/* #endif */
	return request(url, data, "POST", 2)
};
