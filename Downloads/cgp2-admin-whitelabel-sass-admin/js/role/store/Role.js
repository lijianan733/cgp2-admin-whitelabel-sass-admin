Ext.define("CGP.role.store.Role",{

	extend : 'Ext.data.Store',
	requires : ['CGP.role.model.Role'], 
	
	model : 'CGP.role.model.Role',
//	storeId : 'roleStore',
	remoteSort:false,
	pageSize:25,
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/roles',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	autoLoad:true
});