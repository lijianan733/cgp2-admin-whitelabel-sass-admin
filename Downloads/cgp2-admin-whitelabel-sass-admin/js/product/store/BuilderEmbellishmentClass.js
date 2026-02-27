Ext.define('CGP.product.store.BuilderEmbellishmentClass',{
	extend : 'Ext.data.Store',
	
	model : 'CGP.product.model.BuilderBackgroundClass',
	remoteSort:false,
	pageSize:10,
	proxy: {
		type:'uxrest',
		url:adminPath + 'api/admin/builderembellishmentclass',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	
	autoLoad:true
	
});