Ext.define("CGP.bommaterialattribute.controller.Edit", {
	optionWindow: null, //某属性下的选项列表
	page: null, //属性的编辑页面
	optionId: -1,
	constructor: function(config) {
		var me = this;
		me.callParent(arguments);
	},
	openOptionWindow: function(page, record) {
		var me = this,
			isEdit = record;
		me.page = page;
		me.pageValueType=Ext.getCmp('valueType').getValue();
		if(Ext.isEmpty(record)) {
			record = Ext.create('CGP.bommaterialattribute.model.AttributesOptions', {
				id: me.optionId--,
				name: "",
				value: "",
				sortOrder: "",
			});
		}
		if(Ext.isEmpty(isEdit)) {
			me.optionWindow = Ext.create("CGP.bommaterialattribute.view.window.AddOption", {
				record: record,
				controller: me,
				btnFunction: me.creatSave,
				pageValueType:me.pageValueType
			});
			me.optionWindow.setTitle(i18n.getKey('create'));
		} else {
			me.optionWindow= Ext.create("CGP.bommaterialattribute.view.window.AddOption", {
				record: record,
				controller: me,
				btnFunction: me.editSave,
				pageValueType:me.pageValueType
			});
			me.optionWindow.setTitle(i18n.getKey('edit'));
		}
		me.optionWindow.show();

	},
	creatSave: function(record, name, value, sortOrder) {
		var me = this;
		var sotre = me.page.form.getComponent("options").getStore();
		record.set("name", name);
		record.set("value", value);
		record.set("sortOrder", sortOrder);
		sotre.insert(1, record);
		sotre.sort("sortOrder", "ASC");
		me.optionWindow.close()
	},
	editSave: function(record, name, value, sortOrder) {
		var me = this;
		var sotre = me.page.form.getComponent("options").getStore();
		record.set("name", name);
		record.set("value", value);
		record.set("sortOrder", sortOrder);
		me.page.form.getComponent("valueDefault1").setValue("")
		me.page.form.getComponent('valueDefault').setValue("")
		sotre.sort("sortOrder", "ASC");
		me.optionWindow.close();
	},
	changeselectType: function(combo, newValue, oldValue,optionGrid) {
		var me = this;
		var p = combo.ownerCt.ownerCt;
		var options = combo.ownerCt.getComponent('options');
		if(newValue == 'NON') { //Ext.Array.contains()检查数组中是否包含给定元素
			if(!Ext.isEmpty(options) && options.isVisible()) {
				options.setDisabled(true);
				options.setVisible(false);
				options.getGrid().setVisible(false);
			}
		} else {
			//新建时
			if(Ext.isEmpty(options)) {
				var options = Ext.create("Ext.ux.form.GridField", {
					name: 'CGP.bommaterialattribute.model.Attribute.options',
					xtype: 'gridfield',
					gridConfig: optionGrid,
					fieldLabel: i18n.getKey('options'),
					itemId: 'options',
					id: 'options'
				});
				p.form.add(options);
				p.form.form._configData.push({
					data: {
						configuration: options.initialConfig,
						visible: options.isVisible()
					}
				});
			} else if(!Ext.isEmpty(options) && !options.isVisible()) {
				options.setDisabled(false);
				options.setVisible(true);
				options.getGrid().setVisible(true);
			}
		}

	}
});