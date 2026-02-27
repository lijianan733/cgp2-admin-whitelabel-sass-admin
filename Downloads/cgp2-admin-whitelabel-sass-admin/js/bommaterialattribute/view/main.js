Ext.onReady(function() {

	var notOptional = ['TextField', 'TextArea', 'Date', 'File', 'Canvas', 'YesOrNo', 'DiyConfig', 'DiyDesign'];

	//    initController(window, optionStore, resource, adminPath + 'api/admin/attribute/{0}/option');
	//选项管理的controller
	var controller = Ext.create("CGP.bommaterialattribute.controller.MainController");
   
	var page = Ext.create('Ext.ux.ui.GridPage', {
		id: 'page',
		i18nblock: i18n.getKey('bommaterialattribute'),
		block: 'bommaterialattribute',
		editPage: 'edit.html',
		gridCfg: {
			//store.js
			store: Ext.create("CGP.bommaterialattribute.store.Attribute"),
			frame: false,
			columnDefaults: {
				tdCls: 'vertical-middle',
				autoSizeColumn: true
			},
			columns: [{
				text: i18n.getKey('operator'),
				width: 120,
				//store:Ext.create("CGP.bommaterialattribute.store.AttributesOptions"),
				xtype: "componentcolumn",
				renderer: function(value, metadata, record) {
					if(!Ext.Array.contains(notOptional, record.get('inputType'))) {
						return {
							xtype: 'displayfield',
							value: '<a href="#")>' + i18n.getKey('managerOptions') + '</a>',
							listeners: {
								render: function(display) {
									display.getEl().on("click", function() {
										 attributeId=record.data.id
										controller.openOptionWindow(record);
									});
								}
							}
						};
					}
				}
			}, {
				text: i18n.getKey('id'),
				width: 60,
				dataIndex: 'id',
				id:'bomattributeid',
				itemId: 'id',
				sortable: true
			}, {
				text: i18n.getKey('code'),
				dataIndex: 'code',
				width: 100,
				itemId: 'code',
				sortable: true
			}, {
				text: i18n.getKey('name'),
				dataIndex: 'name',
				width: 165,
				itemId: 'name',
				sortable: true
			}, {
				text: i18n.getKey('required'),
				dataIndex: 'required',
				itemId: 'required',
				width: 80,
				sortable: true
			}, {
				text: i18n.getKey('validationExp'),
				dataIndex: 'validationExp',
				itemId: 'validationExp',
				width: 80,
				sortable: true
			}, {
				text: i18n.getKey('valueType'),
				dataIndex: 'valueType',
				width: 120,
				id:'valueType',
				itemId: 'valueType',
				sortable: true
			}, {
				text: i18n.getKey('valueDefault'),
				dataIndex: 'valueDefault',
				width: 120,
				itemId: 'valueDefault',
				sortable: true,
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
				dataIndex: 'selectType',
				width: 120,
				itemId: 'selectType',
				sortable: true
			}],
			viewConfig: {
				listeners: {
					viewready: function(dataview) {
						Ext.each(dataview.panel.headerCt.gridDataColumns, function(column) {
							//                            if (column.autoSizeColumn === true)
							//                                column.autoSize();
						})
					}
				}
			}
		},
		filterCfg: {
			items: [{
				id: 'codeSearchField',
				name: 'code',
				xtype: 'textfield',
				fieldLabel: i18n.getKey('code'),
				itemId: 'code'
			}, {
				id: 'nameSearchField',
				name: 'name',
				xtype: 'textfield',
				fieldLabel: i18n.getKey('name'),
				itemId: 'name'
			}, {
				id: 'valueTypeSearchField',
				name: 'valueType',
				xtype: 'combo',
				store: Ext.create('CGP.bommaterialattribute.store.ValueTypes'),
				displayField: 'code',
				valueField: 'code',
				fieldLabel: i18n.getKey('valueType'),
				itemId: 'valueType'
			}, {
				id: 'selectTypeSearchField',
				name: 'selectType',
				xtype: 'combo',
				store: Ext.create('CGP.bommaterialattribute.store.selectTypes'),
				displayField: 'code',
				valueField: 'code',
				fieldLabel: i18n.getKey('selectType'),
				itemId: 'selectType'
			}]
		}
	});
	
	
});