<template>
	<view class="pageOut">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="userOut">
			<view class="userList">
				<view class="eachLine flex align-center">
					<view class="title">纸张选择</view>
					<view class="flex align-center">
						<view class="eachItem" :class="item.type==selectedTpye?'check':''"
							v-for="(item,index) in paperArr" :key="index" @click="selectWay(item)">
							<i class="iconfont iconchenggong" v-show="item.type==selectedTpye"></i>
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="eachLine flex align-center">
					<view class="title">请求延迟</view>
					<view class="flex align-center">
						<view class="eachItem" :class="item.type==delayTime?'check':''" v-for="(item,index) in delayArr"
							:key="index" @click="selectTime(item)">
							<i class="iconfont iconchenggong" v-show="item.type==delayTime"></i>
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="eachLine flex align-center">
					<view class="title">单据打印</view>
					<view class="flex align-center">
						<view class="eachItem" :class="item.type==eachPage?'check':''" v-for="(item,index) in pageArr"
							:key="index" @click="selectPage(item)">
							<i class="iconfont iconchenggong" v-show="item.type==eachPage"></i>
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="eachLine flex align-center">
					<view class="title">更新系统</view>
					<view class="flex align-center">
						<view class="eachItem check" @click="checkVersion()">
							点击更新
						</view>
					</view>
				</view>
			</view>
			<view class="edit flex">
				<button class="save" @click="submitSave">保存设置</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo'),
				loginUserInfo: uni.getStorageSync('loginUserInfo'),
				loginSystemInfo: uni.getStorageSync('loginSystemInfo'),
				paperArr: [{
						name: '不干胶',
						type: 0
					},
					{
						name: '热敏纸',
						type: 1
					}
				],
				delayArr: [{
						name: '15秒',
						type: 15000
					},
					{
						name: '30秒',
						type: 30000
					}
				],
				pageArr: [{
						name: '每页4条内容',
						type: 4
					},
					{
						name: '每页3条内容',
						type: 3
					}
				],
				selectedTpye: uni.getStorageSync('paperType'),
				delayTime: uni.getStorageSync('delayTime'),
				eachPage: uni.getStorageSync('eachPage'),
			}
		},
		mounted() {

		},
		methods: {
			...mapMutations(['UPADTE_PRINTER', 'UPDATE_TIPMODAL']),
			selectWay(item) {
				this.selectedTpye = item.type
			},
			selectTime(item) {
				this.delayTime = item.type
			},
			selectPage(item) {
				this.eachPage = item.type
			},
			submitSave() {
				uni.setStorageSync('paperType', this.selectedTpye)
				this.UPADTE_PRINTER(null)
				uni.setStorageSync('delayTime', this.delayTime)
				uni.setStorageSync('eachPage', this.eachPage)
				this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_padMobileDeviceClass',
							need_type: 'setSysSettings',
							mySysId: this.loginSystemInfo.database_name,
							loginsession: this.loginUserInfo.logincodewx,
							loginsession_main: this.userInfo.logincodewx,
							settings_info: {
								paperType: this.selectedTpye,
								delayTime: this.delayTime,
								eachPage: this.eachPage
							}
						}
					})
					.then((res) => {
						this.UPDATE_TIPMODAL({
							isShow: true,
							tipText: '保存成功', // 提示信息
							tipIcon: 'iconchenggong', // 图标名称
							mark: true, // 是否有蒙版
							duration: 2000, // 持续时间
							mode: 'self' // 弹窗模式
						})
					}, () => {})
			},
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
							} else {
								this.UPDATE_TIPMODAL({
									isShow: true,
									tipText: '当前已是最新版本', // 提示信息
									tipIcon: 'iconchenggong', // 图标名称
									mark: true, // 是否有蒙版
									duration: 2000, // 持续时间
									mode: 'self' // 弹窗模式
								})
							}
						})
					})
					.catch(err => {
						console.log(err)
					})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pageOut {
		width: 100vw;
		height: 100vh;
		position: relative;

		.userOut {
			width: 100vw;
			height: 90vh;
			position: absolute;
			bottom: 0;
			overflow: hidden;

			.edit {
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;

				button {
					color: #fff;
					width: 95%;
					margin: 20rpx;
					background-color: #4683f0;
				}
			}

			.userList {
				width: 100vw;
				height: 95%;
				overflow: auto;

				.eachLine {
					width: 90%;
					height: 8vh;
					margin: 0 auto;
					border-bottom: 1rpx solid #ccc;

					.title {
						width: 25%;
					}

					.eachItem {
						border-radius: 5px;
						background-color: #ededed;
						color: #000;
						padding: 10rpx 20rpx;
						margin-right: 20rpx;

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
		}
	}
</style>