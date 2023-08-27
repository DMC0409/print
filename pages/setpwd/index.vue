<template>
	<view class="box flex align-center justify-end">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="topBox flex justify-center">
			<view class="home_top">
				<image class="logo" src="../../static/logo_no_word-green.png"></image>
				<image class="qly" src="../../static/logo_nowords-green.png"></image>
			</view>
		</view>
		<view class="case">
			<view class="eachLine flex align-center justify-between" v-for="(item,index) in formList" :key="index">
				<view class="leftLine flex align-center"><text>{{item.name}}</text>
					<view class="defaultText" v-if="index === 2 || index === 3" @click="changeInput(index)">
						<template v-if="item.value==''">{{item.defaultDesc}}</template>
						<template v-else>
							<text v-for="(i,index) in item.value" :key="index">
								•
							</text>
						</template>
					</view>
					<view class="defaultText" v-else @click="changeInput(index)">
						{{item.value==''?item.defaultDesc:item.value}}
					</view>
				</view>
				<view @click="toClear" v-show="focusNum === index&&focusNum!==1 "
					class="clear flex align-center justify-center">
					清除
				</view>
				<view class="code" :class="{active:focusNum===1}" v-show="index === 1" @click="getCode">
					{{countDownNum!=0?countDownNum+'s再获取':'验证码'}}
				</view>
			</view>
			<view class="keyBoard flex align-center justify-center">
				<view class="eachKey flex align-center justify-center" @click="selNum(item)" v-for="item in keyList"
					:key="item">
					{{item}}
				</view>
			</view>
			<button class="login" @click="toSetPwd">提交修改</button>
		</view>
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
				formList: [{
					name: '手机',
					defaultDesc: '您注册的手机号',
					value: ''
				}, {
					name: '短信',
					defaultDesc: '4-6位验证码',
					value: ''
				}, {
					name: '密码',
					defaultDesc: '新密码',
					value: ''
				}, {
					name: '确认密码',
					defaultDesc: '确认密码',
					value: ''
				}],
				keyList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '*', '←'],
				focusNum: 0,
				tipTime: null,
				countDownNum: 0,
				codeInt: '',
				SerKyleSaveData: {}
			}
		},
		mounted() {

		},
		unmounted() {
			// 页面卸载时清空计时器
			if (this.tipTime) {
				clearTimeout(this.tipTime)
			}
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL']),
			selNum(item) {
				if (item == '←') {
					this.formList[this.focusNum].value = this.formList[this.focusNum].value.substr(0, this.formList[this
						.focusNum].value.length - 1);
				} else {
					this.formList[this.focusNum].value += item
				}
			},
			getCode() {
				if (this.formList[0].value == '') {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '手机号不可为空', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
				if (!this.$Utils.isValidPhone(this.formList[0].value)) {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '手机号格式错误', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
				this.UPDATE_TIPMODAL({
					isShow: true,
					tipText: '发送中', // 提示信息
					tipIcon: 'iconchenggong', // 图标名称
					mark: true, // 是否有蒙版
					duration: 2000, // 持续时间
					mode: 'self' // 弹窗模式
				})
				this.$api({
					url: '/api/data.php',
					method: 'get',
					data: {
						api_class: 'Html_registerClass',
						need_type: 'getMobCodeFunIsExist',
						form_page_type: "html",
						kyle_data: {
							"account": this.formList[0].value
						},
						mySysId: 'no',
						loginsession: 0,
						loginsession_main: 0,
					}
				}).then(res => {
					this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: res.data.info, // 提示信息
						tipIcon: 'iconchenggong', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
					this.SerKyleSaveData = res.data.data
					this.countDownNum = 60
					this.codeInt = setInterval(() => {
						if (this.countDownNum > 0) {
							this.countDownNum--
						} else {
							clearInterval(this.this.codeInt)
						}
					}, 1000)
				}, (err) => {})
			},
			toSetPwd() {
				if (this.formList[0].value === '') {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '手机号不可为空', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
				if (!this.$Utils.isValidPhone(this.formList[0].value)) {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '手机号格式错误', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
				if (!this.$Utils.isValidPWD(this.formList[2].value)) {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '请输入6-8位密码', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
				if (this.formList[2].value !== this.formList[3].value) {
					return this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '两次密码不一致', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
				}
				// 提示加载中
				this.UPDATE_TIPMODAL({
					isShow: true,
					tipText: '加载中', // 提示信息
					tipIcon: 'iconloading', // 图标名称
					mark: true, // 是否有蒙版
					duration: 0, // 持续时间
					mode: 'self' // 弹窗模式
				})
				this.SerKyleSaveData.mobcode = this.formList[1].value;
				this.SerKyleSaveData.account = this.formList[0].value;
				this.SerKyleSaveData.password = this.formList[2].value;
				this.SerKyleSaveData.repassword = this.formList[3].value;
				this.SerKyleSaveData.code = this.formList[1].value;
				this.$api({
					url: '/api/data.php',
					method: 'get',
					data: {
						api_class: 'Html_registerClass',
						need_type: 'makeToReSetPasswordFun',
						form_page_type: "html",
						kyle_data: JSON.stringify(this.SerKyleSaveData),
						mySysId: 'no',
						loginsession: 0,
						loginsession_main: 0,
					}
				}).then(res => {
					this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '修改成功', // 提示信息
						tipIcon: 'iconchenggong', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
					this.tipTime = setTimeout(() => {
						// 跳转至登录页
						uni.reLaunch({
							url: '../login/index'
						})
					}, 2000)
				}, (err) => {
					this.formList[1].value = ''
				})
			},
			changeInput(index) {
				this.focusNum = index
			},
			toClear() {
				this.formList[this.focusNum].value = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		width: 100vw;
		height: 100vh;
		background-color: #000;
		flex-direction: column;

		.topBox {
			width: 100vw;
			height: 20vh;

			.home_top {
				padding-top: 10vh;
				width: 100%;
				height: 100%;

				&:after {
					width: 140%;
					height: 22vh;
					position: absolute;
					left: -20%;
					top: 0;
					z-index: 9;
					content: '';
					border-radius: 0 0 50% 50%;
					background-color: #633a97 !important;
					background: linear-gradient(60deg, #633a97 0, #4c87c6 92%) !important;
				}

				.logo {
					width: 24px;
					height: 24px;
					top: 14vh;
					left: 35%;
					position: absolute;
					z-index: 10;
					opacity: 0.5;
				}

				.qly {
					width: 80px;
					height: 24px;
					top: 14vh;
					left: 45%;
					position: absolute;
					z-index: 10;
					opacity: 0.5;
				}
			}
		}

		.case {
			width: 95%;
			height: 75%;
			margin-bottom: 2%;
			background-color: #fff;
			border-radius: 5px;

			.eachLine {
				width: 100%;
				height: 11%;
				padding: 0 15px;
				font-size: 18px;
				border-bottom: 1px solid #dcdcdc;
				box-sizing: border-box;

				.leftLine {
					width: 70%;

					text {
						width: 40%;
					}

					.defaultText {
						width: 80%;
						color: #98989b;
						padding-left: 20px;
					}
				}

				.clear {
					width: 15vw;
					color: #aaaaaa;
					font-size: 14px;
					padding: 3px 0;
					background-color: #f0f0f0;
					border-radius: 20px;
				}

				.code {
					padding: 10rpx 20rpx;
					font-size: 16px;
					font-weight: bold;
					border-radius: 10rpx;
					color: #333333;
					background-color: #f0f0f0;
					box-shadow: 0 1rpx 6rpx rgba(114, 130, 138, 0.2);
				}

				.active {
					color: #ffffff;
					background-color: #39b54a;
				}
			}

			.keyBoard {
				flex-wrap: wrap;
				height: 45%;

				.eachKey {
					width: 33%;
					height: 20%;
					font-size: 30px;
					font-weight: bold;
					color: #633a97;

					&:active {
						background-color: #9bddc4;
					}
				}
			}

			button {
				width: 95%;
				font-weight: bold;
				margin-bottom: 15px;
			}

			.login {
				background-color: #39b54a;
				color: #fff;
			}
		}
	}
</style>