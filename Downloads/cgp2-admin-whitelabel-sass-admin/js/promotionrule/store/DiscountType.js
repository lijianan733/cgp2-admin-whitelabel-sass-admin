Ext.define("CGP.promotionrule.store.DiscountType",{
	extend : 'Ext.data.Store',

	
	fields : [{name : 'value',type : 'int'},"display"],
	
	constructor : function(config){
		var me = this;

		me.data = [{
			value : 0,display : i18n.getKey('discount')
		},{
			value : 1,display : i18n.getKey('reduce')
		}];
		me.callParent(arguments);
	}
});