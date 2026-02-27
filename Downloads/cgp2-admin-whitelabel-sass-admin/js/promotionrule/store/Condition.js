Ext.define("CGP.promotionrule.store.Condition",{
	extend : 'Ext.data.Store',
	
	fields : [{
		name : 'id',type : "int",useNull : true
	},{
		name : 'conditionObject',type : 'object'		
	}],
	
	data : []
});