export const getTime = (date) => {
	date = new Date(date);
	let year = date.getFullYear();
	let month = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : `0${date.getMonth()+1}`;
	let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
	let hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
	let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

	return {
		d1: `${year}-${month}-${day} ${hours}:${minutes}`,
		d2:`${year}-${month}-${day}`,
		d3:`${hours}:${minutes}`
	}
}

//时间戳
export const getTimestamp = (date) => {
	return new Date(date.replace(/-/g, '/')).getTime()
}
//计算小时分钟
export const getHours = (startDate, endDate) => {
	startDate = getTimestamp(startDate)
	endDate = getTimestamp(endDate)
	let subtract = endDate - startDate;
	//天数
	let days=Math.floor(subtract/(24*3600*1000))
	//计算天数后剩余的毫秒数
	let leave1=subtract%(24*3600*1000)
	//小时
	let hours=Math.floor(leave1/(3600*1000))
	//计算小时数后剩余的毫秒数
	let leave2=leave1%(3600*1000)
	//分钟
	let minutes=Math.floor(leave2/(60*1000))
	return {
		hours:days*24 + hours,
		minutes
	}
}
