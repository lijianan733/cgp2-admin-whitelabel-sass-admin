Ext.define("CGP.promotionrule.store.ConditionType",{
	extend : "Ext.data.Store",
	
	fields : ["value","displayValue"],

	data : [],
	
	constructor : function(config){
		var me = this;


		me.data = [{
			value : "user",displayValue : i18n.getKey('userCondition')
		},{
			value : 'product', displayValue : i18n.getKey('productCondition')
		},{
			value : 'payment',displayValue : i18n.getKey('paymentCondition')
		},{
			value : 'orderAmount',displayValue : i18n.getKey('orderAmountCondition')
		},{
			value : 'shipping',displayValue : i18n.getKey('shippingCondition')
		}];
		
		me.callParent(arguments);
	}
});