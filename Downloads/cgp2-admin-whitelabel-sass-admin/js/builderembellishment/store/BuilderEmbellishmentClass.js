Ext.define("CGP.builderembellishment.store.BuilderEmbellishmentClass",{
	extend : "Ext.data.Store",
	model : 'CGP.builderembellishment.model.BuilderEmbellishmentClass',
	remoteSort:false,
	pageSize:25,
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