export default {
	tempNameArray: [
		'src_material_id',
		'info_userid',
		'info_userout_company_id',
		'info_userout_company_id',
		'info_workshop_id',
		'info_workline_id',
		'info_workset_id',
		'src_material_part_line_id',
		'src_material_part_floor_id',
		'src_material_part_floor_data_id',
		'order_id',
		'order_id',
		'info_userout_goods_address_id',
		'info_userout_goods_address_id',
		'src_material_price_id',
		'src_material_price_id',
		'ass_equipment_id',
		'ass_mould_id',
		'info_userout_company_id',
		'info_userout_goods_address_id',
		'src_material_technology_id',
		'src_material_technology_link_id',
		'config_form_table_id',
		'info_userout_staff_link_id',
		'info_userout_staff_link_id',
		'info_userout_staff_link_id',
		'src_material_type_id',
	], //更新后返回根据head_info的style的数据
	tempNameValueArray: [
		'material_name',
		'chname',
		'com_name',
		'com_name',
		'workshop_name',
		'workline_name',
		'workset_name',
		'line_name',
		'floor_name',
		'batch_number',
		'order_title',
		'order_index',
		'info_userout_goods_address_id',
		'info_userout_goods_address_id',
		'src_material_price_id',
		'src_material_price_id',
		'equipment_name',
		'mould_name',
		'com_name',
		'info_userout_goods_address_id',
		'technology_name',
		'link_remark',
		'form_table_name',
		'staff_name',
		'staff_name',
		'staff_name',
		'type_name',
	],
	processingTableData(processingType, dataList, headList) {
		if (processingType == 'form') {
			var tableHeadId = "config_form_table_data_head_id";
		} else {
			var tableHeadId = "config_table_head_id";
		}
		var newList = [];
		var orgList = dataList;
		for (let index in dataList) {
			var tempDataInfo = dataList[index];
			for (let key in headList) {
				var tempHeadInfo = headList[key];
				var xxx = tempHeadInfo[tableHeadId];
				var head_style = parseInt(tempHeadInfo['head_style']);
				if (typeof(tempDataInfo['th_' + xxx]) == "undefined") {
					continue;
				}

				if (head_style != 0) {
					if (typeof(tempDataInfo['info_' + xxx][this.tempNameArray[head_style - 1]]) == "undefined" ||
						tempDataInfo['th_' + xxx] == 0) {
						tempDataInfo['th_' + xxx] = "未选择";
					} else {
						tempDataInfo['th_' + xxx] = tempDataInfo['info_' + xxx][this.tempNameValueArray[head_style -
							1]];
					}
					continue;
				}


				//如果是选择的
				if (tempHeadInfo['head_input_set'] == 20 || tempHeadInfo['head_input_set'] == 21) {
					if (typeof(tempHeadInfo.head_input_setjson) == 'string') {
						tempHeadInfo.head_input_setjson = JSON.parse(tempHeadInfo.head_input_setjson);
					}
					for (let iii in tempHeadInfo.head_input_setjson) {
						if (tempHeadInfo.head_input_setjson[iii].value == tempDataInfo['th_' + xxx]) {
							tempDataInfo['th_' + xxx] = tempHeadInfo.head_input_setjson[iii].name
						}
					}
				} else if (tempHeadInfo['head_input_set'] == 30 || tempHeadInfo['head_input_set'] == 31) {
					//如果是时间
					var dateType = tempHeadInfo['head_input_set'] == 30 ? 'date' : 'day-minutes';
					tempDataInfo['th_' + xxx] = this.dateFormatFun(tempDataInfo['th_' + xxx], dateType);
				} else {
					//把小数点去掉一下
					if (tempHeadInfo['head_input_save'] == '2') {
						tempDataInfo['th_' + xxx] = parseFloat(tempDataInfo['th_' + xxx]);
					}
				}
			}
			newList[newList.length] = tempDataInfo;
		}
		return newList
	},
	dateFormatFun: function(time, returnType) {
		time = time + '';
		if (time.length < 11) {
			time = parseInt(time, 10) * 1000;
		} else {
			time = parseInt(time, 10)
		}
		if (time > 0) {
			var dateStr = new Date(time);
			if ((dateStr.getMonth() + 1) < 10) {
				var month = '0' + (dateStr.getMonth() + 1);
			} else {
				var month = (dateStr.getMonth() + 1);
			}

			if (dateStr.getDate() < 10) {
				var day = '0' + dateStr.getDate();
			} else {
				var day = dateStr.getDate();
			}

			if (dateStr.getHours() < 10) {
				var hours = '0' + dateStr.getHours();
			} else {
				var hours = dateStr.getHours();
			}

			if (dateStr.getMinutes() < 10) {
				var Minutes = '0' + dateStr.getMinutes();
			} else {
				var Minutes = dateStr.getMinutes();
			}

			if (returnType == null || returnType == 'normal') {
				return dateStr.getFullYear() + '-' + month + '-' + day + ' ' + dateStr.getHours() + ':' + Minutes +
					':' + dateStr.getSeconds();
			} else if (returnType == 'date') {
				return dateStr.getFullYear() + '-' + month + '-' + day;
			} else if (returnType == 'day') {
				return month + '-' + day;
			} else if (returnType == 'day-minutes') {
				return dateStr.getFullYear() + '-' + month + '-' + day + " " + hours + ':' + Minutes;
			} else if (returnType == 'minutes') {
				return hours + ':' + Minutes;
			} else if (returnType == 'dateWeek') {
				var weekday = new Array(7)
				weekday[0] = "星期天"
				weekday[1] = "星期一"
				weekday[2] = "星期二"
				weekday[3] = "星期三"
				weekday[4] = "星期四"
				weekday[5] = "星期五"
				weekday[6] = "星期六"
				return month + '-' + day + ' ' + weekday[dateStr.getDay()] + ' ' + hours + ':' + Minutes;

			} else if (returnType == 'dateWeekEnd') {
				var weekday = new Array(7)
				weekday[0] = "星期天"
				weekday[1] = "星期一"
				weekday[2] = "星期二"
				weekday[3] = "星期三"
				weekday[4] = "星期四"
				weekday[5] = "星期五"
				weekday[6] = "星期六"
				return month + '-' + day + ' ' + weekday[dateStr.getDay()];

			} else if (returnType == 'countDown') {
				var EndTime = time;
				var NowTime = new Date();
				var t = EndTime - NowTime.getTime();
				var d = 0;
				var h = 0;
				var m = 0;
				var s = 0;
				if (t >= 0) {
					d = Math.floor(t / 1000 / 60 / 60 / 24);
					h = Math.floor(t / 1000 / 60 / 60 % 24);
					m = Math.floor(t / 1000 / 60 % 60);
					s = Math.floor(t / 1000 % 60);

					return "剩余：" + d + "天" + h + "时" + m + "分";
				} else { //超过
					t = t * -1;
					d = Math.floor(t / 1000 / 60 / 60 / 24);
					h = Math.floor(t / 1000 / 60 / 60 % 24);
					m = Math.floor(t / 1000 / 60 % 60);
					s = Math.floor(t / 1000 % 60);
					return "超过：" + d + "天" + h + "时" + m + "分";
				}


				//document.getElementById("t_d").innerHTML = d + "天";
				//document.getElementById("t_h").innerHTML = h + "时";
				//document.getElementById("t_m").innerHTML = m + "分";
				//document.getElementById("t_s").innerHTML = s + "秒";
				//return month + '-' + day + ' ' + weekday[dateStr.getDay()];

			} else if (returnType == 'passTime') {
				var UpdataTime = time;
				var NowTime = new Date();
				var t = UpdataTime - NowTime.getTime();
				var d = 0;
				var h = 0;
				var m = 0;
				var s = 0; { //超过
					t = t * -1;
					d = Math.floor(t / 1000 / 60 / 60 / 24);
					h = Math.floor(t / 1000 / 60 / 60 % 24);
					m = Math.floor(t / 1000 / 60 % 60);
					s = Math.floor(t / 1000 % 60);
					var returnStr = '';

					if (d != 0) {
						returnStr += d + "天";
					}
					if (h != 0) {
						returnStr += h + "小时";
					}
					if (m != 0) {
						returnStr += m + "分钟";
					}

					if (returnStr == '') {
						return returnStr = '刚刚';
					} else {
						return returnStr + '前';
					}
				}


				//document.getElementById("t_d").innerHTML = d + "天";
				//document.getElementById("t_h").innerHTML = h + "时";
				//document.getElementById("t_m").innerHTML = m + "分";
				//document.getElementById("t_s").innerHTML = s + "秒";
				//return month + '-' + day + ' ' + weekday[dateStr.getDay()];

			} else {
				return dateStr.getFullYear() + '-' + month + '-' + day + ' ' + dateStr.getHours() + ':' + Minutes +
					':' + dateStr.getSeconds();
			}

		} else {
			return '';
		}
	},
	LineDataFormulae(from_type, headList, dataLineInfo, formulaeList, set_type, config) {

		if (headList == undefined || headList.length == 0 || formulaeList == undefined || formulaeList.length == 0) {
			return dataLineInfo;
		}

		//如果已经关闭了自动计算公式
		if (dataLineInfo.auto_set != undefined && dataLineInfo.auto_set == 1) {
			return dataLineInfo
		}

		var thisHeadId = 'config_form_table_data_head_id';
		if (set_type == 'table') {
			thisHeadId = 'config_table_head_id';
		}

		//比如有指定的简单处理，将100*900的100赋值给其他字段
		if (config != undefined && config['upHeadInfo'] != undefined && config['upHeadInfo'][thisHeadId] != undefined &&
			config['upHeadInfo'].comm_set_json.easy_edit_to_process != undefined && config['upHeadInfo'].comm_set_json
			.easy_edit_to_process == 1) {
			this.tempArrayBySpecification = [];
			this.getMoreParameterBySpecification(dataLineInfo['th_' + config['upHeadInfo'][thisHeadId]]);
			var tempArray = config['upHeadInfo'].comm_set_json.easy_edit_to_uphead.split(',');
			if (tempArray[0] != undefined && dataLineInfo['th_' + tempArray[0]] != undefined) {
				dataLineInfo['th_' + tempArray[0]] = this.tempArrayBySpecification[0];
			}
			if (tempArray[1] != undefined && dataLineInfo['th_' + tempArray[1]] != undefined) {
				dataLineInfo['th_' + tempArray[1]] = this.tempArrayBySpecification[1];
			}
		}


		for (let formulae_key in formulaeList) {
			var formulae_value = formulaeList[formulae_key];
			//console.log('----------------------进行一个公式计算' + formulae_key + '------------------', formulae_value)
			if (formulae_value['count_type'] != 0) {
				//说明只在添加的时候计算
				if (formulae_value['count_type'] == 1) {
					if (from_type == 'updata') {
						continue;
					}
				} else if (formulae_value['count_type'] == 2) {
					//说明只在更新的计算
					if (from_type == 'add') {
						continue;
					}
				}
			}

			var main_config_table_head_id = 0;
			if (formulae_value['main_config_form_table_head_id'] != undefined && !isNaN(formulae_value[
					'main_config_form_table_head_id'])) {
				main_config_table_head_id = formulae_value['main_config_form_table_head_id']; //要赋值的表头
			} else if (formulae_value['main_config_table_head_id'] != undefined && !isNaN(formulae_value[
					'main_config_table_head_id'])) {
				main_config_table_head_id = formulae_value['main_config_table_head_id']; //要赋值的表头
			}

			var formulae_str = JSON.parse(formulae_value['formulae_str']); //公式
			if (main_config_table_head_id == 0 || formulae_str.length == 0) {
				continue;
			}
			//取出公式 再筛选一下加减乘除
			let arithmetic = "";
			for (let str_key in formulae_str) {
				var str_value = formulae_str[str_key];

				if (str_value == '+') {
					arithmetic += "+";
				} else if (str_value == '-') {
					arithmetic += '-';
				} else if (str_value == '*') {
					arithmetic += '*';
				} else if (str_value == '/') {
					arithmetic += '/';
				} else {
					//说明是头部字段18,17就怕数据不是一样的
					if (str_value.length == 18 || str_value.length == 17) {
						//每次计算的时候 重新查一下数据 不然多条计算取到还是旧数据
						for (let data_key in dataLineInfo) {
							//取出表头下的值
							if (data_key == "th_" + str_value) {
								//如果时间是空字符串那么就要变为0
								if (dataLineInfo[data_key] == '' || dataLineInfo[data_key] == null) {
									dataLineInfo[data_key] = 0;
								}
								//这里有一种情况，如果是选择和时间那么因为数据已经处理了，所以要把它处理回来
								if (isNaN(dataLineInfo[data_key])) {
									var thisSelectValue = 0; //默认未0，如果不改变就是0
									for (let tIndex in headList) {
										if (headList[tIndex][thisHeadId] == str_value) {
											if (headList[tIndex].head_input_set == 20 || headList[tIndex]
												.head_input_set == 21) {
												for (let selectIndex in headList[tIndex].head_input_setjson) {
													if (headList[tIndex].head_input_setjson[selectIndex].name ==
														dataLineInfo[data_key]) {
														thisSelectValue = headList[tIndex].head_input_setjson[
															selectIndex].value;
														break;
													}
												}
											} else if (headList[tIndex].head_input_set == 30 || headList[tIndex]
												.head_input_set == 31) {
												var getNum = new Date(dataLineInfo[data_key]).getTime();
												//thisSelectValue = dayjs(dataLineInfo[data_key]).unix();
												thisSelectValue = getNum / 1000;
											}
										}
									}

									arithmetic += thisSelectValue;
								} else {
									arithmetic += dataLineInfo[data_key];
								}
							}
						}
					} else {
						//说明是数字
						arithmetic += str_value;
					}
				}
			}
			//console.log('aaaa',arithmetic);
			//xlp 20190531 如果除数是0的话 就直接为空
			if (arithmetic.indexOf('/') >= 0) {
				let numArray = arithmetic.split('/');
				for (let key in numArray) {
					if (key == 1) {
						if (numArray[key] == null || numArray[key] == undefined || numArray[key] == 0 || parseFloat(
								numArray[key]) == 0) {
							arithmetic = "0";
						}
					}
				}
			}
			//console.log('计算公式' + main_config_table_head_id,formulae_str, arithmetic)

			//每次计算的时候 重新查一下数据 不然多条计算取到还是旧数据
			//4.0之后优化不需要每次查询，最后更新完成的时候自动赋值$dataInfo = $this->getNewDataInfo($headList, $config_table_id, $tb_auto_id);
			//赋值 给结果表头
			for (let data_key in dataLineInfo) {
				//取出表头下的值
				if (data_key == "th_" + main_config_table_head_id) {

					//赋值，这里要注意：负数，比如400--200，如：待生产量-库存，此时应该是负负得正
					if (arithmetic.indexOf('--') !== false) {
						//arithmetic = str_replace("--", "+", $arithmetic);
						//arithmetic=arithmetic.replace(/\--/g,'+')
						arithmetic = arithmetic.replace('--', '+')
					}
					var set_value = 0;
					//console.log('开始赋值', arithmetic, "th_" + main_config_table_head_id + '=' + dataLineInfo[data_key])
					try {
						set_value = eval(arithmetic);
					} catch (err) {
						//myInfo.commNotifyFun("计算公式有误：" + arithmetic + ' ID:' + main_config_table_head_id);
						console.log("计算公式有误：" + arithmetic + ' ID:' + main_config_table_head_id)
						return dataLineInfo;
					}
					//保留小数
					set_value = parseFloat(parseFloat(set_value).toFixed(4));
					//let getOrgValue = set_value;//等会儿条件不满足的时候会撤回到这

					//如果计算结果还要计算
					if (formulae_value['formulae_condition'] != undefined && formulae_value['formulae_condition'] !=
						'' && formulae_value['formulae_condition'] != '0') {

						var formulae_condition_field = 0;
						//获取比较级数据
						if (formulae_value['formulae_condition_field'].length == 18 || formulae_value[
								'formulae_condition_field'].length == 17) {
							//每次计算的时候 重新查一下数据 不然多条计算取到还是旧数据
							//$dataInfo = $this->getNewDataInfo($config_table_id, $tb_auto_id);
							for (let data_key1 in dataLineInfo) {
								//取出表头下的值
								//console.log('临时检测',formulae_value['formulae_condition_field'])
								if (data_key1 == "th_" + formulae_value['formulae_condition_field']) {
									formulae_condition_field = dataLineInfo[data_key1];
								}


								//注意这里如果是选择的，同时数据有不是数字，比如是已完成
								if (isNaN(formulae_condition_field)) {
									for (let headKey in headList) {
										if (headList[headKey][thisHeadId] == formulae_value[
												'formulae_condition_field'] && (headList[headKey].head_input_set ==
												20 ||
												headList[headKey].head_input_set == 21)) {
											for (let selectIndex in headList[headKey].head_input_setjson) {
												if (headList[headKey].head_input_setjson[selectIndex].name ==
													dataLineInfo[data_key]) {
													formulae_condition_field = headList[headKey].head_input_setjson[
														selectIndex].value;
													break;
												}
											}
										}
									}
								}


							}
						} else {
							formulae_condition_field = formulae_value['formulae_condition_field'];
						}

						//console.log('有条件',formulae_value['formulae_condition'],formulae_condition_field)
						//这里已经计算过了，如果formulae_condition_field还是等于18位整数那说明没有找到数据，可以直接ko
						if (formulae_condition_field.length != 18 && formulae_condition_field.length != 17) {
							let strSign = set_value + formulae_value['formulae_condition'] + formulae_condition_field;
							//说明满足条件了
							if (strSign.indexOf("=") >= 0 && strSign.indexOf("==") < 0 && strSign.indexOf("<=") < 0 &&
								strSign.indexOf(">=") < 0) {
								strSign = strSign.replace('=', '==')
							}

							try {
								eval(strSign)
							} catch (err) {
								//myInfo.commNotifyFun('请输入正确的数字');
								console.log('请输入正确的数字');
								break;
							}

							//console.log('开始判断',strSign)
							if (eval(strSign)) {
								//两个数字临时创建一个以免数据双向绑定给覆盖
								var compute_field = 0;
								var compute_condition_sign_field = 0;
								//获取一下要运算的数据
								if (formulae_value['compute_field'].length == 18 || formulae_value['compute_field']
									.length == 17) {
									//每次计算的时候 重新查一下数据 不然多条计算取到还是旧数据
									//$dataInfo = $this->getNewDataInfo($config_table_id, $tb_auto_id);
									for (let data_key2 in dataLineInfo) {
										//取出表头下的值
										if (data_key2 == "th_" + formulae_value['compute_field']) {
											compute_field = dataLineInfo[data_key2];
										}
									}
								} else {
									compute_field = formulae_value['compute_field'];
								}

								//获取一下要运算的数据
								if (formulae_value['compute_condition_sign_field'].length == 18 || formulae_value[
										'compute_condition_sign_field'].length == 17) {
									//每次计算的时候 重新查一下数据 不然多条计算取到还是旧数据
									//$dataInfo = $this->getNewDataInfo($config_table_id, $tb_auto_id);
									for (let data_key3 in dataLineInfo) {
										//取出表头下的值
										if (data_key3 == "th_" + formulae_value['compute_condition_sign_field']) {
											compute_condition_sign_field = dataLineInfo[data_key3];
										}
									}
								} else {
									compute_condition_sign_field = formulae_value['compute_condition_sign_field'];
								}

								//console.log('最后成功进入',strSign,' compute_field:'+compute_field +' compute_condition_sign_field'+compute_condition_sign_field );
								//console.log('看看原始数据判断（最后进入有没有问题）',formulae_value);
								if (compute_field.length != 18 && compute_field.length != 17 &&
									compute_condition_sign_field.length != 18 && compute_condition_sign_field.length !=
									17) {
									let signArray = ['+', '-', '*', '/'];
									if (signArray.indexOf(formulae_value['compute_condition_sign']) >= 0) {

										let strSignNew = compute_field + formulae_value['compute_condition_sign'] +
											compute_condition_sign_field;
										//赋值，这里要注意：负数，比如400--200，如：待生产量-库存，此时应该是负负得正
										if (strSign.indexOf('--') >= 0) {
											strSignNew = strSign.replace('--', '+')
										}
										try {
											set_value = eval(strSignNew);
										} catch (err) {
											set_value = 0;
											//myInfo.commNotifyFun('请输入正确的数字')
											console.log('请输入正确的数字')
										}
										//保留小数
										set_value = parseFloat(parseFloat(set_value).toFixed(4));
										//console.log('开始给最后一步赋值',strSignNew,'得到'+set_value)
									}
								}
								//console.log('最终赋值11：',set_value)
								dataLineInfo[data_key] = set_value;
							}
						}


					} else {
						//console.log('最终赋值22：',set_value)
						dataLineInfo[data_key] = set_value;
					}
				}
			}
		}

		return dataLineInfo;
		//计算完成之后重新在格式化一下
		//return this.loadTableBeforeHandlerFun(dataLineInfo, headList, set_type);
		//return dataLineInfo;
	}, //返回一个可以新增或者保存的信息数据，提交保存或者新增的时候
}