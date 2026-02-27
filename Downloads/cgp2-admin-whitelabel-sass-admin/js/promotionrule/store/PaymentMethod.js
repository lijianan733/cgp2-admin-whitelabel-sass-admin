Ext.define("CGP.promotionrule.store.PaymentMethod",{
	extend : 'Ext.data.Store',
	requires : ["CGP.promotionrule.model.PaymentMethod"],
	
	model : 'CGP.promotionrule.model.PaymentMethod',
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/paymentmodule/allpaymentmethod',
		reader : {
			type: 'json',
			root: 'data'
		}
	},
	autoLoad : true
});