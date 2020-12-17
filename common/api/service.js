// 工单 设备 相关接口
import {request,upload_one} from './config/request.js'


/*************工单相关接口***************/
// 工单列表
export const ywGDGetInfoII = (data) =>{
	return request(`YWNGD/ywGDGetInfoII`,data)
};

//工单报修
export const ywGDAddII = (data) =>{
	return request(`YWNGD/ywGDAddII`,data)
};
//工单详情
export const ywGDGetDetailsII = (data) =>{
	return request(`YWNGD/ywGDGetDetailsII`,data)
};
//工单紧急程度
export const ywGetGDUrgencyII = (data) =>{
	return request(`YWNGD/ywGetGDUrgencyII`,data)
};
//工单下发
export const ywGDAllotToBZII = (data) =>{
	return request(`YWNGD/ywGDAllotToBZII`,data)
};
//工单撤销
export const ywGDCallBZII = (data) =>{
	return request(`YWNGD/ywGDCallBZII`,data)
};
//获取班组长
export const ywGetWXLeaders = (data) =>{
	return request(`YWNGD/ywGetWXLeaders`,data)
};
//获取维修人员
export const  ywGetWXRens = (data) =>{
	return request(`YWNGD/ywGetWXRens`,data)
};
//班组长 分派工单
export const  ywGDAllotToWxRII = (data) =>{
	return request(`YWNGD/ywGDAllotToWxRII`,data)
};
//班组长 召回工单
export const  ywGDCallWxRII = (data) =>{
	return request(`YWNGD/ywGDCallWxRII`,data)
};
//维修人员  接单
export const  ywGDTaskOrderII = (data) =>{
	return request(`YWNGD/ywGDTaskOrderII`,data)
};
//维修状态
export const  ywGetGDResultII = (data) =>{
	return request(`YWNGD/ywGetGDResultII`,data)
};
//备件列表
export const  ywCKGetItem = (data) =>{
	return request(`YWNCK/ywCKGetItem`,data)
};
//关联设备
export const  ywGDDevAndItem = (data) =>{
	return request(`YWNGD/ywGDDevAndItem`,data,'get')
};
//执行工单
export const  ywGDWxPerTaskII = (data) =>{
	return request(`YWNGD/ywGDWxPerTaskII`,data)
};






/*********文件上传***************************/

//文件上传
export const ywGDFileUploadProgress = (path,data) =>{
	return upload_one(`YWNGD/ywGDFileUploadProgress`,path,data)
};





/*************设备相关接口***************/

//设备信息
export const ywDIGetDevs = (data) =>{
	return request(`YWNDev/ywDIGetDevs`,data)
};
//故障类型
export const ywGetFaultInfo = (data) =>{
	return request(`YWNGD/ywGetFaultInfo`,data)
};
