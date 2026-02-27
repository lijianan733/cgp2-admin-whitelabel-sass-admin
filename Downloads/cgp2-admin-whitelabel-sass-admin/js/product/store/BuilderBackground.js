Ext.define("CGP.product.store.BuilderBackground",{
	extend : 'Ext.data.Store',
	requires : ["CGP.product.model.BuilderBackground"],
	
	model : "CGP.product.model.BuilderBackground",
	filterData : null,
	pageSize : 25,
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/builderbackground',
		reader : {
			type : 'json',
			root : 'data.content'
		}
	},
	autoLoad : true,
	
	constructor : function(config){
		var me = this;
		me.filters = [{
			filterFn: function(item){
				if(Ext.isEmpty(me.filterData)){
					return true;
				}
				var data = me.filterData;
				for(var i = 0;i < data.length;i++){
					if(item.get("id") == data[i].get("id")) return false;
				}
				return true;
			}
		}];
		me.callParent(arguments);
	}
});