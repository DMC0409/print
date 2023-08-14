<template>
	<view class="pageOut">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="orderOut">
			<view class="eachInfo flex align-center">
				<view class="hd">
					交期
				</view>
				<view class="bd">
					<uni-datetime-picker type="date" v-model="timen_end" />
				</view>
			</view>
			<view class="eachInfo flex align-center">
				<view class="hd">
					客户
				</view>
				<view class="bd flex align-center justify-between">
					{{info_userout_company_id==''?'未选择':judgeUser()}}
					<view class="toSel" @click="jumpToSel">
						选择
					</view>
				</view>
			</view>
			<view class="eachInfo flex align-center"
				v-if="item.comm_set_json.pos_isshow == undefined || item.comm_set_json.pos_isshow==0 || item.comm_set_json.pda_digit_edit"
				v-for="(item,index) in formList" :key="item.config_table_head_id">
				<!-- 兼容后端返回不同的style格式 -->
				<block v-if="!item.comm_set_json['head_font_style']">
					<view class="hd">
						{{item.head_name}}
					</view>
				</block>
				<block v-else>
					<view class="hd"
						:style="item.comm_set_json['head_font_style'].indexOf(':')==-1?`color:${item.comm_set_json['head_font_style']}`:item.comm_set_json['head_font_style']">
						{{item.head_name}}
					</view>
				</block>
				<!-- 不可编辑字段 -->
				<block v-if="item.comm_set_json.pos_isedit!=undefined && item.comm_set_json.pos_isedit=='1'">
					<view class="bd">
						{{item.default_value}}
					</view>
				</block>
				<!-- 可编辑字段 -->
				<block v-else>
					<!-- 选择加工类型 -->
					<view class="bd flex align-center justify-between" v-if="item.head_style == '27'">
						{{src_material_type_id=='0'?'未选择':judgeWay()}}
						<view class="toSel" @click="jumpToWay">
							选择
						</view>
					</view>
					<!-- 选择设备类型 -->
					<view class="bd flex align-center justify-between" v-else-if="item.head_style == '17'">
						{{ass_equipment_id=='0'?'未选择':judgeDev()}}
						<view class="toSel" @click="jumpToDev">
							选择
						</view>
					</view>
					<!-- 显示虚拟键盘 -->
					<view class="bd"
						v-else-if="item.comm_set_json.pda_digit_edit && item.comm_set_json.pda_digit_edit=='1'"
						@click="openKey(item,index)">
						{{item.default_value}}
					</view>
					<view class="bd"
						v-else-if="item.head_style == '0' && (item.head_input_set == '20' || item.head_input_set == '21')">
						<block v-if="item.head_input_setjson.length>3">
							<picker @change="onchange($event,item)" mode='selector' :value="item.show_index"
								:range="item.head_input_setjson" range-key="name">
								<view class="uni-input">
									{{item.head_input_setjson[item.show_index].label}}
								</view>
							</picker>
						</block>
						<block v-else>
							<view class="flex align-center">
								<view class="eachItem" :class="i.value==item.default_value?'check':''"
									v-for="(i,index) in item.head_input_setjson" :key="index"
									@click="selectWay(item,i)">
									<i class="iconfont iconchenggong" v-show="i.value==item.default_value"></i>
									{{i.label}}
								</view>
							</view>
						</block>
					</view>
					<view class="bd"
						v-else-if="item.head_style == '0' && (item.head_input_set == '1' || item.head_input_set == '2')">
						<!-- 整数或小数点 -->
						<input type="number" v-model="item.default_value"
							v-if="item.head_input_save == '1' || item.head_input_save == '2'" @focus="focusFun(item)">
						<input type="text" v-model="item.default_value" @focus="focusFun(item)" v-else>
					</view>
					<view class="bd"
						v-else-if="item.head_style == '0' && (item.head_input_set == '30' || item.head_input_set == '31')">
						<uni-datetime-picker type="date" v-model="item.default_value" />
					</view>
					<view class="bd" v-else>
						该字段暂时无法编辑
					</view>
				</block>
			</view>
		</view>
		<view class="edit flex">
			<button class="save" @click="submitOrder">{{orderInfo?'保存修改':'提交订单'}}</button>
		</view>
		<uni-popup ref="popup" type="top">
			<view class="popOut">
				<view class="digitOut flex align-center justify-between">
					<view class="editLabel">{{editMod}}</view>
					<view class="detail">
						{{digit==''?'请输入':digit}}
					</view>
					<i class="iconfont iconbackspace" @click="closeDigit"></i>
				</view>
				<view class="keyBoard flex align-center justify-center">
					<view class="eachKey flex align-center justify-center" @click="selNum(item)" v-for="item in keyList"
						:key="item">
						{{item}}
					</view>
					<button class="keySure" @click="sureDigit">确定</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="saveMod" type="top">
			<view class="saveOut">
				<view class="eachOper" @click="onlySave(true)">
					{{orderInfo?'仅保存内容':'仅创建内容'}}
				</view>
				<view class="eachOper printCss" @click="onlySave(false)">
					{{orderInfo?'保存并打印':'创建并打印'}}
				</view>
				<view class="eachOper" @click="cancelSave">
					取消
				</view>
			</view>
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
				formList: [],
				baseInfo: uni.getStorageSync('baseInfo'),
				// 交期
				timen_end: this.$moment().add(1, 'day').format('yyyy-MM-DD'),
				timen_begin: '',
				// 客户id
				info_userout_company_id: '',
				config_group_id: '',
				config_table_id: '',
				// 加工类型
				src_material_type_id: '',
				// 设备类型
				ass_equipment_id: '',
				tb_auto_id: '',
				order_id: '',
				// 历史记录传过来的值
				orderInfo: null,
				// getOrderTableDataOneFun接口返回的orderInfo
				resOrderInfo: {},
				keyList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '00', '.', '*', '#', '←'],
				digit: '',
				digitNum: -1,
				kyle_data: {},
				editMod: ''
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
			if (options.listInfo) {
				uni.setNavigationBarTitle({
					title: `修改订单(${uni.getStorageSync('paperType')==0?'不干胶':'热敏纸'})`
				})
				this.orderInfo = JSON.parse(options.listInfo)
				this.config_table_id = this.orderInfo.config_table_id
				this.tb_auto_id = this.orderInfo.tb_auto_id
				this.order_id = this.orderInfo.order_id
			} else {
				uni.setNavigationBarTitle({
					title: `创建订单(${uni.getStorageSync('paperType')==0?'不干胶':'热敏纸'})`
				})
			}
			let _this = this
			// 添加打印状态监听
			globalEvent.addEventListener('onPrintCallback', function(e) {
				_this.$Utils.judgePrintErr(e.key)
			});
		},
		mounted() {
			// 获取基本参数
			this.config_group_id = this.baseInfo.groupInfo.config_group_id
			let subData = {
				api_class: 'Open_padMobileDeviceClass',
				need_type: 'getMainGroupInitFun',
				mySysId: this.loginSystemInfo.database_name,
				loginsession: this.loginUserInfo.logincodewx,
				loginsession_main: this.userInfo.logincodewx,
			}
			if (this.config_table_id) {
				subData.config_table_id = this.config_table_id;
				subData.tb_auto_id = this.tb_auto_id;
				subData.order_id = this.order_id;
				subData.need_type = 'getOrderTableDataOneFun';
			}
			this.$api({
				url: '/api/data.php',
				method: 'post',
				data: subData
			}).then(res => {
				if (this.orderInfo) {
					// 查看历史记录模式
					this.resOrderInfo = res.data.data.dataInfo[0].order_info;
					// 回显交期时间
					this.timen_end = Number(res.data.data.dataInfo[0].timen_end) * 1000
					this.timen_begin = res.data.data.dataInfo[0].timen_begin
					// 回显选中的客户
					this.info_userout_company_id = res.data.data.dataInfo[0].order_info.userout_a_id
					for (let i of res.data.data.tableHeadList) {
						if (i.head_style == '27') {
							// 回显加工类型
							this.src_material_type_id = res.data.data.dataInfo[0]['th_' + i
								.config_table_head_id
							]
						} else if (i.head_style == '17') {
							// 回显设备类型
							this.ass_equipment_id = res.data.data.dataInfo[0]['th_' + i
								.config_table_head_id
							]
						}
						// 需回显值赋值
						for (let j in res.data.data.dataInfo[0]) {
							if (j == 'th_' + i.config_table_head_id) {
								i.default_value = res.data.data.dataInfo[0][j]
								if (i.head_style == '0' && (i.head_input_set == '20' || i.head_input_set ==
										'21')) {
									// 该判断内字段将使用picker组件，匹配正确的选中的下标值
									for (let z in i.head_input_setjson) {
										if (i.head_input_setjson[z].value == res.data.data.dataInfo[0][j]) {
											i.show_index = z
										}
									}
								}
							}
						}
						// 若可选项的default_value==‘-’则将其改为0
						if (i.head_style == '0' && (i.head_input_set == '20' || i.head_input_set == '21')) {
							if (i.default_value == '-') {
								i.default_value = i.head_input_setjson[0].value
								i.show_index = 0
							}
						}
					}
					this.formList = res.data.data.tableHeadList
				} else {
					// 新建模式
					this.config_table_id = res.data.data.tableInfo.config_table_id
					for (let i of res.data.data.headList) {
						// 若可选项的default_value==‘-’则将其改为head_input_setjson数组中的第一个对象的value值
						if (i.head_style == '0' && (i.head_input_set == '20' || i.head_input_set == '21')) {
							if (i.default_value == '-') {
								i.default_value = i.head_input_setjson[0].value
								i.show_index = 0
							} else {
								// 该判断内字段将使用picker组件，匹配正确的选中的下标值
								for (let z in i.head_input_setjson) {
									if (i.head_input_setjson[z].value == i.default_value) {
										i.show_index = z
									}
								}
							}
						}
					}
					this.formList = res.data.data.headList
					for (let i of this.formList) {
						if (i.head_style == '27') {
							this.src_material_type_id = i.default_value
						} else if (i.head_style == '17') {
							this.ass_equipment_id = i.default_value
						}
					}
				}
			}, () => {})
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL']),
			...mapActions(['initPrinter']),
			jumpToSel() {
				uni.navigateTo({
					url: `../seluser/index?companyId=${this.info_userout_company_id}`,
				})
			},
			jumpToWay() {
				uni.navigateTo({
					url: `../seltype/index?srcTypeId=${this.src_material_type_id}`,
				})
			},
			jumpToDev() {
				uni.navigateTo({
					url: `../selDev/index?srcDevId=${this.ass_equipment_id}`,
				})
			},
			onchange(e, item) {
				item.show_index = e.target.value.toString()
			},
			focusFun(item) {
				if (item.default_value == '-' || item.default_value == '0') {
					item.default_value = ''
				}
			},
			selectWay(item, i) {
				item.default_value = i.value
			},
			judgeUser() {
				for (let i of this.baseInfo.buyerList) {
					if (i.info_userout_company_id === this.info_userout_company_id) {
						return i.short_name
					}
				}
			},
			judgeWay() {
				for (let i of this.baseInfo.typeList) {
					for (let j of i.child) {
						if (j.src_material_type_id === this.src_material_type_id) {
							return j.type_name
						}
					}
				}
			},
			judgeDev() {
				for (let i of this.baseInfo.equipmentList) {
					if (i.ass_equipment_id === this.ass_equipment_id) {
						return i.equipment_name
					}
				}
			},
			openKey(item, index) {
				if (item.comm_set_json.pda_digit_edit == 1) {
					this.digit = ''
					this.digitNum = index
					this.editMod = item.head_name
					this.$refs.popup.open('bottom')
				}
			},
			closeDigit() {
				this.$refs.popup.close('bottom')
			},
			sureDigit() {
				if (this.digit == '') {
					this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '请输入合法参数', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				} else {
					this.formList[this.digitNum].default_value = this.digit
					this.closeDigit()
				}
			},
			selNum(item) {
				uni.vibrateLong({
					success: () => {
						console.log('success');
					}
				});
				if (item == '←') {
					this.digit = this.digit.substr(0, this.digit.length - 1)
				} else {
					this.digit += item
				}
			},
			submitOrder() {
				let list = {}
				if (this.timen_end == '') {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '未选择交期', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
				if (this.info_userout_company_id == '') {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '未选择客户', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}

				for (let i in this.formList) {
					if (this.formList[i].default_value == '') {
						// 用户未填写数据则添加默认值
						if (this.formList[i].head_style == '0' && (this.formList[i].head_input_set == '1' || this.formList[
								i].head_input_set == '2')) {
							if (this.formList[i].head_input_save == '1' || this.formList[i].head_input_save == '2') {
								// 判断为数字
								this.formList[i].default_value = 0
							} else {
								// 判断为字符串
								this.formList[i].default_value = '-'
							}
						}
					} else {
						if (this.formList[i].head_style == '27') {
							list['th_' + this.formList[i].config_table_head_id] = this.src_material_type_id
						} else if (this.formList[i].head_style == '17') {
							list['th_' + this.formList[i].config_table_head_id] = this.ass_equipment_id
						} else if (this.formList[i].head_style == '0' && (this.formList[i].head_input_set == '20' || this
								.formList[i].head_input_set == '21')) {
							// 可选字段需配置head_input_setjson中对象的value值传给后端
							if (this.formList[i].head_input_setjson.length > 3) {
								// picker
								list['th_' + this.formList[i].config_table_head_id] = this.formList[i].head_input_setjson[
									this.formList[i]
									.show_index].value
							} else {
								list['th_' + this.formList[i].config_table_head_id] = this.formList[i].default_value
							}
						} else {
							list['th_' + this.formList[i].config_table_head_id] = this.formList[i].default_value
						}
					}
				}
				this.kyle_data = {
					"head_data_info": list,
					"config_group_id": this.config_group_id,
					"config_table_id": this.config_table_id,
					"info_userout_company_id": this.info_userout_company_id,
					"order_info": {}
				}
				if (this.orderInfo) {
					// 若是修改订单则添加tb_auto_id和timen_begin
					this.kyle_data.head_data_info.tb_auto_id = this.tb_auto_id
					this.resOrderInfo.timen_begin = this.$moment(Number(this.timen_begin) * 1000).format(
						'YYYY-MM-DD')
					this.resOrderInfo.timen_end = this.$moment(this.timen_end).format('YYYY-MM-DD')
					this.kyle_data.order_info = this.resOrderInfo
				} else {
					// 创建订单
					this.kyle_data.order_info.timen_end = this.timen_end;
				}
				this.$refs.saveMod.open('bottom')
			},
			onlySave(state) {
				// 保存订单
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_padMobileDeviceClass',
						need_type: 'setMainOrderTableFun',
						mySysId: this.loginSystemInfo.database_name,
						loginsession: this.loginUserInfo.logincodewx,
						loginsession_main: this.userInfo.logincodewx,
						kyle_data: JSON.stringify(this.kyle_data)
					}
				}).then(res => {
					// 赋值基础参数
					this.tb_auto_id = res.data.data.dataInfo[0].tb_auto_id
					this.config_table_id = res.data.data.dataInfo[0].config_table_id
					this.order_id = res.data.data.dataInfo[0].order_id
					this.cancelSave()
					// 获取创建的新的订单信息（等同历史记录进入本页面）(获取订单历史记录)
					this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_padMobileDeviceClass',
							need_type: 'getOrderTableDataOneFun',
							config_table_id: this.config_table_id,
							tb_auto_id: this.tb_auto_id,
							order_id: this.order_id,
							mySysId: this.loginSystemInfo.database_name,
							loginsession: this.loginUserInfo.logincodewx,
							loginsession_main: this.userInfo.logincodewx,
						}
					}).then(res => {
						// 获取更新的订单信息
						// 本地缓存修改的数据，app中真机无法通过getCurrentPages传值
						uni.setStorageSync('updateInfo', res.data.data)
						this.resOrderInfo = res.data.data.dataInfo[0].order_info;
						// 回显交期时间
						this.timen_end = Number(res.data.data.dataInfo[0].timen_end) * 1000
						this.timen_begin = res.data.data.dataInfo[0].timen_begin
						// 回显选中的客户
						this.info_userout_company_id = res.data.data.dataInfo[0].order_info.userout_a_id
						for (let i of res.data.data.tableHeadList) {
							if (i.head_style == '27') {
								// 回显加工类型
								this.src_material_type_id = res.data.data.dataInfo[0]['th_' + i
									.config_table_head_id
								]
							} else if (i.head_style == '17') {
								// 回显设备类型
								this.ass_equipment_id = res.data.data.dataInfo[0]['th_' + i
									.config_table_head_id
								]
							}
							// 需回显值赋值
							for (let j in res.data.data.dataInfo[0]) {
								if (j == 'th_' + i.config_table_head_id) {
									i.default_value = res.data.data.dataInfo[0][j]
									if (i.head_style == '0' && (i.head_input_set == '20' || i
											.head_input_set ==
											'21')) {
										// 该判断内字段将使用picker组件，匹配正确的default_value值
										for (let z in i.head_input_setjson) {
											if (i.head_input_setjson[z].value == res.data.data.dataInfo[0][
													j
												]) {
												i.show_index = z
											}
										}
									}
								}
							}
							// 若可选项的default_value==‘-’则将其改为0
							if (i.head_style == '0' && (i.head_input_set == '20' || i.head_input_set ==
									'21')) {
								if (i.default_value == '-') {
									i.default_value = i.head_input_setjson[0].value
									i.show_index = 0
								}
							}
						}
						this.formList = res.data.data.tableHeadList
						// 修改头部导航提示信息
						uni.setNavigationBarTitle({
							title: `修改订单(${uni.getStorageSync('paperType')==0?'不干胶':'热敏纸'})`
						})
						if (!state) {
							// 读取打印数据进行打印
							this.$Utils.doPrintFun(res.data.data.printInfo)
						} else {
							this.UPDATE_TIPMODAL({
								isShow: true,
								tipText: this.orderInfo ? '保存成功' : '创建成功', // 提示信息
								tipIcon: 'iconchenggong', // 图标名称
								mark: true, // 是否有蒙版
								duration: 2000, // 持续时间
								mode: 'self' // 弹窗模式
							})
						}
						// 转换底部按钮显示状态
						this.orderInfo = {}
					})
				}, (err) => {
					this.cancelSave()
				})
			},
			cancelSave() {
				this.$refs.saveMod.close('bottom')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageOut {
		width: 100vw;
		height: 100vh;
		position: relative;

		.orderOut {
			width: 100vw;
			height: 82vh;
			position: absolute;
			bottom: 10vh;
			overflow: auto;

			.eachInfo {
				padding: 5%;
				border-bottom: 2rpx solid #eee;

				.hd {
					width: 32%;
				}

				.bd {
					width: 68%;
					color: #8b8c90;

					.toSel {
						width: 20%;
						padding: 10rpx 20rpx;
						font-size: 16px;
						font-weight: bold;
						text-align: center;
						border-radius: 10rpx;
						box-shadow: 0 1rpx 6rpx rgba(114, 130, 138, 0.2);
						color: #ffffff;
						background-color: #39b54a;
					}

					.eachItem {
						border-radius: 5px;
						background-color: #ededed;
						color: #000;
						padding: 10rpx 30rpx;
						margin-right: 10rpx;

						i {
							color: #fff;
							margin-right: 10rpx;
							font-size: 35rpx;
						}
					}

					.check {
						background-color: #39b54a;
						color: #fff;
					}
				}
			}

			button {
				width: 95%;
				font-weight: bold;
				margin-bottom: 15px;
			}
		}

		.popOut {
			.digitOut {
				width: 100%;
				height: 7vh;
				line-height: 7vh;
				text-align: center;
				font-size: 20px;
				background-color: #fff;

				.detail {
					width: 50%;
					text-align: center;
					overflow: hidden;
				}

				.editLabel {
					width: 18%;
					padding-left: 20rpx;
					font-size: 30rpx;
				}

				i {
					font-size: 70rpx;
					color: #8b8c90;
					padding-right: 20rpx;
				}
			}

			.keyBoard {
				flex-wrap: wrap;
				width: 100%;
				background-color: #fff;

				.eachKey {
					width: 33%;
					height: 10vh;
					font-size: 30px;
					font-weight: bold;
					color: green;

					&:active {
						background-color: #9bddc4;
					}
				}

				.keySure {
					background-color: #39b54a;
					color: #fff;
					width: 95%;
					margin: 2vh auto;
				}
			}
		}

		.saveOut {
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

			.printCss {
				color: #4683f0;
			}
		}

		.submit {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #39b54a;
			color: #fff;
			width: 95%;
			margin: 2vh auto;
		}

		.edit {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;

			button {
				color: #fff;
			}

			.save {
				width: 95%;
				margin: 20rpx;
				background-color: #4683f0;
			}

			.paperCss {
				width: 30%;
				background-color: #f35c6e;
			}

			.paperCss:nth-child(2) {
				background-color: #39b54a;
			}
		}
	}
</style>