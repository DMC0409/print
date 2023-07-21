<template>
	<view class="pageOut">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="orderOut">
			<view class="th flex align-center">
				<view class="td">
					客户
				</view>
				<view class="td">
					数量
				</view>
			</view>
			<view class="eachCompany flex align-center" @click="toPrint(item)" v-for="(item,index) in companyArr"
				:key="index">
				<view class="td">
					{{item.com_name}}
				</view>
				<view class="td flex justify-center">
					<view class="point">
						{{item.getrow}}
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
				companyArr: [],
				currentTime: uni.getStorageSync('currentTime'),
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: '【' + this.currentTime[0] + '】' + '订单'
			})
			this.$api({
				url: '/api/data.php',
				method: 'post',
				data: {
					api_class: 'Open_padMobileDeviceClass',
					need_type: 'getOrderCompanyCountFun',
					mySysId: this.loginSystemInfo.database_name,
					loginsession: this.loginUserInfo.logincodewx,
					loginsession_main: this.userInfo.logincodewx,
					timen_begin: this.currentTime.timeBegin
				}
			}).then((res) => {
				this.companyArr = res.data.data.orderList
			}, () => {})
		},
		methods: {
			toPrint(item) {
				uni.setStorageSync('companyInfo', item)
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

		.orderOut {
			width: 100vw;
			height: 89vh;
			position: absolute;
			bottom: 0;
			overflow: auto;

			.th {
				width: 95%;
				margin: 0 auto;
				background-color: #633a97;
				padding: 3% 0;

				.td {
					width: 20%;
					text-align: center;
					color: #fffff9;
				}

				.td:first-child {
					width: 80%;
				}
			}

			.eachCompany {
				width: 95%;
				color: #000;
				margin: 0 auto;
				border: 2rpx solid #633a97;
				border-top: none;
				box-sizing: border-box;
				padding: 3% 0;
				background-color: #fff;

				.td {
					width: 80%;
					text-align: center;
				}

				.td:nth-child(2) {
					width: 20%;
					color: #fff;

					.point {
						width: 40%;
						background-color: red;
						border-radius: 30rpx;
					}
				}
			}
		}
	}
</style>