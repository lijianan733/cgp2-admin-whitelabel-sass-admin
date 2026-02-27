Ext.define("CGP.builderbackgroundclass.store.BuilderBackgroundClass",{
	extend : 'Ext.data.Store',
	model : 'CGP.builderbackgroundclass.model.BuilderBackgroundClass',
	remoteSort:false,
	pageSize:25,
	proxy: {
		type:'uxrest',
		url:adminPath + 'api/admin/builderbackgroundclass',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	autoLoad:true
});