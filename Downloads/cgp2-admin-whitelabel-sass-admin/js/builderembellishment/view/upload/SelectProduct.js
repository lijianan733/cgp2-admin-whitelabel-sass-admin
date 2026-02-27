Ext.define("CGP.builderembellishment.view.upload.SelectProduct",{
	extend : 'Ext.window.Window',
	

	
	modal : true,
	width : 1000,
	height : 640,
	controller : null,
	initComponent : function(){
		var me = this;

		me.title = i18n.getKey('product');
		
		me.productGrid =  Ext.create("CGP.promotionrule.view.product.List",{
			filterDate : me.filterDate
		});
		me.bbar = ["->",{
			xtype : 'button',
			text : i18n.getKey('ok'),
			iconCls : 'icon_save',
			handler : function(btn){
				var value = me.getValue();
				me.controller.addProduct(value);
				me.close();
			}
		},{
			xtype : 'button',
			iconCls : "icon_cancel",
			text : i18n.getKey('cancel'),
			handler : function(btn){
				me.close();
			}
		}];
		me.items = [{
			xtype : 'fieldcontainer',
			fieldLabel : i18n.getKey('product'),
			labelAlign : 'right',
			labelWidth : 80,
			width : '100%',
			height : '100%',
			items : [me.productGrid]
		}];
		me.callParent(arguments);
	},
	
	getValue : function(){
		var me = this;
		var grid = me.productGrid.down("grid");
		return grid.getSelectionModel().getSelection();
	}
	
})