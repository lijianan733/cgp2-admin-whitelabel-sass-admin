/**
 * by 姚宏
 */
Ext.syncRequire('CGP.bommaterialattribute.model.Attribute');
Ext.onReady(function() {
	var optionId = -1;

	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
	var setsId = parseInt(getQueryString('id'));
	var me = this;
	this.localAttributeOptionStore = Ext.create("CGP.bommaterialattribute.store.LocalAttributeOption", {
		change: function() {
			setValueDefault(page.form);
		}
	});
	this.attributeStore = Ext.create("CGP.bommaterialattribute.store.Attribute");
	controller = Ext.create("CGP.bommaterialattribute.controller.Edit");
	localAttributeOptionStore.load({ //加载attributeStore
		callback: function(records2) {}
	});
	//加载attributeStore
	attributeStore.load({
		callback: function(records2) {}
	});
	//加载options
	var optionGrid = {
			selModel: new Ext.selection.RowModel({
				mode: 'MULTI'
			}),
			store: localAttributeOptionStore,
			height: 200,
			width: 400,
			id: 'optionGridid',
			columns: [{
				xtype: 'actioncolumn',
				itemId: 'actioncolumn',
				width: 60,
				sortable: false,
				resizable: false,
				menuDisabled: true,
				items: [{
					iconCls: 'icon_edit icon_margin',
					itemId: 'actionedit',
					tooltip: 'Edit',
					handler: function(view, rowIndex, colIndex) {
						var store = view.getStore();
						var record = store.getAt(rowIndex);
						controller.openOptionWindow(page, record);
						setValueDefaultAfterFirst(null);
					}
				}, {
					iconCls: 'icon_remove icon_margin',
					itemId: 'actionremove',
					tooltip: 'Remove',
					handler: function(view, rowIndex, colIndex) {
						setValueDefaultAfterFirst(null);
						var store = view.getStore();
						ids3 = [];
						store.removeAt(rowIndex);
						var valueDefaultStore = Ext.getCmp('valueDefault1').getStore();
						Ext.Array.each(store.data.items, function(record) {
							var id = record.data.id;
							ids3.push(id);
						})
						valueDefaultStore.filterBy(function(record3) {
							var id = record3.get('id');
							return Ext.Array.contains(ids3, id)
						});
						page.form.getComponent("valueDefault1").setValue("")
						page.form.getComponent('valueDefault').setValue("")

					}
				}]
			}, {
				text: i18n.getKey('name'),
				sortable: false,
				dataIndex: 'name',
				id: 'optionsname',
				editor: {
					allowBlank: false
				}
			}, {
				text: i18n.getKey('value'),
				sortable: false,
				dataIndex: 'value',
				editor: {
					allowBlank: false
				}
			}, {
				text: i18n.getKey('sortOrder'),
				dataIndex: 'sortOrder',
				sortable: false,
				editor: {
					xtype: 'numberfield'
				}
			}],
			tbar: [{
				text: i18n.getKey('addOption'),
				handler: function() {
					setValueDefaultAfterFirst(null);
					//判断当valueType为Boolean时最多只能添加两个值
					var valueDefaultStore = Ext.getCmp('valueType').getValue();
					var pageOptionsStore = page.form.getComponent("options").getStore();
					if((valueDefaultStore == "Boolean") && (pageOptionsStore.data.items.length >= 2)) {
						Ext.MessageBox.alert('提示', 'valueType选择为"Boolean"时，最多只能添加两条数据到options!')
					} else {
						controller.openOptionWindow(page, null);
					}
				}
			}]
		}
	//加载options end
	//page
	var page = Ext.widget({
		block: 'bommaterialattribute',
		xtype: 'uxeditpage',
		gridPage: 'bommaterialattribute.html',
		formCfg: {
			layout: {
				layout: 'table',
				columns: 1,
				tdAttrs: {
					style: {
						'padding-right': '120px'
					}
				}
			},
			model: 'CGP.bommaterialattribute.model.Attribute',
			items: [{
				name: 'code',
				xtype: 'textfield',
				allowBlank: false,
				fieldLabel: i18n.getKey('code'),
				itemId: 'code'
			}, {
				name: 'name',
				xtype: 'i18ndisplay',
				allowBlank: false,
				errorsText: 'name.default can not be null',
				fieldLabel: i18n.getKey('name'),
				itemId: 'name',
				rowspan: Ext.util.Cookies.get('locales').split(',').length
			}, {
				name: 'required',
				xtype: 'checkbox',
				fieldLabel: i18n.getKey('required'),
				itemId: 'required'
			}, {
				name: 'validationExp',
				xtype: 'textfield',
				fieldLabel: i18n.getKey('validationExp'),
				itemId: 'validationExp'
			}, {
				name: 'valueDefault',
				xtype: 'hidden',
				fieldLabel: i18n.getKey('valueDefault'),
				itemId: 'valueDefault'
			}, {
				editable: false,
				allowBlank: false,
				name: 'valueType',
				xtype: 'combo',
				allowBlank: false,
				itemId: 'valueType',
				id: 'valueType',
				fieldLabel: i18n.getKey('valueType'),
				store: Ext.create('CGP.bommaterialattribute.store.ValueTypes'),
				displayField: 'code',
				valueField: 'code',
				listeners: {
					"change": function(combo, newValue, oldValue) {
						if(oldValue == undefined||page.form.getComponent("selectType").getValue()==null) {
							//新建
								if(oldValue == undefined&&page.form.getComponent("selectType").getValue()==null){
									setValueDefault(combo.ownerCt);
								}else if(oldValue == undefined&&page.form.getComponent("selectType").getValue()!=null){
									if(page.form.getComponent("selectType").getValue()=='NON'){
										setValueDefault(combo.ownerCt);
									}else{
										setValueDefault(combo.ownerCt);
									    controller.changeselectType(combo, newValue, oldValue,optionGrid);
									}
								}
						} else {
							//edit
							page.form.getComponent("valueDefault1").setValue("");
							page.form.getComponent('valueDefault').setValue("");
							setValueDefaultAfterFirst(combo.ownerCt);
							//当valueType类型发生变化时，需对options中的值做出审核，并提示不适合类型
							selectType = page.form.getComponent("selectType").getValue();
							if(selectType=='NON'){
							}else{
								var pageOptionsStore = page.form.getComponent("options").getStore()
								if(newValue == 'String' || newValue == 'Color' || newValue == 'CustomType') {
								var ii = [];
								Ext.Array.each(pageOptionsStore.data.items, function(record) {
									if(record.data.value == 'TRUE' || record.data.value == 'FALSE') {
										ii.push(record.data.value)
									} else {}
								})
								if(Ext.isEmpty(ii)) {
								} else {
									page.form.getComponent("valueType").setValue(oldValue);
									Ext.MessageBox.alert('提示', 'value类型与options存在不匹配数据，请注意修改！')
								}
							} else if(newValue == 'Number' || newValue == 'int') {
								var ii = [];
								Ext.Array.each(pageOptionsStore.data.items, function(record) {
									if(Ext.isNumeric(record.data.value)) {} else {
										ii.push(record.data.value)
									}
								})
								if(Ext.isEmpty(ii)) {} else {
									page.form.getComponent("valueType").setValue(oldValue);
									Ext.MessageBox.alert('提示', 'value类型与options存在不匹配数据，请注意修改！')
								}
							} else if(newValue == 'Boolean') {
								var ii = [];
								var booleanNumber=[];
								Ext.Array.each(pageOptionsStore.data.items, function(record) {
									if(record.data.value == 'TRUE' || record.data.value == 'FALSE') {
										booleanNumber.push(record.data.value)
									} else {
										ii.push(record.data.value)
									}
								})
								if(Ext.isEmpty(ii)) {
									 if(booleanNumber.length>2){
									 	page.form.getComponent("valueType").setValue(oldValue);
									 	Ext.MessageBox.alert('提示', '选择Boolean类型时，options最多只能添加两个value')
									 }
								} else {
									page.form.getComponent("valueType").setValue(oldValue);
									Ext.MessageBox.alert('提示', 'value类型与options存在不匹配数据，请修改value成"TRUE"或者"FALSE"或删除value！')
								 }
							   }
							
							}
						}
					}
				}
			}, {
				editable: false,
				allowBlank: false,
				name: 'selectType',
				xtype: 'combo',
				store: Ext.create('CGP.bommaterialattribute.store.selectTypes'),
				displayField: 'code',
				valueField: 'code',
				fieldLabel: i18n.getKey('selectType'),
				itemId: 'selectType',
				allowBlank: false,
				listeners: {
					"change": function(combo, newValue, oldValue) {
						if(oldValue == undefined||page.form.getComponent("valueType").getValue()==null) {
							
							if(page.form.getComponent("valueType").getValue()==null){
								//新建
							}else{
								controller.changeselectType(combo, newValue, oldValue,optionGrid);
							    setValueDefault(combo.ownerCt);
							}
						} else {
							page.form.getComponent("valueDefault1").setValue("");
							page.form.getComponent('valueDefault').setValue("");
							controller.changeselectType(combo, newValue, oldValue,optionGrid);
							setValueDefaultAfterFirst(combo.ownerCt);
						}
					}
				}
			}]
		},
		listeners: {
			"render": function(page) {
				if(page.form.getCurrentMode() == 'editing') {
					var option = Ext.create("Ext.ux.form.GridField", {
						name: 'CGP.bommaterialattribute.model.Attribute.options',
						xtype: 'gridfield',
						gridConfig: optionGrid,
						fieldLabel: i18n.getKey('options'),
						itemId: 'options',
						id: 'options'
					});
					page.form.add(option);
				}
			}
		}
	});

	//进入edit时加载，调用的是attributeStore
	function setValueDefault(form) {
		var valueType = page.form.getComponent("valueType").getValue(),
			selectType = page.form.getComponent("selectType").getValue(),
			valueDefault = page.form.getComponent("valueDefault").getValue();
		if(selectType==null||selectType==null||attributeStore.findRecord('id', setsId)==null){
		//main新建
		     if(selectType==null){
		     }else if(selectType==null){
		     	
		     }else{
		    if(selectType == 'NON') {
			if(valueType == 'String' || valueType == 'Color' || valueType == 'CustomType') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'textarea',
					itemId: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					id: 'valueDefault1',
					width: 600,
					height: 200,
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
			} else if(valueType == 'Number') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'numberfield',
					itemId: 'valueDefault1',
					id: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
			} else if(valueType == 'Boolean') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'combo',
					itemId: 'valueDefault1',
					editable: false,
					id: 'valueDefault1',
					store: Ext.create('Ext.data.Store', {
						fields: ['name', "value"],
						data: [{
							name: 'TRUE',
							value: 'TRUE'
						}, {
							name: 'FALSE',
							value: 'FALSE'
						}]
					}),
					fieldLabel: i18n.getKey('valueDefault'),
					displayField: 'name',
					valueField: 'value',
					queryMode: 'local',
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
			} else if(valueType == 'int') {
				page.form.add({
					xtype: 'numberfield',
					itemId: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					id: 'valueDefault1',
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
			}
			page.form.getComponent("valueDefault1").setValue(valueDefault)
		} else if(selectType == 'SINGLE') {
			page.form.add({
				name: 'valueDefault1',
				fieldLabel: i18n.getKey('valueDefault'),
				autoScroll: true,
				store: Ext.create('Ext.data.Store', {
					fields: [{
						name: 'name',
						type: 'string'
					}, {
						name: 'value',
						type: 'string'
					}],
					//data: attributeOptionsArray
				}),
				valueField: 'value',
				displayField: 'name',
				queryMode: 'local',
				xtype: 'combo',
				itemId: 'valueDefault1',
				id: 'valueDefault1',
				editable: false,
				style: {
					marginTop: '10px'
				},
				listeners: { //选择新值后设置到隐藏valueDefault中
					"change": function(textarea, newValue, oldValue) {
						page.form.getComponent('valueDefault').setValue(newValue)
					}
				}
			})
			page.form.getComponent("valueDefault1").setValue(valueDefault)
		} else if(selectType == 'MULTI') {
			page.form.add({
				name: 'valueDefault1',
				fieldLabel: i18n.getKey('valueDefault'),
				autoScroll: true,
				store: Ext.create('Ext.data.Store', {
					fields: [{
						name: 'name',
						type: 'string'
					}, {
						name: 'value',
						type: 'string'
					}],
					//data: attributeOptionsArray
				}),
				valueField: 'value',
				displayField: 'name',
				xtype: 'combo',
				queryMode: 'local',
				editable: false,
				itemId: 'valueDefault1',
				multiSelect: true,
				id: 'valueDefault1',
				style: {
					marginTop: '10px'
				},
				listeners: {
					"change": function(combo, newValue, oldValue) {
						page.form.getComponent('valueDefault').setValue(Ext.encode(newValue))
					}
				}
			})
			if(Ext.isEmpty(valueDefault)){
				
			}else{
				page.form.getComponent("valueDefault1").setValue(Ext.decode(valueDefault))
			}
		 }
		     	
		     }
		}else{
	    //main的edit
		attributeOptionsArray = attributeStore.findRecord('id', setsId).data.options;
		//移除组件
		page.form.remove("valueDefault1", true)
			//循环判断start
		if(selectType == 'NON') {
			if(valueType == 'String' || valueType == 'Color' || valueType == 'CustomType') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'textarea',
					itemId: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					id: 'valueDefault1',
					width: 600,
					height: 200,
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
			} else if(valueType == 'Number') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'numberfield',
					itemId: 'valueDefault1',
					id: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
			} else if(valueType == 'Boolean') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'combo',
					itemId: 'valueDefault1',
					editable: false,
					id: 'valueDefault1',
					store: Ext.create('Ext.data.Store', {
						fields: ['name', "value"],
						data: [{
							name: 'TRUE',
							value: 'TRUE'
						}, {
							name: 'FALSE',
							value: 'FALSE'
						}]
					}),
					fieldLabel: i18n.getKey('valueDefault'),
					displayField: 'name',
					valueField: 'value',
					queryMode: 'local',
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
			} else if(valueType == 'int') {
				page.form.add({
					xtype: 'numberfield',
					itemId: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					id: 'valueDefault1',
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
			}
			page.form.getComponent("valueDefault1").setValue(valueDefault)
		} else if(selectType == 'SINGLE') {
			page.form.add({
				name: 'valueDefault1',
				fieldLabel: i18n.getKey('valueDefault'),
				autoScroll: true,
				store: Ext.create('Ext.data.Store', {
					fields: [{
						name: 'name',
						type: 'string'
					}, {
						name: 'value',
						type: 'string'
					}],
					data: attributeOptionsArray
				}),
				valueField: 'value',
				displayField: 'name',
				queryMode: 'local',
				xtype: 'combo',
				itemId: 'valueDefault1',
				id: 'valueDefault1',
				editable: false,
				style: {
					marginTop: '10px'
				},
				listeners: { //选择新值后设置到隐藏valueDefault中
					"change": function(textarea, newValue, oldValue) {
						page.form.getComponent('valueDefault').setValue(newValue)
					}
				}
			})
			page.form.getComponent("valueDefault1").setValue(valueDefault)
		} else if(selectType == 'MULTI') {
			page.form.add({
				name: 'valueDefault1',
				fieldLabel: i18n.getKey('valueDefault'),
				autoScroll: true,
				store: Ext.create('Ext.data.Store', {
					fields: [{
						name: 'name',
						type: 'string'
					}, {
						name: 'value',
						type: 'string'
					}],
					data: attributeOptionsArray
				}),
				valueField: 'value',
				displayField: 'name',
				xtype: 'combo',
				queryMode: 'local',
				editable: false,
				itemId: 'valueDefault1',
				multiSelect: true,
				id: 'valueDefault1',
				style: {
					marginTop: '10px'
				},
				listeners: {
					"change": function(combo, newValue, oldValue) {
						page.form.getComponent('valueDefault').setValue(Ext.encode(newValue))
					}
				}
			})
			if(Ext.isEmpty(valueDefault)){
				
			}else{
				page.form.getComponent("valueDefault1").setValue(Ext.decode(valueDefault))
			}
		 }
		}
	};
	//加载valueDefault结束

	//改变valueType，selectType，options时调用，调用的是pageOptionsStore为store，并进行不同判断
	function setValueDefaultAfterFirst(form) {
		var valueType = page.form.getComponent("valueType").getValue(),
			selectType = page.form.getComponent("selectType").getValue(),
			valueDefault = page.form.getComponent("valueDefault").getValue();
		
		if(selectType==null||selectType==null||page.form.getComponent("options")==undefined){
		//main新建
		 page.form.remove("valueDefault1", true)
		if(selectType==null){
		     }else if(selectType==null){
		     }else {
		     	   if(valueType == 'String' || valueType == 'Color' || valueType == 'CustomType') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'textarea',
					itemId: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					id: 'valueDefault1',
					width: 600,
					height: 200,
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
				if(valueDefault.substring(0, 1) == "[") {
					page.form.getComponent("valueDefault1").setValue("")
					page.form.getComponent('valueDefault').setValue("")
				} else {
					page.form.getComponent("valueDefault1").setValue(valueDefault)
				}
			} else if(valueType == 'Number') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'numberfield',
					itemId: 'valueDefault1',
					id: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
				if(valueDefault.substring(0, 1) == "[") {
					page.form.getComponent("valueDefault1").setValue("")
					page.form.getComponent('valueDefault').setValue("")
				} else {
					page.form.getComponent("valueDefault1").setValue(valueDefault)
				}
			} else if(valueType == 'Boolean') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'combo',
					itemId: 'valueDefault1',
					editable: false,
					id: 'valueDefault1',
					store: Ext.create('Ext.data.Store', {
						fields: ['name', "value"],
						data: [{
							name: 'TRUE',
							value: 'TRUE'
						}, {
							name: 'FALSE',
							value: 'FALSE'
						}]
					}),
					fieldLabel: i18n.getKey('valueDefault'),
					displayField: 'name',
					valueField: 'value',
					queryMode: 'local',
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
				if(valueDefault != 'TRUE' && valueDefault != 'FALSE') {
					page.form.getComponent("valueDefault1").setValue("")
					page.form.getComponent('valueDefault').setValue("")
				} else {
					page.form.getComponent("valueDefault1").setValue(valueDefault)
				}
			} else if(valueType == 'int') {
				page.form.add({
					xtype: 'numberfield',
					itemId: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					id: 'valueDefault1',
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
				if(valueDefault.substring(0, 1) == "[") {
					page.form.getComponent("valueDefault1").setValue("")
					page.form.getComponent('valueDefault').setValue("")
				} else {
					page.form.getComponent("valueDefault1").setValue(valueDefault)
				}
			}
			page.form.doLayout()
		     }
//当已创建options
		}else{
		var pageOptionsStore = page.form.getComponent("options").getStore();
		//移除组件
		page.form.remove("valueDefault1", true)
			//循环判断start
		if(selectType == 'NON') {
			if(valueType == 'String' || valueType == 'Color' || valueType == 'CustomType') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'textarea',
					itemId: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					id: 'valueDefault1',
					width: 600,
					height: 200,
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
				if(valueDefault.substring(0, 1) == "[") {
					page.form.getComponent("valueDefault1").setValue("")
					page.form.getComponent('valueDefault').setValue("")
				} else {
					page.form.getComponent("valueDefault1").setValue(valueDefault)
				}
			} else if(valueType == 'Number') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'numberfield',
					itemId: 'valueDefault1',
					id: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
				if(valueDefault.substring(0, 1) == "[") {
					page.form.getComponent("valueDefault1").setValue("")
					page.form.getComponent('valueDefault').setValue("")
				} else {
					page.form.getComponent("valueDefault1").setValue(valueDefault)
				}
			} else if(valueType == 'Boolean') {
				page.form.add({
					name: 'valueDefault1',
					xtype: 'combo',
					itemId: 'valueDefault1',
					editable: false,
					id: 'valueDefault1',
					store: Ext.create('Ext.data.Store', {
						fields: ['name', "value"],
						data: [{
							name: 'TRUE',
							value: 'TRUE'
						}, {
							name: 'FALSE',
							value: 'FALSE'
						}]
					}),
					fieldLabel: i18n.getKey('valueDefault'),
					displayField: 'name',
					valueField: 'value',
					queryMode: 'local',
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
				if(valueDefault != 'TRUE' && valueDefault != 'FALSE') {
					page.form.getComponent("valueDefault1").setValue("")
					page.form.getComponent('valueDefault').setValue("")
				} else {
					page.form.getComponent("valueDefault1").setValue(valueDefault)
				}
			} else if(valueType == 'int') {
				page.form.add({
					xtype: 'numberfield',
					itemId: 'valueDefault1',
					fieldLabel: i18n.getKey('valueDefault'),
					id: 'valueDefault1',
					listeners: {
						"change": function(textarea, newValue, oldValue) {
							page.form.getComponent('valueDefault').setValue(newValue)
						}
					}
				})
				if(valueDefault.substring(0, 1) == "[") {
					page.form.getComponent("valueDefault1").setValue("")
					page.form.getComponent('valueDefault').setValue("")
				} else {
					page.form.getComponent("valueDefault1").setValue(valueDefault)
				}
			}
			page.form.doLayout()
		} else if(selectType == 'SINGLE') {
			page.form.add({
				name: 'valueDefault1',
				fieldLabel: i18n.getKey('valueDefault'),
				autoScroll: true,
				store: pageOptionsStore,
				valueField: 'value',
				displayField: 'name',
				queryMode: 'local',
				xtype: 'combo',
				itemId: 'valueDefault1',
				id: 'valueDefault1',
				editable: false,
				style: {
					marginTop: '10px'
				},
				listeners: { //选择新值后设置到隐藏valueDefault中
					"change": function(textarea, newValue, oldValue) {
						page.form.getComponent('valueDefault').setValue(newValue)
					}
				}
			})
		} else if(selectType == 'MULTI') {
			page.form.add({
				name: 'valueDefault1',
				fieldLabel: i18n.getKey('valueDefault'),
				autoScroll: true,
				store: pageOptionsStore,
				valueField: 'value',
				displayField: 'name',
				editable: false,
				xtype: 'combo',
				queryMode: 'local',
				itemId: 'valueDefault1',
				multiSelect: true,
				id: 'valueDefault1',
				style: {
					marginTop: '10px'
				},
				listeners: {
					"change": function(combo, newValue, oldValue) {
						page.form.getComponent('valueDefault').setValue(Ext.encode(newValue))
					}
				}
			})
		}
		//循环判断end
		}
	};
	//加载setValueDefaultAfterFirst结束
});