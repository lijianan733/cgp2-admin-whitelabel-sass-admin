Ext.define("CGP.builderbackground.store.BuilderBackground",{
	extend : 'Ext.data.Store',
	requires : ["CGP.builderbackground.model.BuilderBackground"],
	model : "CGP.builderbackground.model.BuilderBackground",
	remoteSort:false,
	pageSize:25,
	proxy: {
		type:'uxrest',
		url:adminPath + 'api/admin/builderbackground',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	autoLoad:true
});