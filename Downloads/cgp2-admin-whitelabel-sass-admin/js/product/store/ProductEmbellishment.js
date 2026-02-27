//这个是保存某个产品的关联的背景
Ext.define("CGP.product.store.ProductEmbellishment",{
	extend : 'Ext.data.Store',
	requires : ["CGP.product.model.BuilderEmbellishment"],
	
	record : null, //一条产品数据。
	
	model : "CGP.product.model.BuilderEmbellishment",
	sorters : [{
		property : 'sortOrder'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/builderembellishment/byproduct/{0}',
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