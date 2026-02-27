Ext.define("CGP.model.SaleProductCategory",{
	extend : 'Ext.data.Model',
	fields : [{
		name : 'money',
		type : 'double'
	},{
		name : 'mainCategory',
		type : 'string'
	}]
	
});

Ext.create('Ext.data.Store',{
	storeId : 'ProductCategoryStore',
	model : 'CGP.model.SaleProductCategory',
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/orderstatistics/productcategory',
		reader : {
			type: 'json',
			root: 'data'
		}
	},
	autoLoad : false
});