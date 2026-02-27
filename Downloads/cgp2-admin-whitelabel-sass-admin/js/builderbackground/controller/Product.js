Ext.define("CGP.builderbackground.controller.Product",{
	
	
	productGrid : null,
	
	openSelectProductWin : function(data,productGrid){
		var me = this;
		me.productGrid = productGrid;
		Ext.create("CGP.builderbackground.view.product.SelectProduct",{
			filterDate : data,
			controller : me
		}).show();
	},
	
	addProduct : function(value){
		var me = this;
		me.productGrid.getStore().add(value);
	},
	
	//这个设置值的方法是用来覆盖gridfield的setSubmitValue方法
	//所以这里的this是gridfield这个控件。
	setSubmitValue : function(value){
		var me = this,store = me._grid.getStore();
		store.removeAll();
        if (Ext.isArray(value) && !Ext.isEmpty(value)) {
        	Ext.Ajax.request({
        		url : adminPath + 'api/admin/product/many',
        		method : 'GET',
        		headers : {
					Authorization : 'Bearer' + Ext.util.Cookies.get("token")        		
        		},
        		params :{
        			productIds : value
        		},
        		success : function(response,options){
        			var data = Ext.decode(response.responseText);
        			store.add(data.data);
        		}
        	});
        }
	}
});