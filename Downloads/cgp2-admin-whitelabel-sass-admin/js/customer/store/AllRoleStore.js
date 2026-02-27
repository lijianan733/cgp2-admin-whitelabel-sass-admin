Ext.define("CGP.customer.store.AllRoleStore",{
	extend : 'Ext.data.Store',
	requires : ['CGP.customer.model.Role'],
	
 	model : 'CGP.customer.model.Role',
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