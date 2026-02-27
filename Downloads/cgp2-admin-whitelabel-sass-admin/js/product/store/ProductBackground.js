//这个是保存某个产品的关联的背景
Ext.define("CGP.product.store.ProductBackground",{
	extend : 'Ext.data.Store',
	requires : ["CGP.product.model.BuilderBackground"],
	
	record : null, //一条产品数据。
	
	model : "CGP.product.model.BuilderBackground",
	sorters : [{
		property : 'sortOrder'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/builderbackground/byproduct/{0}',
		reader : {
			type : 'json',
			root : 'data'
		}
	},
	pageSize : 1000,
	constructor : function(config){
		var me = this;
		me.callParent(arguments);
		me.proxy.url = Ext.String.format(me.proxy.url,me.record.get("id"));
	},
	autoLoad : true
})