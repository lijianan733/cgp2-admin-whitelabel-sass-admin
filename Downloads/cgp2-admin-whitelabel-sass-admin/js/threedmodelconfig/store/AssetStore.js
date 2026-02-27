Ext.define("CGP.threedmodelconfig.store.AssetStore",{
	extend : 'Ext.data.Store',
	
	model : 'CGP.threedmodelconfig.model.AssetModel',
	autoSync : true,
	proxy : {
		type : 'memory'
	},
	sorters : [{
		property : 'index',
		direction : 'ASC'
	}],
	listeners : {
		update: function(me,record, operation,modifiedFieldNames, eopts){
			me.sort("index",'ASC');
		}
	}
});
