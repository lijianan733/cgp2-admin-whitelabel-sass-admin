/*
* Created by nan on 2025/05/1
*/
Ext.define("CGP.import_service.store.ImportServiceStore",{
	extend : 'Ext.data.Store',
	requires : ['CGP.import_service.model.ImportServiceModel'],
	model : 'CGP.import_service.model.ImportServiceModel',
	remoteSort: false,
	pageSize:25,
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/importServices',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	sorters: {property: '_id', direction: 'DESC'},
	autoLoad:true
});