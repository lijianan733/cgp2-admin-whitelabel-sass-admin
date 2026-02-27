Ext.define("CGP.promotionrule.controller.customer.CustomerController",{


	
	addProductWin : null, //存放的是添加product的window
	
	constructor : function(config){
		var me = this;

		me.productCondition = config.productCondition;
		me.callParent(arguments);
	},
	
	//显示添加product的window
	showAddProductWin : function(data,websiteId){
		var me = this;
			me.addProductWin = Ext.create("Ext.window.Window",{
				modal : true,
				title : i18n.getKey('customer'),
				tbar : [{
					xtype : 'button',
					text : i18n.getKey('save'),
					iconCls : 'icon_save',
					handler : function(btn){
						me.addProduct();
					}
				},{
					xtype : 'button',
					iconCls : "icon_cancel",
					text : i18n.getKey('cancel'),
					handler : function(btn){
						me.close();
					}
				}],
				items : [Ext.create("CGP.promotionrule.view.user.List",{
					filterDate : data,
					websiteId : websiteId
				})]
			});
		me.addProductWin.show();
	},
	addProduct : function(){
		var me = this,value;
		value =  me.addProductWin.items.items[0].getValue();
		var grid = me.productCondition.userPage.down("grid");
		grid.getStore().add(value);
		me.addProductWin.close();
	}
	
});