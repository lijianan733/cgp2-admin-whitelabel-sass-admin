/**
 * 网站配置中sender mail配置组的配置页面Extjs
 */
Ext.onReady(function(){


	
	// 获取 store
    var store = Ext.create('CGP.configuration.store.ConfigStore');
	// 提交和重置按钮
	var tbar = Ext.create('Ext.toolbar.Toolbar',{
		items:[{
			itemId: 'btnSave', text: i18n.getKey('Save'),
			iconCls: 'icon_save',  handler: modify,
			style: {
            	marginLeft: '15px'
        	}
		},{
			itemId: 'btnReset', text: i18n.getKey('reset'),
			iconCls: 'icon_reset', handler: reset
		}]
	});
	var page = Ext.create('Ext.form.Panel',{
		title: i18n.getKey("customer mail") + i18n.getKey('paramconfig'),
		height: 400,
		width: 500,
		region: 'center',
		frame: false,
		defaults:{
			allowBlank : false,
			blankText : 'this value is required',
			style: {
           	 marginLeft: '20px',
           	 marginTop : '5px'
       		},
			msgTarget : 'side'
		},
		tbar: tbar,
		layout:{
			type: 'table',
			columns: 1
		},
		items : [
		],
		listeners:{
			render : function(component){
					mask = page.setLoading('Loading');
			}
		}
	});
	
	// 下面两个方法是按钮触发的保存和重置方法
    function modify() {
        var values = Ext.Object.getValues(page.getValues());
        var fields = page.getForm().getFields().items;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var record = store.getAt(field.itemId);
            if (field.getValue() != record.get('value').toString()) {
                record.set('value',field.getValue().toString());
                record.save();
                record.commit();
            }
        }
        store.sync();
        Ext.MessageBox.alert(i18n.getKey('prompt'), i18n.getKey('savesuccess') + '!');
    }
	function reset(){
		var values = [];
		for(var i = 0;i<(store.getCount()); i++ ) {
			var conf = store.getAt(i);
			id = conf.get('id');
			value = conf.get('value');
			values.push({
				id: id,
				value: value
			});
		}
		page.getForm().setValues(values);
	}
	
	// 页面表单的字段
	var host = new Ext.form.field.Text({
		fieldLabel : i18n.getKey('host')
	});
	var address = new Ext.form.field.Text({
		fieldLabel : i18n.getKey('address')
	});
	var userName = new Ext.form.field.Text({
		fieldLabel : i18n.getKey('username')
	});
	var password = new Ext.form.field.Text({
		fieldLabel : i18n.getKey('password'),
		inputType : 'password' 
	});
	var port = new Ext.form.field.Number({
		fieldLabel : i18n.getKey('port')
	});
	var timeout = new Ext.form.field.Number({
		fieldLabel : i18n.getKey('timeout')
	});
	var protocol = new Ext.form.field.Text({
		fieldLabel : i18n.getKey('protocol')
	});
	function fillField(field, config, index){
		field.setValue(config.get('value'));
		field.itemId = index;
		field.id = config.get('id');
		field.name = config.get('key');
		page.add(field);
	}
	
	// JS的去url的参数的方法，用来页面间传参
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	} 
	// store加载数据
	store.load({
		params : {groupId: 7,website: ''+getQueryString("website")+''},
		callback : function(records,options,success){
			for(var i = 0; i < records.length; i++){
				switch(records[i].get('title')){
					case 'host': 
						fillField(host, records[i], i);
						break;
					case 'address':
						fillField(address, records[i], i);
						break;
					case 'username':
						fillField(userName, records[i], i);
						break;
					case 'password':
						fillField(password, records[i], i);
						break;
					case 'port':
						fillField(port, records[i], i);
						break;
					case 'timeout':
						fillField(timeout, records[i], i);
						break;
					case 'protocol':
						fillField(protocol, records[i], i);
						break;
				}
			}
			mask.hide();
		}
	});
	
	new Ext.container.Viewport({
		renderTo: 'jie',
		items: [page],
		layout: 'border'
	});
});	









