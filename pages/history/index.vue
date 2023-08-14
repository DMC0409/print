<template>
	<view class="pageOut">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<uni-popup ref="popup" type="top">
			<view class="popOut">
				<view class="eachOper" @click="toChange">
					修改订单
				</view>
				<view class="eachOper" @click="toPrint">
					打印
				</view>
				<view class="eachOper" @click="deleteOrder">
					删除
				</view>
				<view class="eachOper" @click="cancel">
					取消
				</view>
			</view>
		</uni-popup>
		<view class="hisOut">
			<block v-for="(item,index) in listData" :key="index">
				<view class="order-list-item flex" :class="orderIndex == index?' item-selected':''"
					@click.stop="showPopup(item,index)">
					<view class="order-tags" v-if="item.mobsop_line_data_title"
						:style="'background-color:'+item.mobsop_line_data_bgcolor+';'">
						{{item.mobsop_line_data_title}}
					</view>
					<view :style="item.mobsop_line_data_title?'':'margin-left:1vw;'">
						<view :class="orderIndex == index?'item-binahao':''">
							{{'No.'+item.order_index}} -
							{{item.company_name_str=='-'?item.order_title:item.company_name_str}}
						</view>
						<view>{{item.descA}}</view>
						<view>{{item.descB}}</view>
						<view>{{item.descC}}</view>
						<view>{{item.descD}}</view>
						<view>{{item.descE}}</view>
						<view>{{item.descF}}</view>
					</view>
				</view>
			</block>
		</view>
		<uni-pagination class="page" :show-icon="true" :total="total" :current="page" :pageSize="pageSize"
			@change="updatePage($event)"></uni-pagination>
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
				baseInfo: uni.getStorageSync('baseInfo'),
				config_table_id: '',
				listData: [],
				selOrder: null,
				orderIndex: -1,
				userout_a_id: uni.getStorageSync('companyInfo') ? uni.getStorageSync('companyInfo').userout_a_id : '',
				page: 1,
				total: 0,
				pageSize: 0
			}
		},
		computed: {
			...mapState(['printer'])
		},
		onLoad: function(options) {
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
		onShow() {
			uni.setNavigationBarTitle({
				title: `历史记录(${uni.getStorageSync('paperType')==0?'不干胶':'热敏纸'})`
			})
			if (uni.getStorageSync('updateInfo')) {
				let updateInfo = uni.getStorageSync('updateInfo')
				//处理一下表单表头数据
				let getDataList = this.$tableUtils.processingTableData('normal', [updateInfo.dataInfo[0]], updateInfo
					.tableHeadList);
				for (let index in getDataList) {
					var dataInfo = getDataList[index];
					dataInfo.descA = ''
					dataInfo.descB = ''
					dataInfo.descC = ''
					dataInfo.descD = ''
					dataInfo.descE = ''
					dataInfo.descF = ''
					//如果后台没有返回颜色那么这里就要用是否完成来判断，当前返回给前端是是否完成
					if (dataInfo['mobsop_line_data_bgcolor'] == undefined || dataInfo[
							'mobsop_line_data_title'
						] ==
						undefined) {
						if (dataInfo['do_status'] != '1') {
							dataInfo['mobsop_line_data_bgcolor'] = '#ababec';
							dataInfo['mobsop_line_data_title'] = '未完成'
						} else if (dataInfo['do_status'] == '1') {
							dataInfo['mobsop_line_data_bgcolor'] = 'green';
							dataInfo['mobsop_line_data_title'] = '完成'
						}
					}
					for (let key in updateInfo.tableHeadList) {
						var headInfo = updateInfo.tableHeadList[key];
						if (typeof(headInfo['comm_set_json']) == 'string') {
							headInfo['comm_set_json'] = JSON.parse(headInfo['comm_set_json']);
						}

						//标题
						if (typeof(headInfo['comm_set_json']['user_head_show_title_mob']) != "undefined") {
							if (dataInfo['title'] != '') {
								dataInfo['title'] += " | ";
							}
							dataInfo['title'] += dataInfo['th_' + headInfo['config_table_head_id']] ?
								dataInfo[
									'th_' + headInfo['config_table_head_id']] : '';
						}
						//第一级
						if (typeof(headInfo['comm_set_json']['user_head_show_desc_a_mob']) !=
							"undefined") {
							if (dataInfo['descA'] != '') {
								dataInfo['descA'] += " | ";
							}
							if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
								dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
							}
							dataInfo['descA'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
								headInfo[
									'config_table_head_id']] || '-');
						}

						if (typeof(headInfo['comm_set_json']['user_head_show_desc_b_mob']) !=
							"undefined") {
							if (dataInfo['descB'] != '') {
								dataInfo['descB'] += " | ";
							}
							if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
								dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
							}
							dataInfo['descB'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
								headInfo[
									'config_table_head_id']] || '-');
						}

						if (typeof(headInfo['comm_set_json']['user_head_show_desc_c_mob']) !=
							"undefined") {
							if (dataInfo['descC'] != '') {
								dataInfo['descC'] += " | ";
							}
							if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
								dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
							}
							dataInfo['descC'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
								headInfo[
									'config_table_head_id']] || '-');
						}

						if (typeof(headInfo['comm_set_json']['user_head_show_desc_d_mob']) !=
							"undefined") {
							if (dataInfo['descD'] != '') {
								dataInfo['descD'] += " | ";
							}
							if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
								dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
							}
							dataInfo['descD'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
								headInfo[
									'config_table_head_id']] || '-');
						}
						if (typeof(headInfo['comm_set_json']['user_head_show_desc_e_mob']) !=
							"undefined") {
							if (dataInfo['descE'] != '') {
								dataInfo['descE'] += " | ";
							}
							if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
								dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
							}
							dataInfo['descE'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
								headInfo[
									'config_table_head_id']] || '-');
						}
						if (typeof(headInfo['comm_set_json']['user_head_show_desc_f_mob']) !=
							"undefined") {
							if (dataInfo['descF'] != '') {
								dataInfo['descF'] += " | ";
							}
							if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
								dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
							}
							dataInfo['descF'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
								headInfo[
									'config_table_head_id']] || '-');
						}
					}
					this.listData[this.orderIndex] = dataInfo
				}
				this.$forceUpdate()
				uni.removeStorageSync('updateInfo')
			}
		},
		mounted() {
			// 获取基本参数
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
				// 获取历史订单列表
				this.getHisList()
			}, () => {})
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL']),
			...mapActions(['initPrinter']),
			showPopup(item, index) {
				this.orderIndex = index
				this.selOrder = item
				this.$refs.popup.open('bottom')
			},
			updatePage(e) {
				this.page = e.current
				this.getHisList()
			},
			// 获取历史订单列表
			getHisList() {
				this.listData = []
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_padMobileDeviceClass',
						need_type: 'getOrderTableDataListFun',
						mySysId: this.loginSystemInfo.database_name,
						loginsession: this.loginUserInfo.logincodewx,
						loginsession_main: this.userInfo.logincodewx,
						config_table_id: this.config_table_id,
						userout_a_id: this.userout_a_id,
						page_name: this.page,
						setEveryPageNum: 20
					}
				}).then(res => {
						const {
							dataList
						} = res.data.data.dataInfo.list
						// 处理分页数据
						this.pageSize = res.data.data.dataInfo.list
							.everyPageContentNum
						// 一共有多少条记录
						this.total = res.data.data.dataInfo.list.row
						const {
							tableHeadList
						} = res.data.data
						//处理一下表单表头数据
						let getDataList = this.$tableUtils.processingTableData('normal', dataList, tableHeadList);
						for (let index in getDataList) {
							var dataInfo = getDataList[index];
							dataInfo.descA = ''
							dataInfo.descB = ''
							dataInfo.descC = ''
							dataInfo.descD = ''
							dataInfo.descE = ''
							dataInfo.descF = ''
							//如果后台没有返回颜色那么这里就要用是否完成来判断，当前返回给前端是是否完成
							if (dataInfo['mobsop_line_data_bgcolor'] == undefined || dataInfo[
									'mobsop_line_data_title'
								] ==
								undefined) {
								if (dataInfo['do_status'] != '1') {
									dataInfo['mobsop_line_data_bgcolor'] = '#ababec';
									dataInfo['mobsop_line_data_title'] = '未完成'
								} else if (dataInfo['do_status'] == '1') {
									dataInfo['mobsop_line_data_bgcolor'] = 'green';
									dataInfo['mobsop_line_data_title'] = '完成'
								}
							}
							for (let key in tableHeadList) {
								var headInfo = tableHeadList[key];
								if (typeof(headInfo['comm_set_json']) == 'string') {
									headInfo['comm_set_json'] = JSON.parse(headInfo['comm_set_json']);
								}

								//标题
								if (typeof(headInfo['comm_set_json']['user_head_show_title_mob']) != "undefined") {
									if (dataInfo['title'] != '') {
										dataInfo['title'] += " | ";
									}
									dataInfo['title'] += dataInfo['th_' + headInfo['config_table_head_id']] ?
										dataInfo[
											'th_' + headInfo['config_table_head_id']] : '';
								}
								//第一级
								if (typeof(headInfo['comm_set_json']['user_head_show_desc_a_mob']) !=
									"undefined") {
									if (dataInfo['descA'] != '') {
										dataInfo['descA'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									dataInfo['descA'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}

								if (typeof(headInfo['comm_set_json']['user_head_show_desc_b_mob']) !=
									"undefined") {
									if (dataInfo['descB'] != '') {
										dataInfo['descB'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									dataInfo['descB'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}

								if (typeof(headInfo['comm_set_json']['user_head_show_desc_c_mob']) !=
									"undefined") {
									if (dataInfo['descC'] != '') {
										dataInfo['descC'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									dataInfo['descC'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}

								if (typeof(headInfo['comm_set_json']['user_head_show_desc_d_mob']) !=
									"undefined") {
									if (dataInfo['descD'] != '') {
										dataInfo['descD'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									dataInfo['descD'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}
								if (typeof(headInfo['comm_set_json']['user_head_show_desc_e_mob']) !=
									"undefined") {
									if (dataInfo['descE'] != '') {
										dataInfo['descE'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									dataInfo['descE'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}
								if (typeof(headInfo['comm_set_json']['user_head_show_desc_f_mob']) !=
									"undefined") {
									if (dataInfo['descF'] != '') {
										dataInfo['descF'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									dataInfo['descF'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}
							}
							this.listData.push(dataInfo)
						}
					},
					() => {})
			},
			toChange() {
				uni.navigateTo({
					url: `../print/index?listInfo=` + JSON.stringify(this.selOrder)
				})
				this.cancel()
			},
			toPrint() {
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_padMobileDeviceClass',
						need_type: 'getOrderTableDataOneFun',
						mySysId: this.loginSystemInfo.database_name,
						loginsession: this.loginUserInfo.logincodewx,
						loginsession_main: this.userInfo.logincodewx,
						config_table_id: this.selOrder.config_table_id,
						tb_auto_id: this.selOrder.tb_auto_id,
						order_id: this.selOrder.order_id
					}
				}).then(res => {
					// 关闭弹窗
					this.$refs.popup.close('bottom')
					// 循环获取打印数据
					this.$Utils.doPrintFun(res.data.data.printInfo)
				}, () => {})
			},
			deleteOrder() {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '确认删除？',
					success: function(res) {
						if (res.confirm) {
							_this.$api({
								url: '/api/data.php',
								method: 'post',
								data: {
									api_class: 'Open_padMobileDeviceClass',
									need_type: 'nullifyPdaOrderList',
									mySysId: _this.loginSystemInfo.database_name,
									loginsession: _this.loginUserInfo.logincodewx,
									loginsession_main: _this.userInfo.logincodewx,
									config_table_id: _this.selOrder.config_table_id,
									config_group_id: _this.baseInfo.groupInfo.config_group_id,
									order_id: _this.selOrder.order_id
								}
							}).then(res => {
								_this.UPDATE_TIPMODAL({
									isShow: true,
									tipText: '删除成功', // 提示信息
									tipIcon: 'iconchenggong', // 图标名称
									mark: true, // 是否有蒙版
									duration: 2000, // 持续时间
									mode: 'self' // 弹窗模式
								})
								// 直接删除页面数据
								_this.listData.splice(_this.orderIndex, 1)
								// 关闭弹窗
								_this.$refs.popup.close('bottom')
								_this.orderIndex = -1
							}, (err) => {
								// 关闭弹窗
								_this.$refs.popup.close('bottom')
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			cancel() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageOut {
		width: 100vw;
		height: 100vh;
		position: relative;

		.page {
			width: 95%;
			position: absolute;
			bottom: 0;
			left: 50%;
			right: 50%;
			transform: translate(-50%, -50%);
		}

		.hisOut {
			width: 100vw;
			height: 83vh;
			position: absolute;
			bottom: 8vh;
			overflow: auto;

			.order-list-item {
				padding: 8rpx 0 4rpx 0;
				border-bottom: 1rpx solid #DCDFE7;
				width: 100%;

				.order-tags {
					align-items: stretch;
					// padding: 9vh 0;
					border-radius: 2vw 0 0 2vw;
					-webkit-writing-mode: vertical-lr;
					writing-mode: vertical-lr;
					text-align: center;
					font-weight: bold;
					color: #FFFFFF;
					margin: 0 1vw;
					padding-left: 0.6vh;
				}

				view {
					margin-bottom: 6rpx;
					margin-right: 6rpx;
					opacity: 0.6;
				}

				.item-binahao {
					font-weight: bold;
					color: #222222;
					opacity: 1;
				}
			}

			.item-selected {
				border: 2rpx solid #42B5F1;
				background: linear-gradient(to right, #EFF4FF 64%, #C8E3FF);
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