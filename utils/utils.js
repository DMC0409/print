import store from '../store/index.js';
export default {
	// 校验手机号
	isValidPhone(str) {
		const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
		return reg.test(str)
	},
	// 验证密码长度
	isValidPWD(str) {
		const reg = /^[0-9a-zA-Z*]{6,8}$/
		return reg.test(str)
	},
	// 进行具体打印
	doPrintFun(printData) {
		// 读取打印数据进行打印
		printData.forEach((i) => {
			i.printContent.forEach((j) => {
				let offset = 1
				if (j.textPosition) {
					if (j.textPosition == 'center') {
						offset = 2
					} else if (j.textPosition == 'right') {
						offset = 3
					} else if (j.textPosition == 'left') {
						offset = 1
					}
				}
				if (j.type == 'blank') {
					store._actions['printLine'][0](1)
				} else if (j.type == 'text') {
					store._actions['printText2'][0]({
						content: j.content,
						offset: offset,
						isBold: false,
						isUnderLine: false,
						fontsize: j.fontSize,
					})
					store._actions['printLine'][0](1)
				} else if (j.type == 'qr') {
					store._actions['printQR2'][0]({
						height: j.qrSize,
						text: j.content,
						offset: j.offset
					})
				} else if (j.type == 'bar' && j.content != '0') {
					store._actions['printBarcode'][0]({
						text: j.content,
						height: 80,
						barcodeType: 73
					})
				} else if (j.type == 'mark') {
					store._actions['toNextMark'][0]()
				}
			})
		})
		// 开始打印
		store._actions['printStart'][0]()
	},
	// 判断打印机错误
	judgePrintErr(num) {
		let errText = ''
		switch (num.key) {
			case 1:
				errText = '设备忙'
				break
			case 2:
				errText = '高温'
				break
			case 3:
				errText = '缺纸'
				break
			case 4:
				errText = '低电'
				break
			case 5:
				errText = '正在走纸'
				break
			case 6:
				errText = '正在打印'
				break
			case 7:
				errText = '黑标检测异常'
				break
			case 16:
				errText = '设备未打开'
				break
			case 17:
				errText = '打印数据不可为空'
				break
			case 18:
				errText = '数据非法'
				break
			case 19:
				errText = '指令错误'
				break
			case 20:
				errText = '浓度非法'
				break
			case 160:
				errText = '打印文本错误'
				break
			case 161:
				errText = '打印位图错误'
				break
			case 162:
				errText = '打印条码错误'
				break
			case 163:
				errText = '打印二维码错误'
				break
			case 164:
				errText = '打印位图宽度溢出'
				break
			case 165:
				errText = '输入参数错误'
				break
			case 166:
				errText = '参数错误'
				break
			case 167:
				errText = 'Mac校验错误'
				break
			case 168:
				errText = '结果已存在'
				break
			case 169:
				errText = '超时'
				break
			case 255:
				errText = '未知错误'
				break
		}
		if (errText != '') {
			store._mutations['UPDATE_TIPMODAL'][0]({
				isShow: true,
				tipText: errText, // 提示信息
				tipIcon: 'iconshibai', // 图标名称
				mark: true, // 是否有蒙版
				duration: 2000, // 持续时间
				mode: 'self' // 弹窗模式
			})
		}
	}
}