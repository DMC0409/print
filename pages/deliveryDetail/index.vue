<template>
	<view class="pageOut">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="orderOut">
			<view class="eachOrder">
				<view class="other" v-if="orderDetail.mainTitle!=''">
					{{orderDetail.mainTitle}}
				</view>
			</view>
			<view class="eachOrder">
				<view class="other" v-if="orderDetail.mainDesc!=''">
					{{orderDetail.mainDesc}}
				</view>
			</view>
			<view class="eachOrder" v-if="orderDetail.showMainInfo!=''">
				<view class="other">
					{{orderDetail.showMainInfo}}
				</view>
			</view>
			<button class="addOrderCss" @click="addOrder">+追加明细</button>
			<view class="eachOrder" v-for="(item,index) in orderDetail.childDataList" :key="index"
				@click="operate(index)">
				<view class="title">
					{{item.title}}
				</view>
				<view class="desc">
					{{item.info}}
				</view>
				<view class="desc">
					{{item.desc}}
				</view>
				<view class="more">
					{{item.more}}
				</view>
			</view>
			<view class="eachOrder" v-if="orderDetail.mainBottom!=''">
				<view class="other textBottom">
					{{orderDetail.mainBottom}}
				</view>
			</view>
		</view>
		<view class="edit flex" v-if="isEdit">
			<button class="save" @click="save">保存</button>
			<button class="print" @click="toPrint">打印</button>
		</view>
		<view class="edit" v-else>
			<button class="create" @click="save">创建</button>
		</view>
		<!-- 添加订单弹窗 -->
		<uni-popup ref="inputDialog">
			<view class="popup-content">
				<view class="popTitle">
					追加订单号
				</view>
				<input type="number" placeholder="请输入订单号" v-model="newOrder" @confirm="dialogInputConfirm"
					:focus="focus">
				<view class="operPop flex align-center justify-between">
					<view class="cancel flex align-center justify-center" @click="cancelAdd">
						取消
					</view>
					<view class="sure flex align-center justify-center" @click="dialogInputConfirm">
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
		<!-- 打印确认弹窗 -->
		<uni-popup ref="printDialog" type="dialog">
			<uni-popup-dialog type="warn" cancelText="取消" confirmText="确定" :title="orderDetail.mainTitle"
				content="您是否打印本记录" @confirm="print" @close="printClose"></uni-popup-dialog>
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
				orderDetail: [],
				config_table_id: null,
				linkBaseData: null,
				allHead: [],
				operateNum: -1,
				// 删除弹窗标题
				deleteTitle: '',
				source: null,
				delete_child_id_list: [],
				isEdit: true,
				newOrder: '',
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
			if (JSON.parse(options.edit)) {
				this.isEdit = true
			} else {
				this.isEdit = false
			}
			this.source = JSON.parse(options.deliveryData)
			this.allHead = [
				...this.source.formHeadTopList,
				...this.source.formHeadBottomList
			]
			this.orderDetail = this.$devliveryUtils.showFormTableDataProcessingFun(this.allHead, this.source
				.formHeadCenterList, this.source.mainInfo)
			uni.setNavigationBarTitle({
				title: 'No.:' + this.source.mainInfo.form_table_index
			})
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
				}, () => {})
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL']),
			...mapActions(['initPrinter']),
			operate(index) {
				this.operateNum = index
				this.deleteTitle = this.orderDetail.childDataList[index].title
				this.$refs.alertDialog.open()
			},
			addOrder() {
				this.$refs.inputDialog.open('center')
			},
			cancelAdd() {
				this.newOrder = ''
				this.$refs.inputDialog.close()
			},
			dialogInputConfirm() {
				let result = this.$devliveryUtils.returnSetAllDataFun(this.allHead, this.source
					.formHeadCenterList, this.source.mainInfo)
				this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_padMobileDeviceClass',
							need_type: 'getOrderOneTableInfoWhenInportFun',
							mySysId: this.loginSystemInfo.database_name,
							loginsession: this.loginUserInfo.logincodewx,
							loginsession_main: this.userInfo.logincodewx,
							config_table_id: this.config_table_id,
							order_index: this.newOrder,
							config_form_table_data_link_id: this.linkBaseData.linkInfo.config_form_table_data_link_id,
							config_form_table_id: this.linkBaseData.linkInfo.config_form_table_id,
							main_info: result.data.returnMainInfo
						}
					})
					.then((res) => {
						this.source.mainInfo.childDataList.push(res.data.data.newInfo)
						this.orderDetail = this.$devliveryUtils.showFormTableDataProcessingFun(this.allHead, this
							.source
							.formHeadCenterList, this.source.mainInfo)
						this.cancelAdd()
					}, () => {
						this.cancelAdd()
					})
			},
			save() {
				let result = this.$devliveryUtils.returnSetAllDataFun(this.allHead, this.source
					.formHeadCenterList, this.source.mainInfo)
				if (result.sign == 1) {
					// 保存订单
					this.$api({
							url: '/api/data.php',
							method: 'post',
							data: {
								api_class: 'Open_padMobileDeviceClass',
								need_type: 'setFormTableDataInfoFun',
								mySysId: this.loginSystemInfo.database_name,
								loginsession: this.loginUserInfo.logincodewx,
								loginsession_main: this.userInfo.logincodewx,
								config_form_table_id: this.linkBaseData.linkInfo.config_form_table_id,
								main_info: result.data.returnMainInfo,
								updata_child_list: result.data.returnUpdataChildList,
								delete_child_id_list: this.delete_child_id_list,
								add_child_list: result.data.returnAddChildList
							}
						})
						.then((res) => {
							// 获取订单详情数据
							return this.$api({
								url: '/api/data.php',
								method: 'post',
								data: {
									api_class: 'Deer_formDataListMainClass',
									need_type: 'getFormTableDataMainInfo',
									mySysId: this.loginSystemInfo.database_name,
									loginsession: this.loginUserInfo.logincodewx,
									loginsession_main: this.userInfo.logincodewx,
									kyle_data: JSON.stringify({
										ftb_main_auto_id: this.source.mainInfo.ftb_main_auto_id,
										config_form_table_id: this.linkBaseData.linkInfo
											.config_form_table_id
									})

								}
							})
						}).then((res) => {
							this.source = res.data.data
							this.allHead = [
								...this.source.formHeadTopList,
								...this.source.formHeadBottomList
							]
							this.orderDetail = this.$devliveryUtils.showFormTableDataProcessingFun(this.allHead, this
								.source
								.formHeadCenterList, this.source.mainInfo)
							this.isEdit = true
							this.UPDATE_TIPMODAL({
								isShow: true,
								tipText: '保存成功', // 提示信息
								tipIcon: 'iconchenggong', // 图标名称
								mark: true, // 是否有蒙版
								duration: 2000, // 持续时间
								mode: 'self' // 弹窗模式
							})
						}, () => {})
				} else {
					this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '数据解析错误', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
			},
			toPrint() {
				this.$refs.printDialog.open()
			},
			printClose() {
				this.$refs.printDialog.close()
			},
			print() {
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
							ftb_main_auto_id: this.source.mainInfo.ftb_main_auto_id,
							print_form_page_num: uni.getStorageSync('eachPage')
						}
					})
					.then((res) => {
						this.$Utils.printDelivery(res.data.data.printInfo)
					}, () => {})
			},
			dialogClose() {
				this.$refs.alertDialog.close()
			},
			dialogConfirm() {
				if (this.source.mainInfo.childDataList[this.operateNum].ftb_child_auto_id) {
					this.delete_child_id_list.push(this.source.mainInfo.childDataList[this.operateNum].ftb_child_auto_id)
				}
				this.source.mainInfo.childDataList.splice(this.operateNum, 1)
				this.orderDetail.childDataList.splice(this.operateNum, 1)
			},
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
			height: 83vh;
			position: absolute;
			bottom: 120rpx;
			overflow: auto;

			.addOrderCss {
				width: 90%;
				background-color: #39b54a;
				margin-bottom: 30rpx;
				color: #fff;
			}

			.eachOrder {
				width: 90%;
				margin: 0 auto 30rpx auto;
				background: rgba(250, 250, 250, 0.9);
				box-shadow: 0 0.4rem 0.4rem rgba(11, 48, 107, .1);
				border-radius: 5px;
				border: 1px dashed #747474;

				view {
					padding: 5rpx 30rpx;
				}

				.title {
					color: #000;
					font-size: 45rpx;
				}

				.desc {
					color: #000;
					font-size: 35rpx;
				}

				.more {
					font-size: 35rpx;
					color: #555;
				}

				.other {
					color: #000;
					font-size: 35rpx;
				}

				.textBottom {
					background-color: #ccc;
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

			.save,
			.print {
				width: 95%;
				margin: 20rpx;
				background-color: #4683f0;
			}

			.print {
				background-color: #fa6600;
			}

			.create {
				width: 95%;
				margin: 20rpx;
				background-color: #39b54a;
			}
		}

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
	}
</style>