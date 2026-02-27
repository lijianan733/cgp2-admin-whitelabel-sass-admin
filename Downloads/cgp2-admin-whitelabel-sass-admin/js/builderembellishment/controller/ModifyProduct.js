Ext.define("CGP.builderembellishment.controller.ModifyProduct",{
	

	constructor : function(){

		this.callParent(arguments);
	},
	
	openModifyProductWin : function(record){
		var selectProductWin = Ext.create("CGP.builderembellishment.view.modify.Product",{
			controller : this,
			record : record
		});
		selectProductWin.show();
		
	},
	
	productGrid : null,//存放已选择好的产品的grid。
	openSelectProductWin : function(records,productGrid){
		var me = this;
		me.productGrid = productGrid;
		Ext.create("CGP.builderembellishment.view.upload.SelectProduct",{
			filterDate : records,
			controller : me
		}).show();
	},
	
	addProduct : function(value){
		var me = this;
		me.productGrid.getStore().add(value);
	},
	
	save : function(record, grid,productWin){
		var me = this,url,productIds = [];
		
		url = adminPath + "api/admin/builderembellishment/" + record.get("id") + "/modifyProduct";
		
		grid.store.each(function(model){
			productIds.push(model.get("id"));
		});
		var paramsStr = "";
		for(var i = 0; i < productIds.length; i++){
			paramsStr = paramsStr + "productIds=" + productIds[i];
			if(i < productIds.length - 1)
			paramsStr = paramsStr + "&";
		}
		
		Ext.Ajax.request({
			url : url + "?" + paramsStr,
			method : "PUT",
			headers : {
				Authorization : 'Bearer'+ Ext.util.Cookies.get("token")
			},
//			params : {
//				productIds : productIds
//			},
			success : function(response,options){
				var r = Ext.decode(response.responseText);
				if(r.success){
					productWin.close();
					Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('saveSuccess'));
					record.store.loadPage(1);
				}else{
					Ext.Msg.alert(i18n.getKey('prompt'),r.message);
				}
			},
			failure : function(){
				Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('systemError'));
			}
		});
	}
});