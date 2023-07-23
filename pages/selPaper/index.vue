<template>
	<view class="pageOut">
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="userOut">
			<view class="userList">
				<view class="eachUser flex align-center justify-between" @click="selUser(item)"
					v-for="(item,index) in paperArr" :key="index">
					{{item.name}}
					<i v-if="selectedTpye === item.type" class="iconfont iconchenggong"></i>
				</view>
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
				paperArr: [{
						name: '不干胶',
						type: 0
					},
					{
						name: '热敏纸',
						type: 1
					}
				],
				selectedTpye: uni.getStorageSync('paperType')
			}
		},
		mounted() {

		},
		methods: {
			...mapMutations(['UPADTE_PRINTER']),
			selUser(item) {
				this.selectedTpye = item.type
				uni.setStorageSync('paperType', item.type)
				this.UPADTE_PRINTER(null)
			}
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

			.userList {
				width: 100vw;
				height: 95%;
				overflow: auto;

				.eachUser {
					padding: 5%;
					border-bottom: 2rpx solid #eee;

					i {
						color: #39b54a;
						font-size: 50rpx;
					}
				}
			}
		}
	}
</style>