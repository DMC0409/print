import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		vuex_Wifi: false,
		vuex_TipModal: {
			isShow: false, //是否显示
			tipText: '', // 提示信息
			tipIcon: '', // 图标名称
			mark: true, // 是否有蒙版
			duration: -1, // 持续时间
			mode: '' // 弹窗模式 self-系统发起 custom-用户发起
		},
		printer: null, //打印机实例,
		adjustSwitch: false,
		vuex_Console: []
	},
	mutations: {
		// 更新wifi状态
		UPDATE_WIFI(state, data) {
			state.vuex_Wifi = data
		},
		// 更新提示框信息
		UPDATE_TIPMODAL(state, data) {
			state.vuex_TipModal = data
		},
		// 打印机实例化
		UPADTE_PRINTER(state, data) {
			state.printer = data
		},
		// 调试开关
		UPADTE_ADJUST(state, data) {
			state.adjustSwitch = data
		},
		// 更新控制台信息
		UPDATE_CONSOLE(state, data) {
			state.vuex_Console = data
		}
	},
	actions: {
		initPrinter({
			state,
			commit
		}) {
			const printer = uni.requireNativePlugin('LcPrinter');
			// 调用异步方法
			var ret = printer.initPrinter({});
			// modal.toast({
			// 	message: ret,
			// 	duration: 1.5
			// });
			let markEnable = uni.getStorageSync('paperType')
			printer.printEnableMark({
				enable: markEnable == 0 ? true : false
			});
			printer.setConcentration({ //设置打印浓度。font_level 取值范围：1~39。
				level: 39
			});
			printer.setLineSpacing({
				spacing: 1
			});
			printer.getsupportprint();
			commit('UPADTE_PRINTER', printer)
		},
		//打印 lineNum 空行
		printLine({
			state,
			commit
		}, lineNum) {
			state.printer.printLine({
				line_length: lineNum
			});
		},
		//设置字体大小
		setFontSize({
			state,
			commit
		}, fontSize) {
			state.printer.setFontSize({
				fontSize: fontSize
			});
		},
		// 打印文字
		printText({
			state,
			commit
		}, textDetail) {
			state.printer.printText({
				content: textDetail.content
			});
		},
		// 打印文字
		printText2({
			state,
			commit
		}, textDetail) {
			state.printer.printText2({
				content: textDetail.content,
				offset: textDetail.offset,
				isBold: textDetail.isBold,
				isUnderLine: textDetail.isUnderLine,
				fontSize: textDetail.fontsize,
			});
		},
		// 绘制二维码
		printQR({
			state,
			commit
		}, QRDetail) {
			state.printer.printQR({
				text: QRDetail.text,
				offset: QRDetail.offset
			});
		},
		// 绘制二维码
		printQR2({
			state,
			commit
		}, QRDetail) {
			state.printer.printQR2({
				height: QRDetail.height,
				text: QRDetail.text,
				offset: QRDetail.offset
			});
		},
		// 设置走纸距离
		feedPaper({
			state,
			commit
		}, length) {
			state.printer.setFeedPaperSpace({
				space: length
			});
		},
		// 获取走纸距离
		doFeedPaper({
			state,
			commit
		}) {
			state.printer.getFeedPaperSpace();
		},
		// 设置回纸距离
		unWindPaper({
			state,
			commit
		}, length) {
			state.printer.setUnwindPaperLen({
				length: length
			});
		},
		// 走纸
		start({
			state,
			commit
		}) {
			state.printer.start();
		},
		// 走纸
		startMove({
			state,
			commit
		}, length) {
			state.printer.printGoToNextMark1({
				distance: length
			});
		},
		// 打条形码
		printBarcode({
			state
		}, BrDetail) {
			state.printer.printBarcode({
				text: BrDetail.text,
				height: BrDetail.height,
				barcodeType: BrDetail.barcodeType
			});
		},
		// 复位打印机
		resetPrint({
			state
		}, length) {
			state.printer.resetPrint();
		},
		// 换标签页
		toNextMark({
			state,
			commit
		}) {
			state.printer.printGoToNextMark()
		},
		// 开始打印
		printStart({
			state,
			commit
		}) {
			state.printer.start()
		},
		// 关闭打印
		closePrint({
			state,
			commit
		}) {
			state.printer.closePrinter()
			commit('UPADTE_PRINTER', null)
		}
	}
})
export default store