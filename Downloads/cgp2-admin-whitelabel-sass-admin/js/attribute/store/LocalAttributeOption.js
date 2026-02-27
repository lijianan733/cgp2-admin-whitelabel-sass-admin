Ext.define("CGP.attribute.store.LocalAttributeOption",{
	extend : 'Ext.data.Store',
	requires : ["CGP.attribute.model.AttributeOption"] ,
	
	model : 'CGP.attribute.model.AttributeOption',
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
