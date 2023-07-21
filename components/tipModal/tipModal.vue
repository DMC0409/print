<template>
	<view class="outBorder flex align-center justify-center" v-if="vuex_TipModal.isShow">
		<!-- 遮罩层 -->
		<view class="mark" v-show="vuex_TipModal.mark"></view>
		<!-- 主内容 -->
		<view class="flex align-center justify-center"
			:class="{'tipSelf':vuex_TipModal.mode == 'self','tipCustom':vuex_TipModal.mode == 'custom','hideShowActive':!vuex_TipModal.isShow,'showActive':vuex_TipModal.isShow}">
			<i v-show="vuex_TipModal.tipIcon!=''" class="iconfont"
				:class="vuex_TipModal.tipIcon=='iconloading'?'turnRound iconloading':vuex_TipModal.tipIcon"
				:style="{color:judgeColor(vuex_TipModal.tipIcon)}"></i>
			<view class="title">{{vuex_TipModal.tipText}}</view>
			<view class="mainText">{{vuex_TipModal.contentText}}</view>
			<!-- 操作按钮 -->
			<button v-show="vuex_TipModal.mode == 'custom'" @tap="toEmit">{{vuex_TipModal.buttonText}}</button>
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
				closeTimer: null,
			}
		},
		computed: {
			...mapState(['vuex_TipModal'])
		},
		mounted() {
			// 初始化一个动画
			var animation = uni.createAnimation({
				// 动画时间
				duration: 1000,
				// 动画速度
				timingFunction: 'linear',
			})
			// 存在return字段中
			this.animation = animation
		},
		watch: {
			vuex_TipModal: {
				handler(newVal, oldVal) {
					if (newVal.isShow) {
						if (newVal.duration != 0) {
							this.closeTimer = setTimeout(() => {
								// 关闭弹窗
								this.UPDATE_TIPMODAL({
									isShow: false,
									tipText: '', // 提示信息
									tipIcon: '', // 图标名称
									mark: true, // 是否有蒙版
									duration: 0, // 持续时间
									mode: '' // 弹窗模式
								})
								clearTimeout(this.closeTimer)
							}, newVal.duration)
						}
					}
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL']),
			toEmit() {
				// 关闭弹窗
				this.UPDATE_TIPMODAL({
					isShow: false,
					tipText: '', // 提示信息
					tipIcon: '', // 图标名称
					mark: true, // 是否有蒙版
					duration: 0, // 持续时间
					mode: '' // 弹窗模式
				})
			},
			// 判断icon颜色
			judgeColor(icon) {
				let color = ''
				switch (icon) {
					case 'iconchenggong':
						color = '#a5dc86'
						break;
					case 'iconshibai':
						color = '#f27474'
						break;
					case 'iconloading':
						color = '#87adbd'
						break;
				}
				return color
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes fadenum {
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes show {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes hide {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	.outBorder {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10000;

		.mark {
			width: 100%;
			height: 100%;
			position: absolute;
			background: rgba(0, 0, 0, .3);
		}
		
		.hideShowActive {
			animation: hide .5s 1;
		}
		.showActive{
			animation: show .5s 1;
		}

		.tipSelf,
		.tipCustom {
			background: #fff;
			color: rgba(0, 0, 0, .65);
			flex-direction: column;
			border-radius: 10rpx;
			z-index: 10001;

			i {
				font-size: 30px;
			}

			button {
				background-color: #7066e0;
				border: 3px solid #b2adeb;
				color: #fff;
				margin-top: 5vh;
				min-width: 10vw;
			}

			.turnRound {
				animation: fadenum 3s infinite;
			}

			.title {
				font-size: 16px;
				font-weight: bold;
				margin-top: 10px;
			}

			.mainText {
				font-size: 14px;
				margin-top: 3vh;
			}
		}

		.tipSelf {
			padding: 15px 30px;
		}

		.tipCustom {
			width: 40vw;
			height: 35vw;
		}
	}
</style>