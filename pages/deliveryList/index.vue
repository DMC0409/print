<template>
	<view class="pageOut">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="eachInfo flex align-center">
			<input type="text" class="company" v-model="keyword" placeholder="请输入">
			<view class="toSel flex align-center justify-center" @click="getHistoryData">
				搜索
			</view>
		</view>
		<view class="orderOut">
			<view class="eachOrder" v-for="(item,index) in orderList" :key="index" @click="toDetail(item)">
				<view class="title flex align-center justify-between">
					<view class="">
						No.:{{item.form_table_index}}
					</view>
					<view class="company">
						{{item.title}}
					</view>
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
				linkBaseData: null,
				orderList: [],
				keyword: ''
			}
		},
		mounted() {
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
					this.getHistoryData()
				}, () => {})
		},
		methods: {
			getHistoryData() {
				this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_padMobileDeviceClass',
							need_type: 'getFormTableMainDataList',
							mySysId: this.loginSystemInfo.database_name,
							loginsession: this.loginUserInfo.logincodewx,
							loginsession_main: this.userInfo.logincodewx,
							config_form_table_id: this.linkBaseData.linkInfo.config_form_table_id,
							pad_comm_keywords: this.keyword
						}
					})
					.then((res) => {
						const {
							dataList
						} = res.data.data.dataInfo.list
						// 处理分页数据
						this.pageSize = res.data.data.dataInfo.list
							.everyPageContentNum
						this.total = Math.ceil(res.data.data.dataInfo.list.row / this.pageSize)
						const {
							formHeadMainList
						} = res.data.data
						//处理应显示数据
						for (let i of dataList) {
							let eachOrder = {
								...i,
								...this.$devliveryUtils.showFormTableListProcessingFun(formHeadMainList,
									i)
							}
							eachOrder.form_table_index = i.form_table_index
							this.orderList.push(eachOrder);
						}
					}, () => {})
			},
			toDetail(item) {
				// 获取订单详情数据
				this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Deer_formDataListMainClass',
							need_type: 'getFormTableDataMainInfo',
							mySysId: this.loginSystemInfo.database_name,
							loginsession: this.loginUserInfo.logincodewx,
							loginsession_main: this.userInfo.logincodewx,
							kyle_data: JSON.stringify({
								ftb_main_auto_id: item.ftb_main_auto_id,
								config_form_table_id: item.config_form_table_id
							})

						}
					})
					.then((res) => {
						uni.navigateTo({
							url: `../deliveryDetail/index?deliveryData=${JSON.stringify(res.data.data)}&edit=${true}`
						})
					}, () => {})
			}
		}
	}
</script>

<style lang="scss">
	.pageOut {
		width: 100vw;
		height: 100vh;
		position: relative;

		.eachInfo {
			width: 90%;
			height: 70rpx;
			border-radius: 10rpx;
			color: #8b8c90;
			background-color: #f3f3f3;
			position: absolute;
			top: 180rpx;
			left: 50%;
			transform: translate(-50%, -50%);

			.company {
				width: 90%;
				padding-left: 20rpx;
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

		.orderOut {
			width: 100vw;
			height: 85vh;
			position: absolute;
			bottom: 0;
			overflow: auto;

			.eachOrder {
				width: 90%;
				margin: 0 auto 40rpx auto;
				background: rgba(250, 250, 250, 0.9);
				box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
				border-radius: 5px;
				border: 1px solid #ebeef5;

				view {
					width: 90%;
					margin: 0 auto;
					padding: 5rpx 0;
				}

				.title {
					color: #000;
					font-size: 38rpx;
					border-bottom: 1px solid #ebeef5;
					.company{
						color: #666;
					}
				}

				.desc {
					color: #000;
					font-size: 35rpx;
				}

				.more {
					font-size: 35rpx;
					color: #555;
				}
			}
		}
	}
</style>