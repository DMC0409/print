<template>
	<view class="box">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="water">
			<view class="water-c">
				<view class="water-list water-1"></view>
				<view class="water-list water-2"></view>
				<view class="water-list water-3"></view>
			</view>
		</view>
		<view class="baseInfo flex justify-between align-end">
			<view class="leftPart">
				<view class="name flex align-center">
					<i class="iconfont iconrenyuanbaozhang"></i>
					<text>{{userInfo.chname}}</text>
				</view>
				<view class="flex align-center">
					<i class="iconfont icondianhua"></i>
					<text>{{userInfo.account}}</text>
				</view>
			</view>
			<view class="rightPart">
				<view class="name">{{loginSystemInfo.system_name}}</view>
				<view>No.{{loginUserInfo.jobnum}}</view>
			</view>
		</view>
		<view class="menu flex">
			<view class="eachMenu flex align-center justify-center" @click="item.fun" v-for="(item,index) in menuList"
				:key="index">
				<view class="topMenu flex align-center justify-between">
					<view class="nameMenu">
						{{item.name}}
					</view>
					<i class="iconfont" :class="item.icon"></i>
				</view>
				<view class="bottonMenu">
					{{item.Ename}}
				</view>
			</view>
		</view>
		<view class="version">
			Version:{{appVersion}}
		</view>
		<uni-popup ref="popup" type="top">
			<view class="popOut">
				<view class="eachOper" @click="logOut">
					退出系统
				</view>
				<view class="eachOper" @click="toConsoleLog">
					{{adjustSwitch?'关闭调试':'开启调试'}}
				</view>
				<view class="eachOper" @click="selPaper">
					设置纸张类型
				</view>
				<view class="eachOper" @click="cancel">
					取消
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				menuList: [{
					name: '打印订单',
					icon: "icongongdan",
					Ename: 'Order',
					fun: this.toPrint
				}, {
					name: '历史记录',
					icon: "iconlishixiao",
					Ename: 'History',
					fun: this.toHistory
				}, {
					name: '打印送货单',
					icon: "iconsonghuo",
					Ename: 'Delivery',
					fun: this.toDelivery
				}, {
					name: '送货单记录',
					icon: "iconjilu",
					Ename: 'Record',
					fun: this.toDeliveryHistory
				}, {
					name: '更新信息',
					icon: "icongengxin",
					Ename: 'Update',
					fun: this.updateInfo
				}, {
					name: '其他设定',
					icon: "iconshezhi",
					Ename: 'Other',
					fun: this.toSet
				}],
				userInfo: uni.getStorageSync('userInfo'),
				loginUserInfo: uni.getStorageSync('loginUserInfo'),
				loginSystemInfo: uni.getStorageSync('loginSystemInfo'),
				otherVisible: true,
				appVersion: ''
			}
		},
		onLoad() {
			// 获取APP版本信息
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				this.appVersion = wgtinfo.version;
			})
			// #endif
			// 初始化纸张类型
			if (!uni.getStorageSync('paperType')) {
				uni.setStorageSync('paperType', 0)
			}
			// 初始化延时时间
			if (!uni.getStorageSync('delayTime')) {
				uni.setStorageSync('delayTime', 15000)
			}
			// 初始化打印单据条数
			if (!uni.getStorageSync('eachPage')) {
				uni.setStorageSync('eachPage', 4)
			}
		},
		mounted() {
			if (!uni.getStorageSync('baseInfo')) {
				this.updateInfo(true)
			}
			this.checkVersion()
		},
		computed: {
			...mapState(['adjustSwitch'])
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL', 'UPADTE_ADJUST', 'UPDATE_CONSOLE']),
			// 检查版本信息
			checkVersion() {
				this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_padMobileDeviceClass',
							need_type: 'getPadVersionFun',
							mySysId: this.loginSystemInfo.database_name,
						}
					}).then(res => {
						console.log(res)
						plus.runtime.getProperty(plus.runtime.appid, (appData) => {
							console.log(appData)
							// 版本不同则进行更新
							let url = res.data.data.downloadLink
							if (res.data.data.versionNum != appData.version) {
								// 下载更新文件
								uni.downloadFile({
									url,
									success: (res) => {
										if (res.statusCode != 200) {
											// 提示下载安装包失败
											this.UPDATE_TIPMODAL({
												isShow: true,
												tipText: '下载安装包失败', // 提示信息
												tipIcon: 'iconshibai', // 图标名称
												mark: true, // 是否有蒙版
												duration: 2000, // 持续时间
												mode: 'self' // 弹窗模式
											})
											return
										}
										// 安装更新文件
										plus.runtime.install(res.tempFilePath, {
												force: true
											},
											() => {
												uni.showModal({
													title: '程序已更新是否重启',
													success: (res) => {
														if (res.confirm) {
															plus.runtime.restart()
														}
													}
												})
											}, (err) => {
												uni.showModal({
													title: '更新失败',
													content: err.message,
													showCancel: false
												})
											})
									}
								})
							}
						})
					})
					.catch(err => {
						console.log(err)
					})
			},
			toPrint() {
				uni.navigateTo({
					url: '../print/index'
				})
			},
			toSet() {
				this.$refs.popup.open('bottom')
			},
			toHistory() {
				uni.navigateTo({
					url: '../unfinish/index'
				})
			},
			toDelivery() {
				uni.navigateTo({
					url: '../delivery/index'
				})
			},
			toDeliveryHistory() {
				uni.navigateTo({
					url: '../deliveryList/index'
				})
			},
			logOut() {
				uni.clearStorageSync();
				// 跳转至首页
				uni.reLaunch({
					url: '../login/index'
				})
			},
			toConsoleLog() {
				this.UPADTE_ADJUST(!this.adjustSwitch)
				if (!this.adjustSwitch) {
					this.UPDATE_CONSOLE([])
				}
				this.cancel()
			},
			updateInfo(status) {
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_padMobileDeviceClass',
						need_type: 'reloadBaseInfo',
						mySysId: this.loginSystemInfo.database_name,
						loginsession: this.loginUserInfo.logincodewx,
						loginsession_main: this.userInfo.logincodewx,
					}
				}).then(res => {
					let deaUser = []
					// 获得可选用户信息，添加用户排序下标
					for (let i in res.data.data.buyerList) {
						res.data.data.buyerList[i].sortNum = Number(i)
						deaUser.push(res.data.data.buyerList[i])
					}
					res.data.data.buyerList = deaUser
					// 构建可选加工类型子菜单数组对象结构
					let contentArr = []
					for (let i of res.data.data.typeList) {
						if (i.main_src_material_type_id == '0') {
							let obj = i
							obj.child = []
							contentArr.push(i)
						}
					}
					// 匹配可选子菜单数组对象数据
					for (let i of res.data.data.typeList) {
						for (let j of contentArr) {
							if (i.main_src_material_type_id == j.src_material_type_id) {
								j.child.push(i)
							}
						}
					}
					// 添加排序下标
					for (let i of contentArr) {
						for (let j in i.child) {
							i.child[j].sortNum = Number(j)
						}
					}
					res.data.data.typeList = contentArr
					uni.setStorageSync('baseInfo', res.data.data)
					if (!status) {
						// 主动更新
						this.UPDATE_TIPMODAL({
							isShow: true,
							tipText: '更新成功', // 提示信息
							tipIcon: 'iconchenggong', // 图标名称
							mark: true, // 是否有蒙版
							duration: 2000, // 持续时间
							mode: 'self' // 弹窗模式
						})
					}
					this.cancel()
				}, () => {})
			},
			selPaper() {
				// 跳转至纸张选择页
				uni.navigateTo({
					url: '../selPaper/index'
				})
				this.cancel()
			},
			cancel() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes wave-animation-1 {
		0% {
			background-position: 0 top
		}

		100% {
			background-position: 600px top
		}
	}

	@keyframes wave-animation-2 {
		0% {
			background-position: 0 top
		}

		100% {
			background-position: 600px top
		}
	}

	@keyframes wave-animation-3 {
		0% {
			background-position: 0 top
		}

		100% {
			background-position: 600px top
		}
	}

	.box {
		width: 100vw;
		height: 100vh;
		position: relative;

		.popOut {
			width: 100%;
			background-color: #fff;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;

			.eachOper {
				width: 100%;
				height: 120rpx;
				line-height: 120rpx;
				text-align: center;
				border-bottom: 4rpx solid #e2e2e2;
				font-size: 18px;

				&:last-child {
					border-bottom: none;
					border-top: 20rpx solid #e2e2e2;
				}
			}
		}

		.baseInfo {
			position: relative;
			width: 90%;
			height: 20%;
			margin: 0 auto;
			color: #fff;

			.leftPart,
			.rightPart {
				i {
					padding-right: 5px;
				}

				.name {
					padding-bottom: 10px;
				}
			}
		}

		.menu {
			width: 90%;
			margin: 10% auto;
			flex-wrap: wrap;

			.eachMenu {
				width: 45%;
				padding: 7% 0;
				margin: 2%;
				background: rgba(255, 255, 255, .9);
				box-shadow: 0 0.4rem 0.4rem rgba(11, 48, 107, .1);
				border-radius: 5px;
				border: 1px solid #e8e8e8;
				flex-direction: column;
				color: #633a97;

				.topMenu {
					width: 85%;

					.nameMenu:first-letter {
						font-size: 40rpx;
					}

					i {
						font-size: 50rpx;
					}
				}

				.bottonMenu {
					margin-top: 10%;
					width: 85%;

					&:first-letter {
						font-weight: 800;
						font-size: 40rpx;
					}
				}
			}
		}

		.version {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			margin: 0 auto;
			text-align: center;
		}

		.water {
			position: absolute;
			left: 0;
			top: 0px;
			height: 19rem;
			width: 100%;
			z-index: -1;
			background: none;
			background-color: #633a97 !important;
			background: linear-gradient(60deg, #633a97 0, #4c87c6 100%) !important;

			.water-c {
				position: absolute;
				top: 15.4rem;
				width: 100%;
				background-color: #633a97 !important;
				background: linear-gradient(60deg, #633a97 0, #4c87c6 100%) !important;
			}

			.water-1 {
				background: url("https://easydeer-www.oss-cn-hangzhou.aliyuncs.com/xcx/img/wave-white/wave-1.png") repeat-x;
				background-size: 600px;
				-webkit-animation: wave-animation-1 3.5s infinite linear;
				animation: wave-animation-1 3.5s infinite linear
			}

			.water-2 {
				top: 5px;
				background: url("https://easydeer-www.oss-cn-hangzhou.aliyuncs.com/xcx/img/wave-white/wave-2.png") repeat-x;
				background-size: 600px;
				-webkit-animation: wave-animation-2 6s infinite linear;
				animation: wave-animation-2 6s infinite linear
			}

			.water-3 {
				background: url("https://easydeer-www.oss-cn-hangzhou.aliyuncs.com/xcx/img/wave-white/wave-1.png") repeat-x;
				background-size: 600px;
				-webkit-animation: wave-animation-1 1.5s infinite linear;
				animation: wave-animation-1 1.5s infinite linear
			}

			.water-1,
			.water-2,
			.water-3 {
				position: absolute;
				width: 100%;
				height: 60px
			}
		}
	}
</style>