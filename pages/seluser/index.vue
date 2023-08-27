<template>
	<view class="pageOut">
		<!-- 调试按钮 -->
		<adjust></adjust>
		<view class="userOut">
			<view class="search flex align-center justify-between">
				<input type="text" v-model="keyword" placeholder="请输入关键词">
				<view class="searchBtn" @click="search">
					搜索
				</view>
			</view>
			<view class="userList">
				<view class="eachUser flex align-center justify-between" @click="selUser(item)"
					v-for="(item,index) in userList" :key="item.info_userout_company_id">
					{{item.short_name}}
					<i v-if="selectedID === item.info_userout_company_id" class="iconfont iconchenggong"></i>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				baseInfo: uni.getStorageSync('baseInfo'),
				userList: [],
				selectedID: ''
			}
		},
		onLoad(options) {
			// 回显选中的企业id
			this.selectedID = options.companyId
		},
		mounted() {
			// 缓存中获取工企业列表数据
			this.userList = this.baseInfo.buyerList
		},
		watch: {
			keyword(newVal, oldVal) {
				this.search()
			}
		},
		methods: {
			search() {
				this.userList = []
				if (this.keyword === '') {
					// 关键词为空则显示所有可选企业数据
					this.userList = this.baseInfo.buyerList
				} else {
					// 轮询筛选与关键词匹配的企业
					for (let i of this.baseInfo.buyerList) {
						if (i.short_name.indexOf(this.keyword) != -1) {
							this.userList.push(i)
						}
					}
				}
			},
			selUser(item) {
				let index = -1;
				// 获取选中企业的下标
				for (let i in this.baseInfo.buyerList) {
					if (this.baseInfo.buyerList[i].info_userout_company_id == item.info_userout_company_id) {
						index = Number(i)
					}
				}
				// 删除选中项置顶
				let deleteItem = this.baseInfo.buyerList.splice(index, 1)
				// 可选企业数组前增加删除的元素
				this.baseInfo.buyerList.unshift(deleteItem[0])
				// 按升序重新排序企业数组
				for (let i in this.baseInfo.buyerList) {
					this.baseInfo.buyerList[i].sortNum = Number(i)
				}
				this.baseInfo.buyerList = this.baseInfo.buyerList.sort((a, b) => {
					return a.sortNum - b.sortNum
				})
				// 更新缓存数据
				uni.setStorageSync('baseInfo', this.baseInfo)
				// 向上个页面传参
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.$vm.info_userout_company_id = item.info_userout_company_id;
				uni.navigateBack({
					delta: 1
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

		.userOut {
			width: 100vw;
			height: 90vh;
			position: absolute;
			bottom: 0;
			overflow: hidden;

			.search {
				width: 95vw;
				margin: 0 auto;

				input {
					width: 65%;
					padding: 10rpx;
					border: 2rpx solid #ccc;
					border-radius: 10rpx;
				}

				.searchBtn {
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
			}

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