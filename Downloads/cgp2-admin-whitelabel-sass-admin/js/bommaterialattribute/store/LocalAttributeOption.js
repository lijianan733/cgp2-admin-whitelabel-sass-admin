Ext.define("CGP.bommaterialattribute.store.LocalAttributeOption",{
	extend : 'Ext.data.Store',
	requires : ["CGP.bommaterialattribute.model.AttributesOptions"] ,
	
	model : 'CGP.bommaterialattribute.model.AttributesOptions',
	autoSync : true,
	proxy : {
		type : 'memory'
	},
	sorters : [{
		property : 'sortOrder',
		direction : 'ASC'
	}],
	listeners : {
		update: function(me,record, operation,modifiedFieldNames, eopts){
			me.sort("sortOrder",'ASC');
		}
	}
});
