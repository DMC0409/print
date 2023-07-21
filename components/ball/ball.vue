<template>
	<view class="" v-if="adjustSwitch">
		<movable-area class="movableArea">
			<movable-view @click="toLogPage" class="movableView flex align-center justify-center" direction="all"
				x="600rpx" y="800rpx">
				<text>调试</text>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: "ball",
		data() {
			return {};
		},
		computed: {
			...mapState(['adjustSwitch'])
		},
		methods: {
			toLogPage() {
				uni.navigateTo({
					url: '../adjust/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.movableArea {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素
		z-index: 999999;

		.movableView {
			pointer-events: auto; //可以点击
			width: 15vw;
			height: 15vw;
			background-color: green;
			color: #fff;
			border-radius: 50%;
		}
	}

	// .adjustOut {
	// 	position: absolute;
	// 	top: 0;
	// 	background-color: green;
	// 	color: #fff;
	// 	width: 15vw;
	// 	height: 15vw;
	// 	z-index: 1000;
	// 	border-radius: 50%;
	// }
</style>