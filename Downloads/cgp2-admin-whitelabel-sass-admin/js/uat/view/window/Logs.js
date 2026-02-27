Ext.define("CGP.uat.view.window.Logs",{
	extend: 'Ext.window.Window',
	mixins : ["Ext.ux.util.ResourceInit"],
	
	record : null,//这个Logs页面对应的一条UAT数据
	

	
	width : 600,
	height: 300,
	resizable: false,
	layout : "fit",
	modal : true,
	initComponent : function(){
		var me = this;

		me.title = i18n.getKey('log');
		me.callParent(arguments);
		
		me.panel = Ext.create("Ext.grid.Panel",{
			store : Ext.create("CGP.uat.store.UATLogStore",{
				id : me.record.get("id"),
				listeners : {
					load : function(store,record,success){
						record;
					}
				}
			}),
			columns : [{
				text : i18n.getKey('approver'),
				dataIndex : 'operator',
				width : 130,
				sortable : false,
				renderer : function(value,metadata){
					metadata.tdAttr = "data-qtip='<div>"+value+"</div>'";
					return value;
				}
			},{
				text : i18n.getKey('status'),
				dataIndex : 'status',
				sortable : false,
				renderer: function(value,metadata){
					if(value == "REJECTED"){
						metadata.style = 'color : red';
					}else if(value == "CONFIRMED"){
						metadata.style = 'color : green';
					}else if(value == "CANCELLED"){
						metadata.style = 'color : gray';
					}
					return i18n.getKey(value);
				}
			},{
				text : i18n.getKey('confirmedDate'),
				dataIndex : 'confirmedDate',
				sortable : false,
				align: 'center',
				renderer: function(value, metadata){
					if(value == null){
						return "";
					}
					value = Ext.Date.format(value,"Y/m/d H:i");
					metadata.style = 'color : gray';
					metadata.tdAttr = "data-qtip = '"+value+"'";
					return  '<div style="white-space:normal;">' + value + '</div>'
				}
			},{
				text : i18n.getKey('remark'),
				dataIndex : 'remark',
				sortable : false,
				width : 250,
				renderer : function(value,metadata){
					metadata.tdAttr = "data-qtip = '<div>"+value+"</div>'";
					return value;
				}
			}]
		});
		me.add(me.panel);
	}
});