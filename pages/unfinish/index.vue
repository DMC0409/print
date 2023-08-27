<template>
	<view class="pageOut">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="unfinishOut">
			<view class="flex align-center">
				<view class="TopMenu">
					<input type="number" v-model="detailOrder" placeholder="请输入订单号" @confirm="onSureSearch">
				</view>
				<view class="toSel" @click="onSureSearch">
					搜索
				</view>
			</view>
			<view class="TopMenu">
				<view class="timeText" @click="toAll">
					查看所有订单
				</view>
			</view>
			<view class="timeOut flex justify-between">
				<view class="eachMenu" @click="toOrder(item)" v-for="(item,index) in timeArr" :key="index">
					<view class="timeText">
						{{item[0]}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo'),
				loginUserInfo: uni.getStorageSync('loginUserInfo'),
				loginSystemInfo: uni.getStorageSync('loginSystemInfo'),
				timeArr: uni.getStorageSync('timeArr') ? uni.getStorageSync('timeArr') : [],
				detailOrder: undefined,
				config_table_id: '',
				sendData: null
			}
		},
		onShow() {
			if (this.timeArr.length == 0) {
				this.getTimeList()
			} else {
				// 当打开app时的时间戳大于每日时间戳+24小时
				if (this.$moment().unix() > this.timeArr[0].timeBegin + 60 * 60 * 24) {
					this.getTimeList()
				}
			}
		},
		// 下拉更新时间戳
		onPullDownRefresh() {
			this.getTimeList('refresh')
		},
		methods: {
			onSureSearch() {
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
						// 查找单个施工单号
						return this.$api({
							url: '/api/data.php',
							method: 'post',
							data: {
								api_class: 'Open_padMobileDeviceClass',
								need_type: 'findOrderOneTableInfoBySearchFun',
								mySysId: this.loginSystemInfo.database_name,
								loginsession: this.loginUserInfo.logincodewx,
								loginsession_main: this.userInfo.logincodewx,
								order_index: this.detailOrder,
								config_table_id: this.config_table_id
							}
						})
					}).then((res) => {
						this.sendData = res.data.data
						this.sendData.lineInfo.config_table_id = this.config_table_id
						// 获取当前所输入单号的具体信息
						return this.$api({
							url: '/api/data.php',
							method: 'post',
							data: {
								api_class: 'Open_padMobileDeviceClass',
								need_type: 'getOrderTableDataOneFun',
								mySysId: this.loginSystemInfo.database_name,
								loginsession: this.loginUserInfo.logincodewx,
								loginsession_main: this.userInfo.logincodewx,
								tb_auto_id: this.sendData.lineInfo.tb_auto_id,
								order_id: this.sendData.lineInfo.order_id,
								config_table_id: this.config_table_id
							}
						})
					})
					.then((res) => {
						this.sendData = {
							...this.sendData,
							...res.data.data.dataInfo[0]
						}
						uni.navigateTo({
							url: `../print/index?listInfo=` + JSON.stringify(this.sendData)
						})
					}, () => {})
			},
			getTimeList(func) {
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_padMobileDeviceClass',
						need_type: 'returnTimeRange',
						mySysId: this.loginSystemInfo.database_name,
						loginsession: this.loginUserInfo.logincodewx,
						loginsession_main: this.userInfo.logincodewx
					}
				}).then((res) => {
					this.timeArr = res.data.data.timeRangeList
					uni.setStorageSync('timeArr', this.timeArr)
					if (func) {
						uni.stopPullDownRefresh()
					}
				}, () => {})
			},
			toOrder(item) {
				uni.setStorageSync('currentTime', item)
				uni.navigateTo({
					url: '../order/index'
				})
			},
			toAll() {
				uni.removeStorageSync('companyInfo')
				uni.navigateTo({
					url: '../history/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageOut {
		width: 100vw;
		height: 100vh;
		position: relative;
		background-color: #633a97;
		background: linear-gradient(60deg, #633a97 0, #4c87c6 92%);

		.unfinishOut {
			width: 100vw;
			height: 91vh;
			position: absolute;
			bottom: 0;
			overflow: auto;

			.timeOut {
				flex-wrap: wrap;

				.eachMenu {
					width: 33%;
					padding: 5%;
					margin: 5% 3% 0 3%;
					background: rgba(255, 255, 255, .9);
					box-shadow: 0 0.4rem 0.4rem rgba(11, 48, 107, .1);
					border-radius: 5px;
					border: 1px solid #e8e8e8;
					flex-direction: column;
					color: #633a97;


					.timeText:first-letter {
						font-size: 40rpx;
					}
				}
			}

			.TopMenu {
				width: 84%;
				padding: 5%;
				margin: 5% 3% 0 3%;
				background: rgba(255, 255, 255, .9);
				box-shadow: 0 0.4rem 0.4rem rgba(11, 48, 107, .1);
				border-radius: 5px;
				border: 1px solid #e8e8e8;
				flex-direction: column;
				color: #633a97;


				.timeText:first-letter {
					font-size: 40rpx;
				}
			}

			.toSel {
				width: 38%;
				padding: 5%;
				margin: 5% 3% 0 3%;
				font-size: 16px;
				font-weight: bold;
				text-align: center;
				border-radius: 10rpx;
				box-shadow: 0 1rpx 6rpx rgba(114, 130, 138, 0.2);
				color: #ffffff;
				background-color: #39b54a;
			}
		}
	}
</style>