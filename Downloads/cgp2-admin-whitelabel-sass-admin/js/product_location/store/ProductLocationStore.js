/*
* Created by nan on 2025/05/1
*/
Ext.define("CGP.product_location.store.ProductLocationStore",{
	extend : 'Ext.data.Store',
	requires : ['CGP.product_location.model.ProductLocationModel'],
	model : 'CGP.product_location.model.ProductLocationModel',
	remoteSort: false,
	pageSize:25,
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/product-locations',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	sorters: {property: '_id', direction: 'DESC'},
	autoLoad:true
});