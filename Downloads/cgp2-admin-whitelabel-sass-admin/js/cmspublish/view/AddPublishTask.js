Ext.define("CGP.cmspublish.view.AddPublishTask",{
	extend : 'Ext.window.Window',
	mixins : ["Ext.ux.util.ResourceInit"],
	
	record : null,//一个option选项
	controller : null,//MainController
	btnFunction : Ext.emptyFn,//点击ok时触发的方法。
	

	
	
	modal : true,
    closeAction: 'hidden',
    resizable : false,
    width: 500,
    height: 350,
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
            xtype: 'form',
            border: false,
            items: [{
                id: 'type',      //类型
                name: 'type',
                xtype:"combo",
                fieldLabel: i18n.getKey('type'),
                itemId: 'type',
                labelWidth : 60,
                width: 250,
                displayField: 'name',    
                valueField: 'value',
                value : me.record.get("type"),

                store:Ext.create('Ext.data.Store', {
                        fields: [{name:"value",type:'string'},
                                 {name:'name',type:'string'}],
                        data: [{
	                               value: 'SET_VARIABLE',name: i18n.getKey('SET_VARIABLE')
	                           },
	                           {
	                               value: 'GENERATE_TEMPLATES',name: i18n.getKey('GENERATE_TEMPLATES')
	                           },
	                           {
	                               value: 'SHELL_CMD',name: i18n.getKey('SHELL_CMD')
	                           }]
                          }),
                        triggerAction: 'all'
            },{
                xtype : 'numberfield',
                labelWidth : 60,
                width: 250,
                fieldLabel : i18n.getKey('sortOrder'),
                itemId : 'sortOrder',
                value : me.record.get("sortOrder")
            },{
                xtype : 'textfield',
                fieldLabel : i18n.getKey('taskCommand'),
                allowBlank : false,
                labelWidth : 60,
                width: 380,
                itemId: 'command',
                value : me.record.get("command")
            },{
                xtype : 'textarea',
                labelWidth : 60,
                allowBlank : false,
                width: 380,
                fieldLabel : i18n.getKey('description'),
                itemId : 'description',
                value : me.record.get("description")
            }]}];
        me.buttons = ['->',{
                	text : i18n.getKey('ok'),
                	itemId : 'okBtn',
                	handler : function(btn){
                        if(me.form.isValid()){
                            var command = me.form.getComponent('command').getValue();
                            var type = me.form.getComponent('type').getValue();
                            var sortOrder = me.form.getComponent('sortOrder').getValue();
                            var description = me.form.getComponent('description').getValue();
                            me.btnFunction.call(me.controller,me.record,type,command,sortOrder,description);
                            me.close();
                        }

                	}
                },{
                	text : i18n.getKey('cancel'),
                	handler : function(btn){
                		me.close();
                	}
                }];
		me.callParent(arguments);
        me.form = me.down('form');
		me.on("render",function(cmp){
	    	me.body.on("keydown",function(event, target){
	    		if(event.button == 12){
	    			var button = me.child("toolbar").getComponent("okBtn");
	    			button.handler();
	    		}
	    	});
		});
	},
	
	reset : function(record){
		var me = this;
		me.record = record;
		if(record.get("id") != null && record.get("id") > 0){
			me.setTitle(i18n.getKey('edit'));
		}else {
			me.setTitle( i18n.getKey('create'));
		}
		me.form.getComponent("type").setValue(record.get("type"));
		me.form.getComponent("command").setValue(record.get("command"));
		me.form.getComponent("sortOrder").setValue( record.get("sortOrder"));
		me.form.getComponent("description").setValue(record.get("description"));
	}
});