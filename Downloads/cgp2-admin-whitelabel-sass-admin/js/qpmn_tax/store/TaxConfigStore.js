/*
* Created by nan on 2025/05/1
*/
Ext.define("CGP.qpmn_tax.store.TaxConfigStore",{
	extend : 'Ext.data.Store',
	requires : ['CGP.qpmn_tax.model.TaxConfigModel'],
	model : 'CGP.qpmn_tax.model.TaxConfigModel',
	remoteSort: false,
	pageSize:25,
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/vatTaxs',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	sorters: {property: '_id', direction: 'DESC'},
	autoLoad:true
});