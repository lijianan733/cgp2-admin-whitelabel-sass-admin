Ext.define('CGP.attributesets.view.setValue', {
	extend: 'Ext.window.Window',
	alias: 'widget.Auditwindow',

	modal: true,
	bodyStyle: 'padding:10px',
	layout: 'fit',

	initComponent: function() {
		var me = this,
			optionsvalue = [],
			attributeId = this.attributeId;
		    record = this.record,
			me.title = i18n.getKey('setValue'),
			sortOrder = record.data.sortOrder,
			defaultValue = record.data.defaultValue,
			attributedefaultValue = record.data.attribute.valueDefault,
			valueType = record.data.attribute.valueType,
			options = record.data.attribute.options,
			selectType = record.data.attribute.selectType;
//一，新加入的attribute取值为attribute中的valueDefault
		if(Ext.isEmpty(defaultValue)) {
			if(selectType == 'NON') {
				if(valueType == 'String' || valueType == 'Color' || valueType == 'CustomerType') {
					me.items = [{
						xtype: 'form',
						itemId: 'form',
						border: false,
						width: 680,
						items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							xtype: 'textarea',
							itemId: 'defaultValue',
							fieldLabel: i18n.getKey('defaultValue'),
							value: attributedefaultValue,
							width: 600,
							height: 200
						}]
					}]
				} else if(valueType == 'Number') {
					me.items = [{
						xtype: 'form',
						itemId: 'form',
						border: false,
						width: 600,
						height: 180,
						items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							xtype: 'numberfield',
							itemId: 'defaultValue',
							value: attributedefaultValue,
							fieldLabel: i18n.getKey('defaultValue')
						}]
					}]
				} else if(valueType == 'Boolean') {
					me.items = [{
						xtype: 'form',
						itemId: 'form',
						border: false,
						width: 600,
						height: 180,
						items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							name: 'defaultValue',
							xtype: 'combo',
							itemId: 'defaultValue',
							editable: false,
							value: attributedefaultValue,
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
							fieldLabel: i18n.getKey('defaultValue'),
							displayField: 'name',
							valueField: 'value',
							queryMode: 'local'
						}]
					}]
				} else if(valueType == 'int') {
					me.items = [{
						xtype: 'form',
						itemId: 'form',
						border: false,
						width: 600,
						height: 180,
						items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							xtype: 'numberfield',
							itemId: 'defaultValue',
							allowDecimals: false,
							fieldLabel: i18n.getKey('defaultValue'),
							value: attributedefaultValue
						}]
					}]
				}
			} else if(selectType == 'SINGLE') {
				me.items = [{
					xtype: 'form',
					itemId: 'form',
					border: false,
					width: 600,
					height: 180,
					items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							name: 'defaultValue',
							fieldLabel: i18n.getKey('defaultValue'),
							autoScroll: true,
							store: Ext.create('Ext.data.Store', {
								fields: [{
									name: 'name',
									type: 'string'
								}, {
									name: 'value',
									type: 'string'
								}],
								data: options
							}),
							value: attributedefaultValue,
							xtype: 'combo',
							itemId: 'defaultValue',
							valueField: 'value',
							displayField: 'name',
							editable: false,
							style: {
								marginTop: '10px'
							}
						}

					]
				}]

			} else if(selectType == 'MULTI') {
				//解码
				if(Ext.isEmpty(defaultValue)) {
					defaultValuedecode = ""
				} else {
					defaultValuedecode = Ext.decode(attributedefaultValue)
				}
				//解码end
				var optionItems = []
				Ext.Array.each(options, function (option) {
					            var optionItem = {
					                name: option.id,
					                inputValue: option.value,
					                boxLabel: option.name,
					                columnWidth: .3
					            };
					            if (defaultValuedecode && Ext.isArray(defaultValuedecode) && Ext.Array.contains(defaultValuedecode, option.value + '')) {
					                optionItem.checked = true;
					            }
					            optionItems.push(optionItem);
					        })
				me.items = [{
					xtype: 'form',
					itemId: 'form',
					border: false,
					width: 600,
					height: 180,
					items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
					        xtype: 'checkboxgroup',
					        fieldLabel: 'defaultValue',
					        itemId: 'defaultValue',
					        columns: 2,
					        vertical: true,
					        items: optionItems
						 }
					]
				}]

			}
//二，已经存在的attribute
		} else {
			if(selectType == 'NON') {
				if(valueType == 'String' || valueType == 'Color' || valueType == 'CustomerType') {
					me.items = [{
						xtype: 'form',
						itemId: 'form',
						border: false,
						width: 680,
						items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							xtype: 'textarea',
							itemId: 'defaultValue',
							fieldLabel: i18n.getKey('defaultValue'),
							value: record.data.defaultValue,
							width: 600,
							height: 200
						}]
					}]
				} else if(valueType == 'Number') {
					me.items = [{
						xtype: 'form',
						itemId: 'form',
						border: false,
						width: 600,
						height: 180,
						items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							xtype: 'numberfield',
							itemId: 'defaultValue',
							value: defaultValue,
							fieldLabel: i18n.getKey('defaultValue')
						}]
					}]
				} else if(valueType == 'Boolean') {
					me.items = [{
						xtype: 'form',
						itemId: 'form',
						border: false,
						width: 600,
						height: 180,
						items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							name: 'defaultValue',
							xtype: 'combo',
							itemId: 'defaultValue',
							editable: false,
							value: defaultValue,
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
							fieldLabel: i18n.getKey('defaultValue'),
							displayField: 'name',
							valueField: 'value',
							queryMode: 'local'
						}]
					}]
				} else if(valueType == 'int') {
					me.items = [{
						xtype: 'form',
						itemId: 'form',
						border: false,
						width: 600,
						height: 180,
						items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							xtype: 'numberfield',
							itemId: 'defaultValue',
							fieldLabel: i18n.getKey('defaultValue'),
							value: record.data.defaultValue
						}]
					}]
				}
			} else if(selectType == 'SINGLE') {
				me.items = [{
					xtype: 'form',
					itemId: 'form',
					border: false,
					width: 600,
					height: 180,
					items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						}, {
							name: 'defaultValue',
							fieldLabel: i18n.getKey('defaultValue'),
							autoScroll: true,
							store: Ext.create('Ext.data.Store', {
								fields: [{
									name: 'name',
									type: 'string'
								}, {
									name: 'value',
									type: 'string'
								}],
								data: options
							}),
							valueField: 'value',
							displayField: 'name',
							value: defaultValue,
							xtype: 'combo',
							itemId: 'defaultValue',
							editable: false,
							//labelAlign : 'right',
							style: {
								marginTop: '10px'
							}
						}
					]
				}]
			} else if(selectType == 'MULTI') {
				if(Ext.isEmpty(defaultValue)) {
					defaultValuedecode = ""
				} else {
					defaultValuedecode = Ext.decode(defaultValue)
				}
				var optionItems = []
				Ext.Array.each(options, function (option) {
					            var optionItem = {
					                name: option.id,
					                inputValue: option.value,
					                boxLabel: option.name,
					                columnWidth: .3
					            };
					            if (defaultValuedecode && Ext.isArray(defaultValuedecode) && Ext.Array.contains(defaultValuedecode, option.value + '')) {
					                optionItem.checked = true;
					            }
					            optionItems.push(optionItem);
					        })
				me.items = [{
					xtype: 'form',
					itemId: 'form',
					border: false,
					width: 600,
					height: 180,
					items: [{
							xtype: 'numberfield',
							itemId: 'sortOrder',
							allowDecimals: false,
							editable: false,
							value: sortOrder,
							fieldLabel: i18n.getKey('sortOrder')
						},{
					        xtype: 'checkboxgroup',
					        fieldLabel: 'defaultValue',
					        itemId: 'defaultValue',
					        columns: 2,
					        vertical: true,
					        items: optionItems
						 }
					]
				}]

			}
		}

		me.bbar = ['->', {
			xtype: 'button',
			text: i18n.getKey('ok'),
			handler: function() {
				if(selectType == 'MULTI') {
					var sortOrder = me.form.getComponent('sortOrder').getValue();
					var aaValue=[];
					Ext.Array.each(me.form.getComponent('defaultValue').getChecked(), function (recordDefaultValue) {
					           aaValue.push(recordDefaultValue.inputValue)
					        })
					var defaultValue = Ext.encode(aaValue);
					//if(me.getComponent('form').isValid()) {
					record.set('sortOrder', sortOrder);
					record.set('defaultValue', defaultValue);
					me.close();
					Ext.MessageBox.alert('提示', '设置成功！');
					//} else {}
				} else {
					var sortOrder = me.form.getComponent('sortOrder').getValue();
					var defaultValue = me.form.getComponent('defaultValue').getValue();
					
					if(Ext.typeOf(defaultValue)=="number"){
							record.set('sortOrder', sortOrder);
							record.set('defaultValue', Ext.encode(defaultValue));
							me.close();
							Ext.MessageBox.alert('提示', '设置成功！');
					}else{
					//if(me.getComponent('form').isValid()) {
					record.set('sortOrder', sortOrder);
					record.set('defaultValue', defaultValue);
					me.close();
					Ext.MessageBox.alert('提示', '设置成功！');
					//} else {}
					}
				}

			}
		}, {
			xtype: 'button',
			text: i18n.getKey('close'),
			itemId: 'close',
			//iconCls: 'icon_close',
			handler: function() {
				// me.partnerStore.load();
				me.close();
			}
		}]

		me.callParent(arguments)

		me.form = me.getComponent('form');
	}
})