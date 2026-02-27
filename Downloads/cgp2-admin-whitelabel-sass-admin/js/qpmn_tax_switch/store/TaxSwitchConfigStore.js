/*
* Created by nan on 2025/05/1
*/
Ext.define("CGP.qpmn_tax_switch.store.TaxSwitchConfigStore",{
	extend : 'Ext.data.Store',
	requires : ['CGP.qpmn_tax_switch.model.TaxSwitchConfigModel'],
	model : 'CGP.qpmn_tax_switch.model.TaxSwitchConfigModel',
	remoteSort: false,
	pageSize:25,
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/areaTaxSwitchs',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	sorters: {property: '_id', direction: 'DESC'},
	autoLoad:true
});