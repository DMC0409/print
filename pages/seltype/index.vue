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
			this.srcTypeId = options.srcTypeId
		},
		watch: {
			keyword(newVal, oldVal) {
				this.search()
			}
		},
		mounted() {
			this.contentArr = []
			let stepArr = []
			// 构建可选子菜单数组对象结构
			for (let i of this.baseInfo.typeList) {
				if (i.main_src_material_type_id == '0') {
					stepArr.push(i)
					let obj = i
					obj.child = []
					this.contentArr.push(i)
				}
			}
			// 排序父菜单顺序
			stepArr = stepArr.sort((a, b) => {
				return a.type_number - b.type_number
			})
			for (let i of stepArr) {
				this.wayArr.push(i.type_name)
			}
			// 匹配可选子菜单数组对象数据
			for (let i of this.baseInfo.typeList) {
				for (let j of this.contentArr) {
					if (i.main_src_material_type_id == j.src_material_type_id) {
						j.child.push(i)
					}
				}
			}
			this.showType = JSON.parse(JSON.stringify((this.contentArr)))
		},
		methods: {
			search() {
				this.showType = []
				for (let i in this.contentArr) {
					let eachKind = JSON.parse(JSON.stringify((this.contentArr[i])))
					eachKind.child = []
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