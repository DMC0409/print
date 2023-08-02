import dayjs from "dayjs";
import moment from 'moment'; //导入模块
moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn'); 

var formMainHelp = {
	tempNameArray: ['', 'src_material_id', 'info_userid', 'info_userout_company_id', 'info_userout_company_id',
		'info_workshop_id', 'info_workline_id', 'info_workset_id', 'src_material_storage_location_id',
		'src_material_storage_location_id', 'src_material_part_floor_data_id', 'order_id', 'order_id',
		'info_userout_goods_address_id', 'info_userout_goods_address_id', 'src_material_price_id',
		'src_material_price_id', 'ass_equipment_id', 'ass_mould_id', 'info_userout_company_id',
		'info_userout_goods_address_id', 'src_material_technology_id', 'src_material_technology_link_id',
		'config_form_table_id', 'info_userout_staff_link_id', 'info_userout_staff_link_id',
		'info_userout_staff_link_id', 'src_material_type_id', 'src_material_tag_id',
	], //更新后返回根据head_info的style的数据
	tempNameValueArray: ['', 'material_name', 'chname', 'com_name', 'com_name', 'workshop_name', 'workline_name',
		'workset_name', 'location_name', 'location_name', 'batch_number', 'order_title', 'order_index',
		'all_address', 'all_address', 'src_material_price_id', 'src_material_price_id', 'equipment_name',
		'mould_name', 'com_name', 'all_address', 'technology_name', 'link_remark', 'form_table_name',
		'staff_name', 'staff_name', 'staff_name', 'type_name', 'tag_name',
	],
	//生产表渲染函数，扫码后如果用户有修改，再次渲染
	showGroupTableDataProcessingFun: function(headList, dataInfo) {
		var getData = {
			title: '',
			desc: '',
			more: '',
			info: ''
		};
		for (let index in headList) {
			var headInfo = headList[index];
			//标题
			if (headInfo['comm_set_json']['title_set_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (dataInfo['info_' + headInfo['config_table_head_id']] != undefined &&
						dataInfo['info_' + headInfo['config_table_head_id']][this.tempNameValueArray[parseInt(
							headInfo['head_style'])]] != undefined) {
						if (getData['title'] != '') {
							getData['title'] += " | ";
						}
						getData['title'] += headInfo['head_name'] + ":" + dataInfo['info_' + headInfo[
							'config_table_head_id']][this
							.tempNameValueArray[headInfo['head_style']]
						];
					}
				} else {
					if (dataInfo['th_' + headInfo['config_table_head_id']] != undefined) {
						if (getData['title'] != '') {
							getData['title'] += " | ";
						}
						if (headInfo['head_input_set'] == '20' || headInfo['head_input_set'] == '21') {
							getData['title'] += headInfo['head_name'] + ":" + headInfo['head_input_setjson'][
								dataInfo['th_' + headInfo[
									'config_table_head_id']]
							].label;
						} else {
							getData['title'] += headInfo['head_name'] + ":" + dataInfo['th_' + headInfo[
								'config_table_head_id']];
						}
					}
				}
			}


			//描述
			if (headInfo['comm_set_json']['desc_set_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (dataInfo['info_' + headInfo['config_table_head_id']] != undefined && dataInfo['info_' +
							headInfo['config_table_head_id']][this.tempNameValueArray[headInfo['head_style']][
							0
						]] != undefined) {
						if (getData['desc'] != '') {
							getData['desc'] += " | ";
						}
						getData['desc'] += headInfo['head_name'] + ":" + dataInfo['info_' + headInfo[
							'config_table_head_id']][this.tempNameValueArray[headInfo['head_style']]];
					}
				} else {
					if (headInfo['head_input_set'] == '20' || headInfo['head_input_set'] == '21') {
						getData['desc'] += headInfo['head_name'] + ":" + headInfo['head_input_setjson'][
							dataInfo['th_' + headInfo[
								'config_table_head_id']]
						].label;
					} else {
						getData['desc'] += headInfo['head_name'] + ":" + dataInfo['th_' + headInfo[
							'config_table_head_id']];
					}
				}
			}

			//更多
			if (headInfo['comm_set_json']['more_set_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (dataInfo['info_' + headInfo['config_table_head_id']] != undefined && dataInfo['info_' +
							headInfo['config_table_head_id']][this.tempNameValueArray[headInfo['head_style']][
							0
						]] != undefined) {
						if (getData['more'] != '') {
							getData['more'] += " | ";
						}
						getData['more'] += headInfo['head_name'] + ":" + dataInfo['info_' + headInfo[
							'config_table_head_id']][this.tempNameValueArray[headInfo['head_style']]];
					}
				} else {
					if (headInfo['head_input_set'] == '20' || headInfo['head_input_set'] == '21') {
						getData['more'] += headInfo['head_name'] + ":" + headInfo['head_input_setjson'][
							dataInfo['th_' + headInfo[
								'config_table_head_id']]
						].label;
					} else {
						getData['more'] += headInfo['head_name'] + ":" + dataInfo['th_' + headInfo[
							'config_table_head_id']];
					}
				}
			}
			//信息
			if (headInfo['comm_set_json']['info_set_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (dataInfo['info_' + headInfo['config_table_head_id']] != undefined && dataInfo['info_' +
							headInfo['config_table_head_id']][this.tempNameValueArray[headInfo['head_style']][
							0
						]] != undefined) {
						if (getData['info'] != '') {
							getData['info'] += " | ";
						}
						getData['info'] += headInfo['head_name'] + ":" + dataInfo['info_' + headInfo[
							'config_table_head_id']][this.tempNameValueArray[headInfo['head_style']]];
					}
				} else {
					if (headInfo['head_input_set'] == '20' || headInfo['head_input_set'] == '21') {
						getData['info'] += headInfo['head_name'] + ":" + headInfo['head_input_setjson'][
							dataInfo['th_' + headInfo[
								'config_table_head_id']]
						].label;
					} else {
						getData['info'] += headInfo['head_name'] + ":" + dataInfo['th_' + headInfo[
							'config_table_head_id']];
					}
				}
			}


		}

		return getData;
	},
	//送货单表渲染函数，当创建成功或者修改成功后，调用本函数再次渲染
	showFormTableDataProcessingFun: function(formMainHeadList, formCenterHeadList, mainInfo) {
		var formShowUpInfo = {
			mainTitle: '',
			mainDesc: '',
			childDataList: [],
			mainBottom: '',
			showMainInfo: ''
		};
		for (let index in formMainHeadList) {
			let headInfo = formMainHeadList[index];
			if (headInfo['comm_set_json']['set_title_main_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (mainInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined && mainInfo[
							'info_' + headInfo['config_form_table_data_head_id']][this.tempNameValueArray[
							headInfo['head_style']]] != undefined) {
						if (formShowUpInfo['mainTitle'] != '') {
							formShowUpInfo['mainTitle'] += " | ";
						}
						formShowUpInfo['mainTitle'] += headInfo['head_name'] + ':' + mainInfo['info_' +
							headInfo[
								'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
							'head_style']]];
					}
				} else {
					if (mainInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
						if (formShowUpInfo['mainTitle'] != '') {
							formShowUpInfo['mainTitle'] += " | ";
						}
						//如果是日期
						if (headInfo['head_input_set'] == 30) {
							formShowUpInfo['mainTitle'] += headInfo['head_name'] + ':' +
								moment(mainInfo['th_' + headInfo[
									'config_form_table_data_head_id']] * 1000).format(
									'YYYY-MM-DD'
								);
						} else if (headInfo['head_input_set'] == 31) {
							//如果是时间
							formShowUpInfo['mainTitle'] += headInfo['head_name'] + ':' +
								moment(mainInfo['th_' + headInfo[
									'config_form_table_data_head_id']] * 1000).format(
									'YYYY-MM-DD hh:mm:ss'
								);
						} else {
							formShowUpInfo['mainTitle'] += headInfo['head_name'] + ':' + mainInfo['th_' +
								headInfo[
									'config_form_table_data_head_id']];
						}
					}
				}
			}
			if (headInfo['comm_set_json']['set_desc_main_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (mainInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined && mainInfo[
							'info_' + headInfo['config_form_table_data_head_id']][this.tempNameValueArray[
							headInfo['head_style']]] != undefined) {
						if (formShowUpInfo['mainDesc'] != '') {
							formShowUpInfo['mainDesc'] += " | ";
						}
						formShowUpInfo['mainDesc'] += headInfo['head_name'] + ':' + mainInfo['info_' + headInfo[
							'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
							'head_style']]];
					}
				} else {
					if (mainInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
						if (formShowUpInfo['mainDesc'] != '') {
							formShowUpInfo['mainDesc'] += " | ";
						}
						//如果是日期
						if (headInfo['head_input_set'] == 30) {
							formShowUpInfo['mainDesc'] += headInfo['head_name'] + ':' +
								moment(mainInfo['th_' + headInfo[
									'config_form_table_data_head_id']] * 1000).format(
									'YYYY-MM-DD'
								);
						} else if (headInfo['head_input_set'] == 31) {
							//如果是时间
							formShowUpInfo['mainDesc'] += headInfo['head_name'] + ':' +
								moment(mainInfo['th_' + headInfo[
									'config_form_table_data_head_id']] * 1000).format(
									'YYYY-MM-DD hh:mm:ss'
								);
						} else {
							formShowUpInfo['mainDesc'] += headInfo['head_name'] + ':' + mainInfo['th_' +
								headInfo[
									'config_form_table_data_head_id']];
						}
					}
				}
			}
			if (headInfo['comm_set_json']['set_info_main_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (mainInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined && mainInfo[
							'info_' + headInfo['config_form_table_data_head_id']][this.tempNameValueArray[
							headInfo['head_style']]] != undefined) {
						if (formShowUpInfo['showMainInfo'] != '') {
							formShowUpInfo['showMainInfo'] += " | ";
						}
						formShowUpInfo['showMainInfo'] += headInfo['head_name'] + ':' + mainInfo['info_' +
							headInfo[
								'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
							'head_style']]];
					}
				} else {
					if (mainInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
						if (formShowUpInfo['showMainInfo'] != '') {
							formShowUpInfo['showMainInfo'] += " | ";
						}
						//如果是日期
						if (headInfo['head_input_set'] == 30) {
							formShowUpInfo['showMainInfo'] += headInfo['head_name'] + ':' +
								moment(mainInfo['th_' + headInfo[
									'config_form_table_data_head_id']] * 1000).format(
									'YYYY-MM-DD'
								);
						} else if (headInfo['head_input_set'] == 31) {
							//如果是时间
							formShowUpInfo['showMainInfo'] += headInfo['head_name'] + ':' +
								moment(mainInfo['th_' + headInfo[
									'config_form_table_data_head_id']] * 1000).format(
									'YYYY-MM-DD hh:mm:ss'
								);
						} else {
							formShowUpInfo['showMainInfo'] += headInfo['head_name'] + ':' + mainInfo['th_' +
								headInfo[
									'config_form_table_data_head_id']];
						}
					}
				}
			}
			if (headInfo['comm_set_json']['set_bottom_main_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (mainInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined && mainInfo[
							'info_' + headInfo['config_form_table_data_head_id']][this.tempNameValueArray[
							headInfo['head_style']]] != undefined) {
						if (formShowUpInfo['mainBottom'] != '') {
							formShowUpInfo['mainBottom'] += " | ";
						}
						formShowUpInfo['mainBottom'] += headInfo['head_name'] + ':' + mainInfo['info_' +
							headInfo[
								'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
							'head_style']]];
					}
				} else {
					if (mainInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
						if (formShowUpInfo['mainBottom'] != '') {
							formShowUpInfo['mainBottom'] += " | ";
						}
						//如果是日期
						if (headInfo['head_input_set'] == 30) {
							formShowUpInfo['mainBottom'] += headInfo['head_name'] + ':' +
								moment(mainInfo['th_' + headInfo[
									'config_form_table_data_head_id']] * 1000).format(
									'YYYY-MM-DD'
								);
						} else if (headInfo['head_input_set'] == 31) {
							//如果是时间
							formShowUpInfo['mainBottom'] += headInfo['head_name'] + ':' +
								moment(mainInfo['th_' + headInfo[
									'config_form_table_data_head_id']] * 1000).format(
									'YYYY-MM-DD hh:mm:ss'
								);
						} else {
							formShowUpInfo['mainBottom'] += headInfo['head_name'] + ':' + mainInfo['th_' +
								headInfo[
									'config_form_table_data_head_id']];
						}
					}
				}
			}
		}

		//子列表
		if (mainInfo['childDataList'] == undefined || mainInfo['childDataList'].length == 0) {
			return formShowUpInfo;
		}


		//子列表
		for (let key in mainInfo['childDataList']) {
			let lineInfo = mainInfo['childDataList'][key];
			let getData = {
				title: '',
				desc: '',
				more: '',
				info: ''
			};
			for (let index in formCenterHeadList) {
				let headInfo = formCenterHeadList[index];
				//标题
				if (headInfo['comm_set_json']['title_child_show_pad'] != undefined) {
					if (headInfo['head_style'] != 0) {
						//如果没有数据
						if (lineInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined &&
							lineInfo['info_' + headInfo['config_form_table_data_head_id']][this
								.tempNameValueArray[headInfo['head_style']]
							] != undefined) {
							if (getData['title'] != '') {
								getData['title'] += " | ";
							}
							getData['title'] += lineInfo['info_' + headInfo['config_form_table_data_head_id']][
								this.tempNameValueArray[headInfo['head_style']]
							];
						}
					} else {
						if (lineInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
							if (getData['title'] != '') {
								getData['title'] += " | ";
							}
							if (headInfo['head_input_set'] == '20' || headInfo['head_input_set'] == '21') {
								getData['title'] += headInfo['head_name'] + ":" + headInfo['head_input_setjson']
									[
										lineInfo['th_' + headInfo[
											'config_form_table_data_head_id']]
									].label;
							} else {
								getData['title'] += headInfo['head_name'] + ":" + lineInfo['th_' + headInfo[
									'config_form_table_data_head_id']];
							}
						}
					}
				}

				//描述
				if (headInfo['comm_set_json']['desc_child_show_pad'] != undefined) {
					if (headInfo['head_style'] != 0) {
						//如果没有数据
						if (lineInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined &&
							lineInfo['info_' + headInfo['config_form_table_data_head_id']][this
								.tempNameValueArray[headInfo['head_style']]
							] != undefined) {
							if (getData['desc'] != '') {
								getData['desc'] += " | ";
							}
							getData['desc'] += headInfo['head_name'] + ":" + lineInfo['info_' + headInfo[
								'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
								'head_style']]];
						}
					} else {
						if (lineInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
							if (getData['desc'] != '') {
								getData['desc'] += " | ";
							}
							if (headInfo['head_input_set'] == '20' || headInfo['head_input_set'] == '21') {
								getData['desc'] += headInfo['head_name'] + ":" + headInfo['head_input_setjson'][
									lineInfo['th_' + headInfo[
										'config_form_table_data_head_id']]
								].label;
							} else {
								getData['desc'] += headInfo['head_name'] + ":" + lineInfo['th_' + headInfo[
									'config_form_table_data_head_id']];
							}
						}
					}
				}

				//更多
				if (headInfo['comm_set_json']['more_child_show_pad'] != undefined) {
					if (headInfo['head_style'] != 0) {
						//如果没有数据
						if (lineInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined &&
							lineInfo['info_' + headInfo['config_form_table_data_head_id']][this
								.tempNameValueArray[headInfo['head_style']]
							] != undefined) {
							if (getData['more'] != '') {
								getData['more'] += " | ";
							}
							getData['more'] += headInfo['head_name'] + ":" + lineInfo['info_' + headInfo[
								'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
								'head_style']]];
						}
					} else {
						if (lineInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
							if (getData['more'] != '') {
								getData['more'] += " | ";
							}
							if (headInfo['head_input_set'] == '20' || headInfo['head_input_set'] == '21') {
								getData['more'] += headInfo['head_name'] + ":" + headInfo['head_input_setjson'][
									lineInfo['th_' + headInfo[
										'config_form_table_data_head_id']]
								].label;
							} else {
								getData['more'] += headInfo['head_name'] + ":" + lineInfo['th_' + headInfo[
									'config_form_table_data_head_id']];
							}
						}
					}
				}
				//信息
				if (headInfo['comm_set_json']['info_child_show_pad'] != undefined) {
					if (headInfo['head_style'] != 0) {
						//如果没有数据
						if (lineInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined &&
							lineInfo['info_' + headInfo['config_form_table_data_head_id']][this
								.tempNameValueArray[headInfo['head_style']]
							] != undefined) {
							if (getData['info'] != '') {
								getData['info'] += " | ";
							}
							getData['info'] += headInfo['head_name'] + ":" + lineInfo['info_' + headInfo[
								'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
								'head_style']]];
						}
					} else {
						if (lineInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
							if (getData['info'] != '') {
								getData['info'] += " | ";
							}
							if (headInfo['head_input_set'] == '20' || headInfo['head_input_set'] == '21') {
								getData['info'] += headInfo['head_name'] + ":" + headInfo['head_input_setjson'][
									lineInfo['th_' + headInfo[
										'config_form_table_data_head_id']]
								].label;
							} else {
								getData['info'] += headInfo['head_name'] + ":" + lineInfo['th_' + headInfo[
									'config_form_table_data_head_id']];
							}
						}
					}
				}


			}
			formShowUpInfo['childDataList'][key] = getData;
		}


		return formShowUpInfo;
	},
	//送货单表渲染函数，当创建成功或者修改成功后，调用本函数再次渲染
	showFormTableListProcessingFun: function(formMainHeadList, lineInfo) {
		//子列表
		let getData = {
			title: '',
			desc: '',
			more: '',
			info: ''
		};
		for (let index in formMainHeadList) {
			let headInfo = formMainHeadList[index];
			//标题
			if (headInfo['comm_set_json']['list_title_main_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (lineInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined && lineInfo[
							'info_' + headInfo['config_form_table_data_head_id']][this.tempNameValueArray[
							headInfo['head_style']]] != undefined) {
						if (getData['title'] != '') {
							getData['title'] += " | ";
						}
						getData['title'] += lineInfo['info_' + headInfo['config_form_table_data_head_id']][this
							.tempNameValueArray[headInfo['head_style']]
						];
					}
				} else {
					if (lineInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
						if (getData['title'] != '') {
							getData['title'] += " | ";
						}
						if (headInfo['head_input_set'] == 30) {
							getData['title'] += moment(lineInfo['th_' + headInfo[
								'config_form_table_data_head_id']] * 1000).format('YYYY-MM-DD');
						} else if (headInfo['head_input_set'] == 31) {
							getData['title'] += moment(lineInfo['th_' + headInfo[
								'config_form_table_data_head_id']] * 1000).format('YYYY-MM-DD hh:mm:ss');
						} else {
							getData['title'] += lineInfo['th_' + headInfo[
								'config_form_table_data_head_id']];
						}
					}
				}
			}

			//描述
			if (headInfo['comm_set_json']['list_desc_main_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (lineInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined && lineInfo[
							'info_' + headInfo['config_form_table_data_head_id']][this.tempNameValueArray[
							headInfo['head_style']]] != undefined) {
						if (getData['desc'] != '') {
							getData['desc'] += " | ";
						}

						getData['desc'] += headInfo['head_name'] + ":" + lineInfo['info_' + headInfo[
							'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
							'head_style']]];
					}
				} else {
					if (lineInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
						if (getData['desc'] != '') {
							getData['desc'] += " | ";
						}
						getData['desc'] += headInfo['head_name'] + ":"
						if (headInfo['head_input_set'] == 30) {
							getData['desc'] += moment(lineInfo['th_' + headInfo[
								'config_form_table_data_head_id']] * 1000).format('YYYY-MM-DD');
						} else if (headInfo['head_input_set'] == 31) {
							getData['desc'] += moment(lineInfo['th_' + headInfo[
								'config_form_table_data_head_id']] * 1000).format('YYYY-MM-DD hh:mm:ss');
						} else {
							getData['desc'] += lineInfo['th_' + headInfo[
								'config_form_table_data_head_id']];
						}
					}
				}
			}

			//更多
			if (headInfo['comm_set_json']['list_more_main_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (lineInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined && lineInfo[
							'info_' + headInfo['config_form_table_data_head_id']][this.tempNameValueArray[
							headInfo['head_style']]] != undefined) {
						if (getData['more'] != '') {
							getData['more'] += " | ";
						}
						getData['more'] += headInfo['head_name'] + ":" + lineInfo['info_' + headInfo[
							'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
							'head_style']]];
					}
				} else {
					if (lineInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
						if (getData['more'] != '') {
							getData['more'] += " | ";
						}
						getData['more'] += headInfo['head_name'] + ":" + lineInfo['th_' + headInfo[
							'config_form_table_data_head_id']];
					}
				}
			}
			//信息
			if (headInfo['comm_set_json']['list_info_main_show_pad'] != undefined) {
				if (headInfo['head_style'] != 0) {
					//如果没有数据
					if (lineInfo['info_' + headInfo['config_form_table_data_head_id']] != undefined && lineInfo[
							'info_' + headInfo['config_form_table_data_head_id']][this.tempNameValueArray[
							headInfo['head_style']]] != undefined) {
						if (getData['info'] != '') {
							getData['info'] += " | ";
						}

						getData['info'] += headInfo['head_name'] + ":" + lineInfo['info_' + headInfo[
							'config_form_table_data_head_id']][this.tempNameValueArray[headInfo[
							'head_style']]];
					}
				} else {
					if (lineInfo['th_' + headInfo['config_form_table_data_head_id']] != undefined) {
						if (getData['info'] != '') {
							getData['info'] += " | ";
						}
						getData['info'] += headInfo['head_name'] + ":"
						if (headInfo['head_input_set'] == 30) {
							getData['info'] += moment(lineInfo['th_' + headInfo[
								'config_form_table_data_head_id']] * 1000).format('YYYY-MM-DD');
						} else if (headInfo['head_input_set'] == 31) {
							getData['info'] += moment(lineInfo['th_' + headInfo[
								'config_form_table_data_head_id']] * 1000).format('YYYY-MM-DD hh:mm:ss');
						} else {
							getData['info'] += lineInfo['th_' + headInfo[
								'config_form_table_data_head_id']];
						}
					}
				}
			}
		}
		return getData;
	},
	//返回一个可以新增或者保存的信息数据，提交保存或者新增的时候 return {'sign': 0, 'info': '错误信息', data: '数据'}
	returnSetAllDataFun: function(mainHeadList, centerHeadList, mainInfo) {
		var returnMainInfo = {
			ftb_main_auto_id: mainInfo.ftb_main_auto_id == undefined ? 0 : mainInfo.ftb_main_auto_id
		};
		var returnUpdataChildList = [];
		var returnAddChildList = [];
		for (let index in mainHeadList) {
			let thisHeadInfo = mainHeadList[index];
			if (thisHeadInfo['head_input_set'] == 3) {
				continue;
			}

			if (thisHeadInfo['head_style'] != 0) {

				if (mainInfo['info_' + thisHeadInfo['config_form_table_data_head_id']] != undefined) {
					let getValue = mainInfo['info_' + thisHeadInfo['config_form_table_data_head_id']][this
						.tempNameArray[thisHeadInfo['head_style']]
					];
					if (getValue == undefined || isNaN(getValue)) {
						returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = 0;
					} else {
						returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = getValue;
					}
				} else {
					returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = 0;
				}
			} else {
				if (thisHeadInfo['head_input_set'] == 30 || thisHeadInfo['head_input_set'] == 31) {
					if (mainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] == null || mainInfo[
							'th_' + thisHeadInfo['config_form_table_data_head_id']] == '') {
						returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = 0;
					} else {
						returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = moment(Number(
							mainInfo[
								'th_' + thisHeadInfo['config_form_table_data_head_id']])).valueOf();
					}
				} else if (thisHeadInfo['head_input_set'] == 40) {
					if (mainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] == '-' && mainInfo[
							'th_' + thisHeadInfo['config_form_table_data_head_id']] == '' || mainInfo['th_' +
							thisHeadInfo['config_form_table_data_head_id']].length == 0 || mainInfo['th_' +
							thisHeadInfo['config_form_table_data_head_id']][0].url == undefined) {
						mainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = '[]';
					} else {
						returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = JSON.stringify(
							mainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']]);
					}
				} else {
					returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = mainInfo['th_' +
						thisHeadInfo['config_form_table_data_head_id']];
				}
			}

			//最后检验一下是不是有错误的信息
			if (thisHeadInfo['head_input_save'] == 1 || thisHeadInfo['head_input_save'] == 2 || thisHeadInfo[
					'head_input_save'] == 5) {
				if (isNaN(returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']])) {
					return {
						'sign': 0,
						'info': '【' + thisHeadInfo.head_name + '】输入的信息不规范',
						data: returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']]
					}
				}
			} else {
				if (returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] == '') {
					returnMainInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = '-';
				}
			}
		}

		//时间戳
		if (mainInfo.childDataList.length > 0) {
			for (let index in mainInfo.childDataList) {
				var tempLineInfo = mainInfo.childDataList[index];
				//像某些参数必须返回,后台需要计算
				var getLineInfo = {
					show_index: parseInt(index) + 1,
					order_id: tempLineInfo.order_id != undefined && !isNaN(tempLineInfo.order_id) ?
						tempLineInfo.order_id : 0,
					config_table_id: tempLineInfo.config_table_id != undefined && !isNaN(tempLineInfo
						.config_table_id) ? tempLineInfo.config_table_id : 0,
					tb_auto_id: tempLineInfo.tb_auto_id != undefined && !isNaN(tempLineInfo.tb_auto_id) ?
						tempLineInfo.tb_auto_id : 0,
					src_config_form_table_id: tempLineInfo.src_config_form_table_id != undefined && !isNaN(
							tempLineInfo.src_config_form_table_id) ? tempLineInfo.src_config_form_table_id :
						0,
					src_ftb_main_auto_id: tempLineInfo.src_ftb_main_auto_id != undefined && !isNaN(
						tempLineInfo.src_ftb_main_auto_id) ? tempLineInfo.src_ftb_main_auto_id : 0,
					src_ftb_child_auto_id: tempLineInfo.src_ftb_child_auto_id != undefined && !isNaN(
						tempLineInfo.src_ftb_child_auto_id) ? tempLineInfo.src_ftb_child_auto_id : 0,
					auto_set: tempLineInfo.auto_set != undefined && !isNaN(tempLineInfo.auto_set) ?
						tempLineInfo.auto_set :
						0, //src_material_id:tempLineInfo.order_id!=undefined && !isNaN(tempLineInfo.src_material_id),
					//销售合同有可能会生成对应物料
					src_material_id: tempLineInfo.src_material_id != undefined && !isNaN(tempLineInfo
						.src_material_id) ? tempLineInfo.src_material_id : 0,
				};

				for (let headIndex in centerHeadList) {
					let thisHeadInfo = centerHeadList[headIndex];
					if (thisHeadInfo['head_input_set'] == 3) {
						continue;
					}

					if (thisHeadInfo['head_style'] != 0) {
						if (tempLineInfo['info_' + thisHeadInfo['config_form_table_data_head_id']] ==
							undefined) {
							//这里还有一种情况，比如在导入的时候要获取导入的表名，由于后台没有自动赋值，因为刚刚获取的时候是ID没有名称，因此要保存完之后才会有，所以这里还需要在判断一下
							if (tempLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] ==
								undefined || isNaN(tempLineInfo['th_' + thisHeadInfo[
									'config_form_table_data_head_id']]) || tempLineInfo['th_' + thisHeadInfo[
									'config_form_table_data_head_id']].length != 18) {
								getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = 0;
							} else {
								getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] =
									tempLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']]
							}
						} else {
							let getValue = tempLineInfo['info_' + thisHeadInfo[
								'config_form_table_data_head_id']][this.tempNameArray[thisHeadInfo[
								'head_style']]];
							if (getValue == undefined || isNaN(getValue)) {
								//这里还有一种情况，比如在导入的时候要获取导入的表名，由于后台没有自动赋值，因为刚刚获取的时候是ID没有名称，因此要保存完之后才会有，所以这里还需要在判断一下
								if (tempLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] ==
									undefined || isNaN(tempLineInfo['th_' + thisHeadInfo[
										'config_form_table_data_head_id']]) || tempLineInfo['th_' +
										thisHeadInfo['config_form_table_data_head_id']].length != 18) {
									getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = 0;
								} else {
									getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] =
										tempLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']];
								}
							} else {
								getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = getValue;
							}
						}
					} else {
						if (thisHeadInfo['head_input_set'] == 40) {
							if (tempLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']][0] !=
								undefined && tempLineInfo['th_' + thisHeadInfo[
									'config_form_table_data_head_id']][0].url != undefined) {
								getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = JSON
									.stringify(tempLineInfo['th_' + thisHeadInfo[
										'config_form_table_data_head_id']]);
							} else {
								getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = '[]';
							}
						} else if (thisHeadInfo['head_input_set'] == 30 || thisHeadInfo['head_input_set'] ==
							31) {
							var getTimeNum = moment(Number(tempLineInfo['th_' + thisHeadInfo[
								'config_form_table_data_head_id']])).valueOf();
							if (!isNaN(getTimeNum)) {
								getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] =
									getTimeNum;
							} else {
								getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = 0;
							}
						} else if (thisHeadInfo['head_input_set'] == 20 || thisHeadInfo['head_input_set'] ==
							21) {
							var isSelect = false;
							if (thisHeadInfo['head_input_setjson'] != undefined && thisHeadInfo[
									'head_input_setjson'].length > 0) {
								for (let key in thisHeadInfo['head_input_setjson']) {
									if (thisHeadInfo['head_input_setjson'][key]['name'] == tempLineInfo['th_' +
											thisHeadInfo['config_form_table_data_head_id']]) {
										isSelect = true;
										getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] =
											thisHeadInfo['head_input_setjson'][key]['value'];
									}
								}
							}
							if (isSelect == false) {
								//说明没有被选中，要给默认赋值一个
								if (thisHeadInfo['head_input_setjson'][0] != undefined && thisHeadInfo[
										'head_input_setjson'][0]['value'] != undefined) {
									getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] =
										thisHeadInfo['head_input_setjson'][0]['value'];
								} else {
									//0默认1int2decimal3varchar4text5bigint
									getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = 0;
								}
							}
						} else {
							getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = tempLineInfo[
								'th_' + thisHeadInfo['config_form_table_data_head_id']];
						}
					}


					//最后检验一下是不是有错误的信息
					if (thisHeadInfo['head_input_save'] == 1 || thisHeadInfo['head_input_save'] == 2 ||
						thisHeadInfo['head_input_save'] == 5) {
						if (isNaN(getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']])) {
							return {
								'sign': 0,
								'info': '其中一行，【' + thisHeadInfo.head_name + '】输入的信息不规范',
								data: getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']]
							}
						}
					} else {
						if (getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] == '') {
							getLineInfo['th_' + thisHeadInfo['config_form_table_data_head_id']] = '-';
						}
					}


				}

				if (tempLineInfo.ftb_child_auto_id != undefined && tempLineInfo.ftb_child_auto_id != null && !
					isNaN(tempLineInfo.ftb_child_auto_id) && tempLineInfo.ftb_child_auto_id > 0) {
					getLineInfo['ftb_child_auto_id'] = tempLineInfo.ftb_child_auto_id;
					returnUpdataChildList.push(getLineInfo);
				} else {
					returnAddChildList.push(getLineInfo);
				}
			}
		}

		return {
			'sign': 1,
			'info': 'ok',
			data: {
				returnMainInfo: returnMainInfo,
				returnAddChildList: returnAddChildList,
				returnUpdataChildList: returnUpdataChildList
			}
		}
	},
	//公式计算函数，当送货单表修改其中一行的时候，本函数要执行公式计算处理
	processingFormTableLineDataFun: function(formMainHeadList, formCenterHeadList, mainInfo, LineInfo,
		formulaList) {
		//
	},
}
export default formMainHelp;