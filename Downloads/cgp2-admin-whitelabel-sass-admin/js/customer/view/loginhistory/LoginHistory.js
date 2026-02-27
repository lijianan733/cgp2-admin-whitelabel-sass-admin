Ext.define("CGP.customer.view.loginhistory.LoginHistory",{
	extend : 'Ext.window.Window',
	alias : 'widget.loginhistory',
	mixins :["Ext.ux.util.ResourceInit"],
	requires : ["CGP.customer.store.LoginHistoryStore"],
	
	grid :null,//显示Loginhistory 数据
	store : null, //grid的数据
	record : null, //一条用户数据
	controller : null,//登录历史的controller
	
	//默认第一次查看登录历史只搜索最近一个月的
    defaultLoginDate : "number=1,direction=greaterthan",
    	
	modal : true,

	
	closeAction : 'hide',
	items : [{
	 	xtype : 'form',
	    width : 700,
	    items: []
	}],
	    	
	initComponent : function(){
		var me = this;


		me.title = i18n.getKey('loginHistory');
		me.store = Ext.create("CGP.customer.store.LoginHistoryStore",{
			userId : me.record.get("id"),
			defaultLoginDate : me.defaultLoginDate
		});
		
		me.callParent(arguments);
		var combo = Ext.create("Ext.form.field.ComboBox",{
		                name: 'loginDate',
		                xtype: 'combo',
		                width : 300,
		                style : {
		                	marginTop : '5px'
		                },
		                labelAlign : 'right',
		                editable : false ,
		                store : new Ext.data.Store({
		                	fields : ["name","value"],
		                	data : [
		                		{name : i18n.getKey('oneMonthRecently'),value : "number=1,direction=greaterthan"},
		                		{name : i18n.getKey('threeMonthRecently'),value :  "number=3,direction=greaterthan"},
		                		{name : i18n.getKey('sixMonthRecently'),value :  "number=6,direction=greaterthan"},
		                		{name : i18n.getKey('halfayearbefore'),value :  "number=6,direction=lessthan"}
		                	]
		                }),
		                queryMode: 'local',
					    displayField: 'name',
					    valueField: 'value',
		                hideTrigger: false,
		                fieldLabel: i18n.getKey('loginDate'),
		                itemId: 'date',
		                value : me.defaultLoginDate,
		                listeners : {
		                	change : function(){
		                		var dateValue = this.getValue();
	    						me.store.proxy.extraParams["filter"] = '[{"name":"loginDate","value":"'+dateValue+'","type":"String"}]';	
	    						me.store.loadPage(1);
	    					}
		                }
		       		});
		me.child("form").add(combo);
		
		me.grid = Ext.create("Ext.grid.Panel",{
	    			xtype : "grid",
	    			width : 700,
	    			height : 400,
	    			store: me.store,
				    columns: [
				    	{xtype: 'rownumberer',width : 50},
				        { header: i18n.getKey('ipAddress'),  dataIndex: 'ipAddress',minWidth : 120,sortable :false},
				        { header: i18n.getKey('loginDate'), dataIndex: 'loginDate',minWidth : 145,
				        	xtype:'datecolumn',
				        	 format: 'Y-m-d H:i:s'},
				        { header: i18n.getKey('loginInformation'), dataIndex: 'userAgent',minWidth : 800,sortable : false,
				        	renderer : function(value){
				        		return  value.replace(/([)])\s/,")<br>");
				        	}
				        }
				    ],
				    bbar: Ext.create('Ext.PagingToolbar', {
	                    store: me.store,
	                    displayInfo: true,
	                    displayMsg: 'Displaying {0} - {1} of {2}',
	                    emptyMsg: i18n.getKey('noData')
	                })
				}); 
		me.add(me.grid);
	},
	refresh :function(record){
		var me = this;
		me.record = record;
		me.child("form").child("combo").setValue(me.defaultLoginDate);
		me.store.refresh(record.get('id'));
		me.store.loadPage(1);
	}
});