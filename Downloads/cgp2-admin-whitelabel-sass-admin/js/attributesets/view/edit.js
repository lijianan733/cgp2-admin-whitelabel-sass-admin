/**
 * pagecontentschema编辑页面Extjs
 * location.href='http://www.baidu.com?id=2'
 */
Ext.Loader.setConfig({
	disableCaching: false
});
Ext.Loader.setPath({
	enabled: true,
	"CGP.pagecontentschema": path + 'js/pagecontentschema'
});
Ext.Loader.require("CGP.attributesets.model.Attributesets");

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
var setsId = parseInt(getQueryString('id'));
var test = 111;
Ext.onReady(function() {
	var me = this;
	var LocalasetToStore = Ext.create("CGP.attributesets.store.LocalattributeSetToAttributes");
	this.setToStore = Ext.create("CGP.attributesets.store.Attributesets");
	this.attributeStore = Ext.create('CGP.bommaterialattribute.store.Attribute');
	setToStore.load({ //加载setToStore
		callback: function(records1) {
			attributeStore.load({ //加载attributeStore
				callback: function(records2) {
					var recordsetToStore = setToStore.findRecord('id', setsId);
					var ids = [];
					Ext.Array.each(recordsetToStore, function(record) {
						var attributeSetToAttributes = record.get('attributeSetToAttributes');
						Ext.Array.each(attributeSetToAttributes, function(record) {
							var id = record.attribute.id;
							ids.push(id);
						})
					})
					attributeStore.filterBy(function(record3) {
						var id = record3.get('id');
						return !Ext.Array.contains(ids, id);
					});
				}
			})
		}
	});

	//panel1
	var setToConfig = {
		id: 'setToStoreGrid',
		selModel: new Ext.selection.CheckboxModel({
			checkOnly: false
		}),
		store: LocalasetToStore,
		minHeight: 662,
		autoScroll: true,		
		width: 3400,
		columns: [{
			//set按钮
			//id: 'set',
			xtype: 'componentcolumn',
			text: i18n.getKey('set'),
			width: 100,
			menuDisabled: true,
			sortable: false,
			renderer: function(value, metaData, record, rowIndex) {
				return new Ext.button.Button({
					text: i18n.getKey('setValue'),
					xtype: 'button',
					itemId: 'setValue',
					width: 10,
					handler: function() {
						Ext.create('CGP.attributesets.view.setValue', {
							attributeId: record.get('id'),
							record: record,
						}).show();
						
					}
				});
			}

		}, {
			text: i18n.getKey('sortOrder'),
			id: 'sortOrder',
			itemId: 'sortOrder',
			sortable: false,
			dataIndex: 'sortOrder'
		}, {
			text: i18n.getKey('defaultValue'),
			id: 'defaultValue',
			itemId: 'defaultValue',
			sortable: false,	                              
			dataIndex: 'defaultValue',
			renderer: function(value, metadata, record) {
				if(Ext.isEmpty(value)){
					return value;
				}else{
					if(record.data.attribute.selectType == "SINGLE") {
							Ext.Array.each(record.data.attribute.options, function(record2) {
								if(record2.value == value) {
									singleName = record2.name
								}
							})
							return singleName;
					} else if(record.data.attribute.selectType == "MULTI") {
							var multiName = [];
							var valueArray = Ext.decode(value);
							Ext.Array.each(valueArray, function(record3) {
								Ext.Array.each(record.data.attribute.options, function(record4) {
									if(record4.value == record3) {
										multiName.push(record4.name)
									}
								})
							})
							return multiName;
					} else {
						    return value;
					}
					}
				}
		},  {
			text: i18n.getKey('attributeid'),
			id: 'id',
			itemId: 'id',
			sortable: false,
			dataIndex: 'attribute',
			renderer: function(v) {
				return v.id;
			}
		}, {
			text: i18n.getKey('code'),
			id: 'code',
			itemId: 'code',
			sortable: false,
			dataIndex: 'attribute',
			renderer: function(v) {
				return v.code;
			}
		}, {
			text: i18n.getKey('name'),
			id: 'name',
			itemId: 'name',
			sortable: false,
			dataIndex: 'attribute',
			renderer: function(v) {
				return v.name;
			}
		}, {
			text: i18n.getKey('required'),
			id: 'required',
			itemId: 'required',
			sortable: false,
			dataIndex: 'attribute',
			renderer: function(v) {
				return v.required;
			}
		}, {
			text: i18n.getKey('validationExp'),
			id: 'validationExp',
			itemId: 'validationExp',
			sortable: false,
			dataIndex: 'attribute',
			renderer: function(v) {
				return v.validationExp;
			}
		}, {
			text: i18n.getKey('valueDefault'),
			id: 'valueDefault',
			itemId: 'valueDefault',
			sortable: false,
			dataIndex: 'attribute',
			renderer: function(value, metadata, record) {
				if(Ext.isEmpty(value.valueDefault)){
					return value.valueDefault;
				}else{
					if(record.data.attribute.selectType == "SINGLE") {
							Ext.Array.each(record.data.attribute.options, function(record2) {
								if(record2.value == value.valueDefault) {
									singleName = record2.name
								}
							})
							return singleName;
					} else if(record.data.attribute.selectType == "MULTI") {
							var multiName = [];
							var valueArray = Ext.decode(value.valueDefault);
							Ext.Array.each(valueArray, function(record3) {
								Ext.Array.each(record.data.attribute.options, function(record4) {
									if(record4.value == record3) {
										multiName.push(record4.name)
									}
								})
							})
							return multiName;
					} else {
						    return value.valueDefault;
					}
				 }
				}
		}, {
			text: i18n.getKey('valueType'),
			id: 'valueType',
			itemId: 'valueType',
			sortable: false,
			dataIndex: 'attribute',
			renderer: function(v) {
				return v.valueType;
			}
		}, {
			text: i18n.getKey('selectType'),
			id: 'selectType',
			itemId: 'selectType',
			sortable: false,
			dataIndex: 'attribute',
			renderer: function(v) {
				return v.selectType;
			}
		}]
	};
	var panel1 = new Ext.grid.Panel({
		id: 'includeGrid',
		title: i18n.getKey('categoryAttributes'),
		multiSelect: true,
		columns: [
			Ext.create('Ext.ux.form.GridField', {
				name: 'CGP.attributesets.model.Attributesets.attributeSetToAttributes',
				xtype: 'gridfield',
				width: 1280,
				gridConfig: setToConfig,
				itemId: 'attributesetToStoreid',
				id: 'attributesetToStoreid'
			})
		],

		viewConfig: {
			plugins: {
				ptype: 'gridviewdragdrop',
				ddGroup: 'selDD',
				enableDrag: true,
				enableDrop: true
			},
			listeners: {
				beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
					var id = data.records[0].get('id');
					addIds.push(id);
				}
			}
		}
	});
	
	var panel2 = Ext.create('Ext.panel.Panel', {
		html: '<div style="position:relative;top:150px">' +
			'<button style="height: 30px;width:100%;margin-bottom:20px" onclick="batchAddAttribute()">' +
			'<img src="../../ClientLibs/extjs/resources/themes/images/ux/arrow_left.png" style=" display: block;max-width:100% ;height: 30px;width:100%;"  />' +
			'</button>' +
			'<button style="height: 30px;width:100%" onclick="batchRemoveAttribute()" >' +
			'<img src="../../ClientLibs/extjs/resources/themes/images/ux/arrow_right.png" style=" display: block;max-width:100% ;height: 30px;width:100%;" />' +
			'</button>' +
			'</div>',
		flex: 0.08
	});
	
	//3.otherAttribute页面
	var panel3 = new Ext.grid.Panel({
		id: 'exclusiveGrid',
		title: i18n.getKey('otherAttribute'),
		multiSelect: true,
		selType: 'checkboxmodel',
		selModel: new Ext.selection.CheckboxModel({ //一个选择模式它将渲染一列可以选中或者反选的复选框. 默认选择模型是多选.
			checkOnly: false
		}),
		//查询
		tbar: [{
			xtype: 'textfield',
			labelWidth: 40,
			fieldLabel: i18n.getKey('name'),
			itemId: 'nameSearch'
		}, {
			xtype: 'button',
			iconCls: 'icon_query',
			text: i18n.getKey('search'),
			handler: function() {
				var me = this;
				var name = me.ownerCt.getComponent('nameSearch').getValue();
				var store = me.ownerCt.ownerCt.getStore();
				if(!Ext.isEmpty(name)) {
					store.filterBy(function(record, id) {
						if(record.get('name').indexOf(name) > -1) {
							return true;
						}
					}, store);
				} else {
					store.load({
						scope: store,
						callback: function(records, operation, success) {
							if(success) {
								this.filterBy(function(record) {
									return LocalasetToStore.find('name', record.get('name')) == -1
								}, this);
							}
						}
					});
				}
			}
		}],
		//grid列表
		columns: [{
			text: i18n.getKey('id'),
			dataIndex: 'id'
		}, {
			text: i18n.getKey('code'),
			dataIndex: 'code'
		}, {
			text: i18n.getKey('name'),
			dataIndex: 'name'
		}, {
			text: i18n.getKey('required'),
			dataIndex: 'required'
		}, {
			text: i18n.getKey('validationExp'),
			dataIndex: 'validationExp'
		}, {
			text: i18n.getKey('valueType'),
			dataIndex: 'valueType'
		}, {
			text: i18n.getKey('valueDefault'),
			dataIndex: 'valueDefault',
			renderer: function(value, metadata, record) {
				if(Ext.isEmpty(value)){
					return value;
				}else{
					if(record.data.selectType == "SINGLE") {
							Ext.Array.each(record.data.options, function(record2) {
								if(record2.value == value) {
									singleName = record2.name
								}
							})
							return singleName;
					} else if(record.data.selectType == "MULTI") {
							var multiName = [];
							var valueArray = Ext.decode(value);
							Ext.Array.each(valueArray, function(record3) {
								Ext.Array.each(record.data.options, function(record4) {
									if(record4.value == record3) {
										multiName.push(record4.name)
									}
								})
							})
							return multiName;
					} else {
						    return value;
					}
				 }
				}
		  
		}, {
			text: i18n.getKey('selectType'),
			dataIndex: 'selectType'
		}],
		store: attributeStore,
		viewConfig: {
			plugins: {
				ptype: 'gridviewdragdrop',
				ddGroup: 'selDD',
				enableDrag: true,
				enableDrop: true
			}
		}
	});
	//总页面	
	var page = Ext.widget({
		block: 'Attributesets',
		xtype: 'uxeditpage',
		accessControl: true,
		gridPage: 'attributesets.html',
		formCfg: {
			isRefreshField:false,
			layout: {
				layout: 'table',
				columns: 1,
				tdAttrs: {
					style: {
						'padding-right': '120px'
					}
				}
			},
			model: 'CGP.attributesets.model.Attributesets',
			//remoteCfg: false,
			items: [{
					name: 'id',
					xtype: 'textfield',
					fieldLabel: i18n.getKey('id'),
					itemId: 'attributesetid',
					listeners: {
						afterrender: function() {
							if(this.ownerCt.getCurrentMode() == 'editing') {
								this.setDisabled(true);
								this.setVisible(true);
							} else {
								this.setDisabled(false);
								this.setVisible(false);
							}
						}
					}
				}, {
					name: 'name',
					xtype: 'textfield',
					fieldLabel: i18n.getKey('name'),
					itemId: 'name',
					allowBlank: false
				}, {
					name: 'description',
					xtype: 'textfield',
					fieldLabel: i18n.getKey('description'),
					itemId: 'description'
				},
				Ext.create('Ext.panel.Panel', {
					width: 1500,
					height: 730,
					border: 0,
					name: 'attributeSetToAttributes',
					//title: i18n.getKey('managerAttribute'),
					layout: {
						type: 'hbox',
						align: 'stretch',
						padding: 5
					},
					defaults: {
						flex: 1
					},
					items: [panel1,panel2, panel3]
				})
				
			]
		}
	});
	//批量add属性
	batchAddAttribute = function(ids) {
		var setToStoreGridConfig = Ext.getCmp('setToStoreGrid');
		var attributes;
		if(!ids) {
			attributes = panel3.getSelectionModel().getSelection(); //获得所选择的数据

		} else {
			if(Ext.isArray(ids)) {
				attributes = [];
				Ext.Array.each(ids, function(id) {
					attributes.push(panel3.getStore().getById(id)); //获取store再根据store获取指定的id记录
				})
			}
		}
		if(Ext.isEmpty(attributes)) { //如果所选择的记录为空则返回
			return;
		}

		var newAttributes = [];
		Ext.Array.each(attributes, function(attribute2) {
			newAttributes.push(new CGP.attributesets.model.LocalattributeSetToAttributes({
				defaultValue:attribute2.data.valueDefault,
				attribute: attribute2.data
			}));

		})
		setToStoreGridConfig.getStore().loadData(newAttributes, true); //将新的数据加载到panel1
		//panel3.getStore().remove(attributes); //从
		var ids = [];
		Ext.Array.each(setToStoreGridConfig.getStore().data.items, function(record) {
			var id = record.data.attribute.id;
			ids.push(id);
		});
		if(ids.length == 0) {
			attributeStore.load({
				callback: function(records2, operation, success) {}
			})
		} else {
			panel3.getStore().filterBy(function(record3) {
				var id = record3.get('id');
				return !Ext.Array.contains(ids, id);
			})
		}

	};
	//批量移除属性
	batchRemoveAttribute = function() {
		var setToStoreGridConfig = Ext.getCmp('setToStoreGrid');
		var attributes = setToStoreGridConfig.getSelectionModel().getSelection();
		if(Ext.isEmpty(attributes)) {
			return;
		}
		var allowAttributes = [];
		var allowAttributes2 = [];
		Ext.Array.each(attributes, function(attribute3) {

			allowAttributes.push(attribute3.data.attribute);
			allowAttributes2.push(attribute3);
			//allowAttributes.push(new CGP.attributesets.model.LocalattributeSetToAttributes({attribute3.attribute}));

		});

		setToStoreGridConfig.getStore().remove(allowAttributes2);
		var ids = [];
		Ext.Array.each(setToStoreGridConfig.getStore().data.items, function(record) {
			var id = record.data.attribute.id;
			ids.push(id);
		});
		if(ids.length == 0) {
			attributeStore.load({
				callback: function(records2, operation, success) {}
			})
		} else {
			panel3.getStore().filterBy(function(record3) {
				var id = record3.get('id');
				return !Ext.Array.contains(ids, id);
			})
		}
	}

});