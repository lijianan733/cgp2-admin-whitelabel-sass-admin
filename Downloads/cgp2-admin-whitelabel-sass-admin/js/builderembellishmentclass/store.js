Ext.create('Ext.data.Store',{
	storeId : 'builderBackgroundClassStore',
	model : 'CGP.model.BuilderBackgroundClass',
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