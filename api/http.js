import store from '../store/index.js'

export const myRequest = (options) => {
	let TIME = undefined
	return new Promise((resolve, reject) => {
		// 统一添加访问标识
		options.data.isWeChat = '1'
		// 添加指定参数
		options.data.isPdaPrintDevice = '1'
		console.log('send data:', options.data)
		// 检查版本信息时不显示loading
		if (options.data.need_type != 'getSopVersionFun') {
			// 提示加载中
			store._mutations['UPDATE_TIPMODAL'][0]({
				isShow: true,
				tipText: '加载中', // 提示信息
				tipIcon: 'iconloading', // 图标名称
				mark: true, // 是否有蒙版
				duration: 0, // 持续时间
				mode: 'self' // 弹窗模式
			})
		}
		TIME = setTimeout(() => {
			let baseURL = 'https://qly.info'
			// let baseURL = 'http://116.62.192.66'
			let delayTime = Number(uni.getStorageSync('delayTime'))
			uni.request({
				url: baseURL + options.url, //接口地址：前缀+方法中传入的地址
				method: options.method || 'GET', //请求方法：传入的方法或者默认是“GET”
				data: options.data || {}, //传递参数：传入的参数或者默认传递空集合
				timeout: delayTime, // 超时时间
				headers: {
					'Content-Type ': 'text/html;charset=utf-8'
				},
				success: (res) => {
					// 清除计时器
					clearTimeout(TIME)
					// 打印调试信息
					if (store.state.adjustSwitch) {
						let nowConsole = JSON.parse(JSON.stringify(store.state
							.vuex_Console))
						nowConsole.unshift(JSON.stringify(res.data))
						let sliceConsole = nowConsole.slice(0, 5)
						store._mutations['UPDATE_CONSOLE'][0](sliceConsole)
					}
					console.log('响应成功', res)
					//返回的数据（不固定，看后端接口，这里是做了一个判断，如果不为true，提示获取数据失败)
					if (typeof(res.data) != 'object') {
						// 提示网络接口错误
						store._mutations['UPDATE_TIPMODAL'][0]({
							isShow: true,
							tipText: '网络接口错误', // 提示信息
							tipIcon: 'iconshibai', // 图标名称
							mark: true, // 是否有蒙版
							duration: 2000, // 持续时间
							mode: 'self' // 弹窗模式
						})
						reject(res)
					} else if (typeof(res.data) == 'object') {
						if (res.data.sign != 1) {
							// 错误提示
							store._mutations['UPDATE_TIPMODAL'][0]({
								isShow: true,
								tipText: res.data.info, // 提示信息
								tipIcon: 'iconshibai', // 图标名称
								mark: true, // 是否有蒙版
								duration: 2000, // 持续时间
								mode: 'self' // 弹窗模式
							})

							if (res.data.sign == -99 || res.data.info ==
								'error request No SysId') {
								// 跳转至登录页面
								return uni.reLaunch({
									url: '../login/index'
								})
							}
							reject(res)
						} else {
							// 关闭提示加载中
							store._mutations['UPDATE_TIPMODAL'][0]({
								isShow: false,
								tipText: '', // 提示信息
								tipIcon: '', // 图标名称
								mark: true, // 是否有蒙版
								duration: 0, // 持续时间
								mode: '' // 弹窗模式
							})
							resolve(res)
						}
					}
				},
				// 这里的接口请求，如果出现问题就输出接口请求失败
				fail: (err) => {
					console.log(err)
					if (store.state.adjustSwitch) {
						// 打印调试信息
						let nowConsole = JSON.parse(JSON.stringify(store.state
							.vuex_Console))
						nowConsole.unshift(JSON.stringify(err))
						let sliceConsole = nowConsole.slice(0, 5)
						store._mutations['UPDATE_CONSOLE'][0](sliceConsole)
					}
					// 清除计时器
					clearTimeout(TIME)
					// 提示接口访问失败
					store._mutations['UPDATE_TIPMODAL'][0]({
						isShow: true,
						tipText: '请检查网络是否连接', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
					reject(err)
				}
			})
		}, 500)
	})
}