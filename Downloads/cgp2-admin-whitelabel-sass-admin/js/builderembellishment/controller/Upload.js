Ext.define("CGP.builderembellishment.controller.Upload",{
	
	productGrid : null,
	
	openSelectProductWin : function(data,productGrid){
		var me = this;
		me.productGrid = productGrid;
		Ext.create("CGP.builderembellishment.view.upload.SelectProduct",{
			filterDate : data,
			controller : me
		}).show();
	},
	
	addProduct : function(value){
		var me = this;
		me.productGrid.getStore().add(value);
	}
});