Ext.define("CGP.uat.store.UATStore",{
	extend : 'Ext.data.Store',
	requires : ["CGP.uat.model.UAT"],
	
	model : 'CGP.uat.model.UAT',
	remoteSort:false,
	pageSize:25,
	proxy : {
		type : "uxrest",
		url : adminPath  + 'api/admin/uat',
		reader : {
			type : 'json',
			root : 'data.content'
		}
	},
	autoLoad : true
});