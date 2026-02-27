Ext.define("CGP.attributesets.store.LocalattributeSetToAttributes",{
	extend : 'Ext.data.Store',
	requires : ["CGP.attributesets.model.LocalattributeSetToAttributes"] ,
	
	model : 'CGP.attributesets.model.LocalattributeSetToAttributes',
	//autoSync : true,
	proxy : {
		type : 'memory'
	},
	sorters : [{   //应用于当前Store的排序器集合
		property : 'sortOrder',
		direction : 'ASC'
	}],
	listeners : {
		update: function(me,record, operation,modifiedFieldNames, eopts){
			me.sort("sortOrder",'ASC');
		}
	}
});
