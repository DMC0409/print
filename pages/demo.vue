<template>
	<div>
		<button type="primary" @click="initPrinter">初始化打印</button>
		<button type="primary" @click="closePrinter">关闭打印</button>
		<button type="primary" @click="printerText">打印小票</button>
		<button type="primary" @click="printerLabel">测试打印</button>
		<button type="primary" @click="printLabel">打印标签</button>

	</div>
</template>

<script>
	const printer = uni.requireNativePlugin('LcPrinter');
	const modal = uni.requireNativePlugin('modal');
	var globalEvent = uni.requireNativePlugin('globalEvent');

	export default {
		data() {
			return {};
		},
		onLoad: function() {
			// 添加打印状态监听
			globalEvent.addEventListener('onPrintCallback', function(e) {
				uni.showToast({
					title: 'state: ' + JSON.stringify(e),
					duration: 2000
				});
				if (e.key == 0) {
					uni.showToast({
						title: '打印成功',
						duration: 2000
					});
				} else if (e.key == 3) {
					uni.showToast({
						title: '缺纸',
						duration: 2000
					});
				}
			});
			//打印机版本获取回调
			globalEvent.addEventListener('onVersion', function(e) {
				uni.showToast({
					title: 'version: ' + JSON.stringify(e),
					duration: 2000
				});
			});
			globalEvent.addEventListener('getsupportprint', function(e) {
				console.log('key: ' + JSON.stringify(e));
				uni.showToast({
					title: 'key: ' + JSON.stringify(e),
					duration: 2000
				});
			});
		},
		created: function(option) {},
		onHide: function() {},
		destroyed: function() {},
		methods: {
			initPrinter() {
				// 调用异步方法
				console.log('初始化');
				var ret = printer.initPrinter({});
				modal.toast({
					message: ret,
					duration: 1.5
				});
				printer.printEnableMark({
					enable: false
				});
				printer.setConcentration({ //设置打印浓度。font_level 取值范围：1~39。
					level: 39
				});
				printer.setLineSpacing({
					spacing: 1
				});
				printer.getsupportprint();
			},
			closePrinter() {
				// 调用同步方法
				console.log('关闭');
				printer.closePrinter();
			},
			printerLabel() {

				console.log('测试打印');

				printer.setFontSize({ //设置字体大小
					fontSize: 0
				});
				printer.setTextBold({ //设置字体是否加粗
					bold: true
				});

				printer.printText({
					content: '垃圾收运小票凭证'
				});
				printer.printLine({ //走纸 1 行
					line_length: 1
				});
				printer.printText({
					content: 'asdads'
				});
				printer.printLine({ //走纸 1 行
					line_length: 1
				});

				console.log('测试打印QR');
				printer.printQR({
					text: 'title',
					height: 400,
					offset: 1
				});
				printer.printLine({ //走纸 1 行
					line_length: 2
				});

				printer.start();
				console.log('测试打印QR结束');
			},
			printerText() {
				console.log('打印');

				printer.setFontSize({
					fontSize: 0
				});
				printer.setTextBold({
					bold: true
				});

				printer.printText({
					content: '这是一张测试小票'
				});
				printer.setTextBold({
					bold: false
				});
				printer.printLine({
					line_length: 1
				});

				printer.printText({
					content: 'commodity'
				});
				printer.printLine({
					line_length: 1
				});

				printer.printText({
					content: 'Quantity'
				});
				printer.printLine({
					line_length: 1
				});
				printer.printText({
					content: 'unit price'
				});
				printer.printLine({
					line_length: 1
				});

				printer.printBarcode({
					text: '123456',
					height: 80,
					barcodeType: 73
				});
				printer.printLine({
					line_length: 1
				});
				printer.printQR({
					text: '1234456',

				});
				printer.printLine({
					line_length: 2
				});
				printer.start();

			},
			printLabel() {
				printer.printBarcode({
					text: 1234567890123456789,
					height: 80,
					barcodeType: 73
				})
				printer.printLine({
					line_length: 5
				});
				printer.printGoToNextMark();
			}
		}
	};
</script>

<style></style>
