Ext.define("CGP.promotionrule.store.PolicyType",{
	extend : 'Ext.data.Store',
	
	fields : ["value","display"],

	
	constructor : function (config){
		var me = this;

		me.data = [{
			value : 'product',display : i18n.getKey('productPromotionPolicy')
		},{
			value : 'order',display : i18n.getKey('orderPromotionPolicy')
		},{
			value : 'shipping',display : i18n.getKey('shippingPromotionPolicy')
		}];
		
		me.callParent(arguments);
	}
});