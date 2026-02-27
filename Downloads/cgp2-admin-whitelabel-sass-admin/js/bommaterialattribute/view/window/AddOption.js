Ext.define("CGP.bommaterialattribute.view.window.AddOption",{
	extend : 'Ext.window.Window',
	mixins : ["Ext.ux.util.ResourceInit"],
	
	record : null,//一个option选项
	controller : null,//MainController
	btnFunction : Ext.emptyFn,//点击ok时触发的方法。
	pageValueType:null,
	modal : true,
    closeAction: 'hidden',
    resizable : false,
    minWidth: 200,
    height: 220,
    buttonAlign : 'left',
    bodyStyle: {
		padding: '10px',
		paddingTop : '20px'
	},
	initComponent : function(){
		var me = this;
		if(me.record.get("id") != null && me.record.get("id") > 0){
			me.title = i18n.getKey('edit');
		}else {
			me.title = i18n.getKey('create');
		}
		me.items = [{
                	xtype : 'numberfield',
                	labelWidth : 60,
                	fieldLabel : i18n.getKey('sortOrder'),
                	itemId : 'sortOrder',
                	value : me.record.get("sortOrder")
                },{
                	xtype : 'textfield',
					fieldLabel : i18n.getKey('name'),
					labelWidth : 62,
					itemId: 'name',
					value : me.record.get("name")
                }];
        //ok按钮
        me.buttons = [{
                	text : i18n.getKey('ok'),
                	itemId : 'okBtn',
                	handler : function(btn){
                		var name = me.getComponent('name').getValue();
                		var value = me.getComponent('value').getValue();
                		var sortOrder = me.getComponent('sortOrder').getValue();
                		me.btnFunction.call(me.controller,me.record,name,value,sortOrder);
                		me.close();
                	}
               },{
                	text : i18n.getKey('cancel'),
                	handler : function(btn){
                		me.close();
                	}
                }];
		me.callParent(arguments);
		me.on("render",function(cmp){
	    	me.body.on("keydown",function(event, target){
	    		if(event.button == 12){
	    			var button = me.child("toolbar").getComponent("okBtn");
	    			button.handler();
	    		}
	    	});
		});
		me.listeners = {
			"render": function(page) {
				        if(me.pageValueType==undefined){
				        	me.pageValueType=pageValueType;
				        }
				        
					    if(me.pageValueType == 'String' || me.pageValueType == 'Color' || me.pageValueType == 'CustomType') {
							page.add({
								xtype: 'textarea',
								fieldLabel: i18n.getKey('value'),
								labelWidth : 60,
								itemId: 'value',
								value : me.record.get("value"),
								height:40,
								width:247
							})
						} else if(me.pageValueType == 'Number') {
							page.add({
								xtype: 'numberfield',
								fieldLabel: i18n.getKey('value'),
								labelWidth : 60,
								itemId: 'value',
								value : me.record.get("value")	
							})
						} else if(me.pageValueType == 'Boolean') {
							page.add({
								xtype: 'combo',
								fieldLabel: i18n.getKey('value'),
								labelWidth : 60,
								itemId: 'value',
								value : me.record.get("value"),
								queryMode: 'local',
								editable:false,
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
								displayField: 'name',
							    valueField: 'value'
							})	
						} else if(me.pageValueType == 'int') {
							page.add({
								xtype: 'numberfield',
								fieldLabel: i18n.getKey('value'),
								labelWidth : 60,
								itemId: 'value',
								value : me.record.get("value"),
								allowDecimals:false
							})
					}                
            }
        };
	},
	
	reset : function(record){
		var me = this;
		me.record = record;
		if(record.get("id") != null && record.get("id") > 0){
			me.setTitle(i18n.getKey('edit'));
		}else {
			me.setTitle( i18n.getKey('create'));
		}
		me.getComponent("name").setValue(record.get("name"));
		me.getComponent("value").setValue(record.get("value"));
		me.getComponent("sortOrder").setValue( record.get("sortOrder"));
	}
});





