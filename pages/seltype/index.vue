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
			<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="120">
				<uni-segmented-control :current="current" :values="wayArr" styleType="button" @clickItem="onClickItem"
					activeColor="#39b54a"></uni-segmented-control>
			</scroll-view>
			<view class="content" v-if="showType.length!=0">
				<block v-if="showType[current].child.length!=0">
					<view class="eachLine flex align-center justify-between" @click="selWay(item)"
						v-for="(item,index) in showType[current].child" :key="index">
						{{item.type_name}}
						<i v-if="srcTypeId === item.src_material_type_id" class="iconfont iconchenggong"></i>
					</view>
				</block>
				<view class="empty flex justify-center align-center" v-else>
					暂无数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseInfo: uni.getStorageSync('baseInfo'),
				current: 0,
				wayArr: [],
				// 可选类型源数据
				contentArr: [],
				srcTypeId: 0,
				keyword: '',
				// 真实显示的可选类型
				showType: []
			}
		},
		onLoad(options) {
			// 获取选中的工具id
			this.srcTypeId = options.srcTypeId
		},
		watch: {
			keyword(newVal, oldVal) {
				this.search()
			}
		},
		mounted() {
			// 缓存中获取工序列表数据
			this.contentArr = this.baseInfo.typeList
			// 构建可选工序父级菜单
			for (let i in this.contentArr) {
				if (this.contentArr[i].main_src_material_type_id == '0') {
					// 获取选中的父级菜单下可选子级数据
					this.wayArr.push(this.contentArr[i].type_name)
				}
				for (let j of this.contentArr[i].child) {
					// 回显选中的工序
					if (j.src_material_type_id == this.srcTypeId) {
						this.current = Number(i)
					}
				}
			}
			// 深度拷贝工序列表数据，供筛选使用
			this.showType = JSON.parse(JSON.stringify((this.contentArr)))
		},
		methods: {
			search() {
				this.showType = []
				for (let i in this.contentArr) {
					// 深度拷贝当前可选子级工序数据
					let eachKind = JSON.parse(JSON.stringify((this.contentArr[i])))
					eachKind.child = []
					// 轮询筛选与关键词匹配的工序
					for (let j of this.contentArr[i].child) {
						if (j.type_name.indexOf(this.keyword) != -1) {
							eachKind.child.push(j)
						}
					}
					this.showType.push(eachKind)
				}
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			selWay(item) {
				let index = -1;
				// 获取选中工序的下标
				for (let i in this.baseInfo.typeList[this.current].child) {
					if (this.baseInfo.typeList[this.current].child[i].src_material_type_id == item.src_material_type_id) {
						index = Number(i)
					}
				}
				// 删除选中项置顶
				let deleteItem = this.baseInfo.typeList[this.current].child.splice(index, 1)
				// 可选企业数组前增加删除的元素
				this.baseInfo.typeList[this.current].child.unshift(deleteItem[0])
				// 按升序重新排序企业数组
				for (let i in this.baseInfo.typeList[this.current].child) {
					this.baseInfo.typeList[this.current].child[i].sortNum = Number(i)
				}
				this.baseInfo.typeList[this.current].child = this.baseInfo.typeList[this.current].child.sort((a, b) => {
					return a.sortNum - b.sortNum
				})
				// 更新缓存数据
				uni.setStorageSync('baseInfo', this.baseInfo)
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.$vm.src_material_type_id = item.src_material_type_id;
				uni.navigateBack({
					delta: 1
				})
			},
			scroll() {}
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
			height: 91vh;
			position: absolute;
			bottom: 0;
			overflow: hidden;

			.search {
				width: 95vw;
				margin: 0 auto 20rpx auto;

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

			.scroll-view_H {
				white-space: nowrap;
				width: 100%;
				height: 5vh;
			}

			.segmented-control {
				height: 100%;
				overflow: scroll;

				/deep/.segmented-control__text {
					padding: 0 5vw;
				}
			}

			.segmented-control::-webkit-scrollbar {
				display: none;
			}

			.content {
				width: 100%;
				height: 88%;
				overflow: auto;

				.empty {
					width: 100%;
					height: 100%;
				}

				.eachLine {
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