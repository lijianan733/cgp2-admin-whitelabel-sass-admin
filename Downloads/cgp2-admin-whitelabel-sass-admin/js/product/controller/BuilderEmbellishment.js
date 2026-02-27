Ext.define("CGP.product.controller.BuilderEmbellishment",{
	

	constructor : function(config){

		this.callParent(arguments);
	},
	productBackgroundWin : null,
	productRecord : null,
	
	//保存背景到数据库
	saveBackground : function(win){
		 var me = this,store,backgroundIds = [];
		store = win.getComponent("background").getStore();
		store.each(function(record){
			backgroundIds.push(record.get("id"));
		});
		var url = adminPath + 'api/admin/product/{0}/modifyembellishment';
		url = Ext.String.format(url,me.productRecord.get("id"));
		var params = "";
		for(var i = 0 ;i < backgroundIds.length; i++){
			params = params + "embellishmentIds="+backgroundIds[i];
			if(i < backgroundIds.length - 1){
				params = params + "&";
			}
		}
		if(Ext.isEmpty(backgroundIds)){
			params = "embellishmentIds";
			Ext.Msg.confirm(i18n.getKey('prompt'),i18n.getKey('isClearEmbellishment') +"?",function(e){
				if(e == "yes"){
					me.request(win,url,params);
				}
			});
		}else{
			me.request(win,url,params);
		}
	},
	request : function(win,url,params){
		var me = this;
			Ext.Ajax.request({
				url : url + "?" + params,
				method : 'PUT',
				headers : {
					Authorization : "Bearer" + Ext.util.Cookies.get("token")
				},
				success : function(response,options){
					var r = Ext.decode(response.responseText);
					if(r.success){
						win.close();
						Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('saveSuccess'));
					}else{
                        Ext.Msg.alert(i18n.getKey('requestFailed'),r.data.message);
                    }
				},
				failure : function(response,options){
					var r = Ext.decode(response.responseText);
					Ext.Msg.alert(i18n.getKey('requestFailed'),r.data.message);
				}
			});
	},
	
	//显示管理背景的window。
	showBackground : function(record){
		var me = this;
		me.productRecord = record;
		
		me.productBackgroundWin = Ext.create("Ext.window.Window",{
			title : i18n.getKey('managerEmbellishment'),
			modal : true,
			layout : 'fit',
			bbar : ["->",{
				text : i18n.getKey('save'),
				handler : function(){
					me.saveBackground(me.productBackgroundWin);
				}
			},{
				text : i18n.getKey('cancel'),
				handler : function(){
					me.productBackgroundWin.close();
				}
			}],
			items : [{
				xtype : 'grid',
				itemId : 'background',
				width : 700,
				minHeight : 300,
				store : Ext.create("CGP.product.store.ProductEmbellishment",{
					record : record,
					listeners : {
						load : function(store, records, successful){
							if(Ext.isEmpty(records)){
								Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('noEmbellishmentMsg'));
							}
						}
					}
				}),
				tbar : [{
					text : i18n.getKey('add'),
					handler : function(){
						me.openAddBackgroundWin(me.productBackgroundWin);
					}
				}],
				columns : [{
					xtype : 'actioncolumn',
					width : 50,
					items : [{
						iconCls : "icon_remove", 
		                tooltip: 'destroy',
		                handler: function(view, rowIndex, colIndex,item,e,record) {
		                    view.getStore().remove(record);
		                }
					}]
				},{
	                text: i18n.getKey('id'),
	                dataIndex: 'id',
	                xtype: 'gridcolumn',
	                itemId: 'id',
	                sortable: true,
	                width : 50
	   			},  {
	                dataIndex: 'name',
	                text: i18n.getKey('name'),
	                sortable: false,
	                itemId: 'name',
	                tdCls: 'vertical-middle'
	            }, {
	                dataIndex: 'format',
	                text: i18n.getKey('format'),
	                sortable: false,
	                itemId: 'format',
	                tdCls: 'vertical-middle',
	                width : 50
	            }, {
	                dataIndex: 'width',
	                text: i18n.getKey('width'),
	                sortable: false,
	                itemId: 'width',
	                tdCls: 'vertical-middle'
	            }, {
	                dataIndex: 'height',
	                text: i18n.getKey('height'),
	                sortable: false,
	                itemId: 'height',
	                tdCls: 'vertical-middle'
	            }, {
	                dataIndex: 'originalFileName',
	                text: i18n.getKey('originalFileName'),
	                sortable: false,
	                itemId: 'originalFileName',
	                tdCls: 'vertical-middle',
	                width : 220
	            }]
			}]
		});
		me.productBackgroundWin.show();
	},
	
	//openAddBackgroundWin
	openAddBackgroundWin : function(win){
		 var me = this, recordData = win.getComponent("background").getStore().data.items;
		
		var selectBackgroundWin = Ext.create("CGP.product.view.embellishment.SelectEmbellishment",{
			filterData : recordData,
			controller : me
		});
		selectBackgroundWin.show();
	},
	
	addBackground : function(value){
		var me = this,store = me.productBackgroundWin.child("grid").getStore();
		store.add(value);
	}
});