Ext.define("CGP.grouppermission.store.PermissionGroup",{
	extend: "Ext.data.Store",
	requires : ["CGP.grouppermission.model.PermissionGroup"],
	
	model : 'CGP.grouppermission.model.PermissionGroup',
	remoteSort : false,
	pageSize :25,
	proxy:{
		type : 'uxrest',
		url : adminPath + 'api/groupPermissions',
		reader : {
			type : 'json',
			root : 'data.content'
		}
	},
	autoLoad : true
});
