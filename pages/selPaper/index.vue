<template>
	<view class="pageOut">
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
			...mapMutations(['UPADTE_PRINTER']),
			selectWay(item) {
				this.selectedTpye = item.type
				uni.setStorageSync('paperType', item.type)
				this.UPADTE_PRINTER(null)
			},
			selectTime(item) {
				this.delayTime = item.type
				uni.setStorageSync('delayTime', item.type)
			},
			selectPage(item) {
				this.eachPage = item.type
				uni.setStorageSync('eachPage', item.type)
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