Ext.define("CGP.promotionrule.store.ShippingMethod",{
	extend : 'Ext.data.Store',
	
	fields : ["code","name"],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/shippingmodule/allMethod',
		reader : {
			type : 'json',
			root : 'data'
		}
	},
	autoLoad : true
});