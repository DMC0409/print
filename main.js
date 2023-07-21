import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

// 引入vueX
import store from 'store/index.js'
// 引入接口文件
import {
	myRequest,
} from './api/http.js';
// 引入自定义弹窗
import tipModal from '@/components/tipModal/tipModal.vue'
// 引入调试按钮
import adjust from '@/components/ball/ball.vue'
// 引入工具js
import utils from './utils/utils.js'
// 引入表单工具js
import tableUtils from './utils/index.js'
import moment from 'moment'; //导入模块
moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn'); 

Vue.prototype.$moment = moment; //赋值使用
Vue.prototype.$api = myRequest
Vue.prototype.$Utils = utils
Vue.prototype.$tableUtils = tableUtils
Vue.component('tip-modal', tipModal)
Vue.component('adjust', adjust)
try {
	function isPromise(obj) {
		return (
			!!obj &&
			(typeof obj === "object" || typeof obj === "function") &&
			typeof obj.then === "function"
		);
	}

	// 统一 vue2 API Promise 化返回格式与 vue3 保持一致
	uni.addInterceptor({
		returnValue(res) {
			if (!isPromise(res)) {
				return res;
			}
			return new Promise((resolve, reject) => {
				res.then((res) => {
					if (res[0]) {
						reject(res[0]);
					} else {
						resolve(res[1]);
					}
				});
			});
		},
	});
} catch (error) {}

const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif