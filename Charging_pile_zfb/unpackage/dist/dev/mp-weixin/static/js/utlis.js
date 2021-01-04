// const host = 'https://www.hjyxcd.cn/lcyj-common-wap/newApp/'
// const host = 'https://www.java996.com/lcyj-common-wap/newApp/'
// const host = 'https://www.whlcej.cn/lcyj-common-wap/newApp/'
const host = 'https://www.whlcej.com/lcyj-common-wap/newApp/'
const key = 'G6HBZ-47UW4-W47U6-DXVNE-HSYDQ-EAFF3' //腾讯地图key

// 网络请求
function http(type = "GET", url, data, _success = false) {
	let token = uni.getStorageSync('token') || "";
	uni.request({
		url: host + url, //仅为示例，并非真实接口地址。
		data: data,
		header: {
			"Content-Type": 'application/x-www-form-urlencoded',
			// "X-Litemall-Token": uni.getStorageSync('token')
		},
		method: type,
		success: (res) => {
			console.log(host + url, res)
			if (res.statusCode == 500 && url != 'appChargeIngStateHj') {
				// uni.clearStorage()
				uni.hideLoading()
				my.showToast({
					content: '服务器异常!',
					duration: 3000,
					type: 'none'
				})
			}
			if (res.statusCode == 404 && url == 'appChargeStartQRCodeHj') {
				uni.hideLoading()
				setTimeout(function() {
					my.showToast({
						content: '充电枪未插好!',
						duration: 3000,
						type: 'none'
					})
				}, 200)
			}
			if (typeof _success == 'function') {
				_success(res.data);
			}
		},
		fail: (res) => {
			console.log(host + url)
			uni.hideLoading()
			my.showToast({
				content: '访问失败!',
				duration: 3000,
				type: 'none'
			})
		}
	});
}


//警告
var warning = (text, duration = 1000) => {
	my.showToast({
		content: text,
		duration: duration,
		type: 'none'
	})
}

//加载中
var loading = () => {
	my.showLoading({
		title: '加载中'
	})
}

// 根据经纬度，计算2个点之间的距离。
function haverSin(theta) {
	var v = Math.sin(theta / 2);
	return v * v;
}
//校验手机格式
function checkMobile(mobile) {
	return RegExp(/^1[34578]\d{9}$/).test(mobile);
}
// 给定的经度1，纬度1；经度2，纬度2. 计算2个经纬度之间的距离。
// lat1 经度1
// lon1 纬度1
// lat2 经度2
// lon2 纬度2
// return 距离（米）
function distance(lat1, lon1, lat2, lon2) {
	//用haversine公式计算球面两点间的距离。
	//经纬度转换成弧度
	lat1 = convertDegreesToRadians(lat1);
	lon1 = convertDegreesToRadians(lon1);
	lat2 = convertDegreesToRadians(lat2);
	lon2 = convertDegreesToRadians(lon2);

	//差值
	var vLon = Math.abs(lon1 - lon2);
	var vLat = Math.abs(lat1 - lat2);

	//h is the great circle distance in radians, great circle就是一个球体上的切面，它的圆心即是球心的一个周长最大的圆。
	var h = haverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * haverSin(vLon);

	let distance = parseInt(2 * EARTH_RADIUS * Math.asin(Math.sqrt(h)));

	return distance;
}

// 将角度换算为弧度。
// degrees 角度
// return 弧度
function convertDegreesToRadians(degrees) {
	return degrees * Math.PI / 180;
}

// 计算缩放级别
// 给定的经度1，纬度1；经度2，纬度2. 计算2个经纬度之间的距离。
// distances 直线距离
// return 缩放级别 
function countZoom(distances) {
	// 直线距离
	// let distances = distance(lat1, lon1, lat2, lon2)
	// 缩放等级18到5级
	let zoom = [25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 30000, 50000, 100000, 200000];
	for (let i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
		if (zoom[i] - distances > 0) {
			let b = 18 - i + 2 //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。真机实际2
			return b;
		}
	}
}
/**
 * 判断用户是否登录
 */



module.exports = {
	host,
	// imgHost,
	key,
	warning,
	http,
	loading,
	distance,
	countZoom,
	checkMobile
}
