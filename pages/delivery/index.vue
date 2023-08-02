<template>
	<view class="pageOut">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<block v-if="info_userout_company_id!=''">
			<view class="orderOut">
				<view class="eachInfo flex align-center">
					<view class="company flex justify-center">企业：{{info_userout_company_id==''?'未选择':judgeUser()}}
					</view>
					<!-- <view class="toSel flex align-center justify-center" @click="jumpToSel">
						选择企业
					</view> -->
				</view>
				<view class="eachOrder" v-for="(item,index) in orderList" :key="index" @click="toEdit(item,index)">
					<i class="iconfont iconshibai" @click.stop="toDelete(index)"></i>
					<view class="title">
						{{item.showInfo.title}}
					</view>
					<view class="topTip">
						{{item.showInfo.info}}
					</view>
					<view class="desc">
						{{item.showInfo.desc}}
					</view>
					<view class="more">
						{{item.showInfo.more}}
					</view>
				</view>
			</view>
			<view class="edit flex">
				<button class="addOrderCss" @click="addOrder">+添加明细</button>
				<button class="save" @click="submitDeliveryOrder">提交订单</button>
			</view>
		</block>
		<block v-else>
			<view v-if="!createData" class="fullScreen flex align-start justify-center">
				<view class="showOut flex justify-around align-center">
					<view class="topLine flex align-center">
						<i class="iconfont iconchenggong"></i>
						<view class="first">
							创建送货单
						</view>
						<view class="second">
							请先选择企业
						</view>
					</view>
					<view class="bottom">
						<button @click="jumpToSel">+立即选择</button>
						<view class="tip">
							选择后可以扫码获取信息
						</view>
					</view>
				</view>
			</view>
			<view v-else class="fullScreen flex align-start justify-center">
				<view class="creatOut flex justify-around align-center">
					<view class="createLine flex align-center justify-center">
						<i class="iconfont iconchenggong"></i>
					</view>
					<view class="mainContent">
						<view class="mainTitle flex align-center justify-center">
							<view>成功创建送货单</view>
							<view>No.{{orderDetail.form_table_index}}</view>
						</view>
						<view class="createList flex justify-center align-start">
							<view class="title">
								{{orderDetail.mainTitle}}
							</view>
							<view class="desc">
								{{orderDetail.showMainInfo}}
							</view>
							<view class="desc">
								{{orderDetail.mainDesc}}
							</view>
							<view class="more">
								{{orderDetail.mainBottom}}
							</view>
						</view>
						<view class="operate flex align-center">
							<view class="checkDetail" @click="toDetaiil">
								查看详情
							</view>
							<view class="" @click="toPrint">
								直接打印
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="second">
							您还想再次创建，请重新选择企业
						</view>
						<button @click="jumpToSel">+立即选择</button>
						<view class="tip">
							选择后可以扫码获取信息
						</view>
					</view>
				</view>
			</view>
		</block>
		<!-- 添加订单弹窗 -->
		<uni-popup ref="inputDialog">
			<view class="popup-content">
				<view class="popTitle">
					添加订单号
				</view>
				<input type="number" placeholder="请输入订单号" v-model="order_index" @confirm="checkOrderInfo"
					:focus="focus">
				<view class="operPop flex align-center justify-between">
					<view class="cancel flex align-center justify-center" @click="cancelAdd">
						取消
					</view>
					<view class="sure flex align-center justify-center" @click="checkOrderInfo">
						确认
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 删除确认弹窗 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" cancelText="取消" confirmText="确定" :title="deleteTitle" content="您是否删除本记录"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	var globalEvent = uni.requireNativePlugin('globalEvent');
	export default {
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo'),
				loginUserInfo: uni.getStorageSync('loginUserInfo'),
				loginSystemInfo: uni.getStorageSync('loginSystemInfo'),
				orderList: [],
				// orderList: [{
				// 	showInfo: {
				// 		title: "123",
				// 		desc: 'sdf',
				// 		more: 'jnonn'
				// 	}
				// }],
				config_table_id: '',
				baseInfo: uni.getStorageSync('baseInfo'),
				// 企业号
				info_userout_company_id: '',
				// 生产号
				order_index: '',
				// 生产号与送货单关联基础数据
				linkBaseData: null,
				operateNum: -1,
				// 删除订单标题
				deleteTitle: '',
				// 创建成功返回的数据
				createData: null,
				// 创建完需显示的数据
				orderDetail: null,
				focus: true
			}
		},
		computed: {
			...mapState(['printer'])
		},
		onLoad(options) {
			if (this.printer == null) {
				// 初始化打印机
				this.initPrinter()
			}
			let _this = this
			// 添加打印状态监听
			globalEvent.addEventListener('onPrintCallback', function(e) {
				_this.$Utils.judgePrintErr(e.key)
			});
		},
		mounted() {
			// 获取系统基本参数
			this.$api({
				url: '/api/data.php',
				method: 'post',
				data: {
					api_class: 'Open_padMobileDeviceClass',
					need_type: 'getMainGroupInitFun',
					mySysId: this.loginSystemInfo.database_name,
					loginsession: this.loginUserInfo.logincodewx,
					loginsession_main: this.userInfo.logincodewx,
				}
			}).then(res => {
				this.config_table_id = res.data.data.tableInfo.config_table_id
			}, () => {})
			// 获取关联基本参数
			this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_padMobileDeviceClass',
						need_type: 'getOrderSendFormTableFun',
						mySysId: this.loginSystemInfo.database_name,
						loginsession: this.loginUserInfo.logincodewx,
						loginsession_main: this.userInfo.logincodewx,
					}
				})
				.then((res) => {
					this.linkBaseData = res.data.data
					uni.setNavigationBarTitle({
						title: this.linkBaseData.linkInfo.form_table_name
					})
				}, () => {})
		},
		onShow() {
			if (uni.getStorageSync('updateInfo')) {
				let updateInfo = uni.getStorageSync('updateInfo')
				// 使用js工具转换显示内容
				let showData = this.$devliveryUtils.showGroupTableDataProcessingFun(updateInfo.tableHeadList, updateInfo
					.dataInfo[0])
				this.orderList[this.operateNum] = {
					dataInfo: updateInfo.dataInfo[0],
					showInfo: showData
				}
				this.$forceUpdate()
				uni.removeStorageSync('updateInfo')
			}
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL']),
			...mapActions(['initPrinter']),
			checkOrderInfo() {
				if (this.info_userout_company_id == '') {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '请选择企业', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
				// 判断order_index是否已存在
				for (let i of this.orderList) {
					if (this.order_index == i.dataInfo.order_index) {
						this.cancelAdd()
						return this.UPDATE_TIPMODAL({
							isShow: true,
							tipText: '订单号已存在列表中', // 提示信息
							tipIcon: 'iconshibai', // 图标名称
							mark: true, // 是否有蒙版
							duration: 2000, // 持续时间
							mode: 'self' // 弹窗模式
						})
					}
				}
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_padMobileDeviceClass',
						need_type: 'getOrderOneTableInfoBySearchFun',
						mySysId: this.loginSystemInfo.database_name,
						loginsession: this.loginUserInfo.logincodewx,
						loginsession_main: this.userInfo.logincodewx,
						config_table_id: this.config_table_id,
						order_index: this.order_index
					}
				}).then(res => {
					if (res.data.data.dataInfo.userout_a_id == this.info_userout_company_id) {
						this.orderList.push(res.data.data)
					} else {
						this.UPDATE_TIPMODAL({
							isShow: true,
							tipText: '订单号不属于已选择企业', // 提示信息
							tipIcon: 'iconshibai', // 图标名称
							mark: true, // 是否有蒙版
							duration: 3000, // 持续时间
							mode: 'self' // 弹窗模式
						})
					}
					this.cancelAdd()
				}, () => {})
			},
			submitDeliveryOrder() {
				if (this.info_userout_company_id == '') {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '请选择企业', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
				let src_tb_auto_id_list = []
				for (let i of this.orderList) {
					src_tb_auto_id_list.push(i.dataInfo.tb_auto_id)
				}
				this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_padMobileDeviceClass',
							need_type: 'createNewFormTableByGroupTableFun',
							mySysId: this.loginSystemInfo.database_name,
							loginsession: this.loginUserInfo.logincodewx,
							loginsession_main: this.userInfo.logincodewx,
							info_userout_company_id: this.info_userout_company_id,
							src_tb_auto_id_list: src_tb_auto_id_list,
							config_form_table_data_link_id: this.linkBaseData.linkInfo.config_form_table_data_link_id,
							config_form_table_id: this.linkBaseData.linkInfo.config_form_table_id
						}
					})
					.then((res) => {
						this.info_userout_company_id = ''
						this.createData = JSON.stringify(res.data.data)
						this.orderDetail = this.$devliveryUtils.showFormTableDataProcessingFun(res.data.data
							.formHeadMainList, res.data.data.formHeadCenterList, res.data.data.mainInfo)
						this.orderDetail.form_table_index = res.data.data.mainInfo.form_table_index
					}, () => {})
			},
			toDetaiil() {
				uni.navigateTo({
					url: `../deliveryDetail/index?deliveryData=${this.createData}&edit=${true}`
				})
			},
			toPrint() {
				this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_padMobileDeviceClass',
							need_type: 'getFormPrintInfo',
							mySysId: this.loginSystemInfo.database_name,
							loginsession: this.loginUserInfo.logincodewx,
							loginsession_main: this.userInfo.logincodewx,
							config_form_table_id: this.linkBaseData.linkInfo.config_form_table_id,
							ftb_main_auto_id: JSON.parse(this.createData).mainInfo.ftb_main_auto_id,
							print_form_page_num: uni.getStorageSync('eachPage')
						}
					})
					.then((res) => {
						this.$Utils.printDelivery(res.data.data.printInfo)
					}, () => {})
			},
			toEdit(item, index) {
				this.operateNum = index
				uni.navigateTo({
					url: `../print/index?listInfo=${JSON.stringify(item.dataInfo)}`,
				})
			},
			addOrder() {
				this.$refs.inputDialog.open('center')
			},
			cancelAdd() {
				this.order_index = ''
				this.$refs.inputDialog.close()
			},
			dialogClose() {
				this.$refs.alertDialog.close()
			},
			dialogConfirm() {
				this.orderList.splice(this.operateNum, 1)
			},
			toDelete(index) {
				this.operateNum = index
				this.deleteTitle = this.orderList[this.operateNum].showInfo.title
				this.$refs.alertDialog.open()
			},
			jumpToSel() {
				// 重新选择企业，订单列表需重置
				this.orderList = []
				// 跳转选择企业页面
				uni.navigateTo({
					url: `../seluser/index?companyId=${this.info_userout_company_id}`,
				})
			},
			judgeUser() {
				for (let i of this.baseInfo.buyerList) {
					if (i.info_userout_company_id === this.info_userout_company_id) {
						return i.short_name
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.uni-popup .uni-popup__wrapper {
		// width: 100%;

		.popup-content {
			width: 70vw;
			margin: 0 auto;
			color: #000;
			background-color: #fff;
			border-radius: 20rpx;

			.popTitle {
				width: 100%;
				padding-top: 50rpx;
				text-align: center;
			}

			input {
				width: 80%;
				height: 80rpx;
				margin: 40rpx auto;
				border: 1px solid #f5f5f5;
				border-radius: 10rpx;
				padding-left: 20rpx;
			}

			.operPop {
				width: 100%;
				border-top: 1px solid #f5f5f5;

				view {
					width: 50%;
					height: 80rpx;
				}

				.cancel {
					border-right: 1px solid #f5f5f5;
				}

				.sure {
					color: #4683f0;
				}
			}
		}
	}
</style>
<style lang="scss" scoped>
	.pageOut {
		width: 100vw;
		height: 100vh;
		position: relative;

		.orderOut {
			width: 100vw;
			height: 80vh;
			position: absolute;
			bottom: 10vh;
			overflow: auto;

			.eachInfo {
				height: 70rpx;
				margin: 0 5% 3% 5%;
				border-radius: 10rpx;
				color: #8b8c90;
				background-color: #f3f3f3;

				.company {
					width: 100%;
				}

				.toSel {
					width: 30%;
					height: 100%;
					font-size: 16px;
					font-weight: bold;
					text-align: center;
					border-top-right-radius: 8rpx;
					border-bottom-right-radius: 8rpx;
					box-shadow: 0 1rpx 6rpx rgba(114, 130, 138, 0.2);
					color: #ffffff;
					background-color: #39b54a;
				}
			}

			.eachOrder {
				width: 90%;
				margin: 0 auto 60rpx auto;
				background: rgba(250, 250, 250, 0.9);
				box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
				border-radius: 5px;
				position: relative;

				i {
					position: absolute;
					right: 0;
					top: 0;
					color: red;
					font-size: 60rpx;
				}

				view {
					width: 90%;
					margin: 0 auto;
					padding: 5rpx 0;
				}

				.title {
					color: #000;
					font-size: 40rpx;
					border-bottom: 1px solid #ebeef5;
				}

				.topTip {
					font-size: 35rpx;
				}

				.desc {
					color: #000;
					font-size: 35rpx;
				}

				.more {
					color: #555;
					font-size: 33rpx;
				}
			}

			button {
				width: 95%;
				font-weight: bold;
				margin-bottom: 15px;
			}
		}

		.fullScreen {
			width: 100vw;
			height: 90vh;
			position: absolute;
			bottom: 0;

			.showOut,
			.creatOut {
				width: 70%;
				height: 60%;
				flex-direction: column;

				.topLine {
					width: 100%;
					height: 40%;
					flex-direction: column;

					i {
						font-size: 100rpx;
						color: #39b54a;
						margin-bottom: 60rpx;
					}

					.first {
						font-size: 40rpx;
						font-weight: bolder;
						margin-bottom: 40rpx;
					}

					.second {
						font-size: 30rpx;
					}
				}

				.bottom {
					text-align: center;
					margin-top: 60rpx;

					.tip {
						font-size: 25rpx;
						color: #444;
						margin-top: 20rpx;
					}

					button {
						width: 250rpx;
						background-color: #39b54a;
						color: #fff;
						margin-top: 20rpx;
					}
				}
			}

			.creatOut {
				width: 80%;
				height: 70%;

				.createLine {
					width: 100%;
					height: 80rpx;
					padding-top: 20rpx;

					i {
						font-size: 100rpx;
						color: #39b54a;
						margin-bottom: 60rpx;
					}
				}

				.mainContent {
					width: 100%;
					height: 60%;
					border: 1px dashed #747474;
					border-radius: 10rpx;

					.mainTitle {
						width: 95%;
						height: 120rpx;
						font-weight: bold;
						flex-direction: column;
					}

					.createList {
						width: 90%;
						height: 60%;
						margin: 0 auto;
						border-top: 1px dashed #747474;
						border-bottom: 1px dashed #747474;
						flex-direction: column;

						view {
							margin-bottom: 20rpx;
						}

						.title {
							color: #000;
							font-size: 38rpx;
						}

						.desc {
							color: #000;
							font-size: 35rpx;
						}

						.more {
							font-size: 35rpx;
							color: #555;
							font-weight: bold;
						}
					}

					.operate {
						width: 100%;
						height: 100rpx;
						line-height: 80rpx;

						view {
							width: 50%;
							height: 80%;
							text-align: center;
						}

						.checkDetail {
							border-right: 1px solid #747474;
						}
					}
				}
			}
		}

		.edit {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;

			button {
				color: #fff;
			}

			.addOrderCss {
				width: 35%;
				background-color: #39b54a;
				margin: 20rpx 0 20rpx 20rpx;
				color: #fff;
			}

			.save {
				width: 60%;
				margin: 20rpx;
				background-color: #4683f0;
			}
		}
	}
</style>