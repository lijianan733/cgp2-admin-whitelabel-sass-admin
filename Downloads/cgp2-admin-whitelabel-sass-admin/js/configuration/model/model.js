Ext.define('CGP.model.Config',{
	extend : 'Ext.data.Model',
	idProperty:'id',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name: 'title',
		type: 'string'
	},{
		name: 'description',
		type: 'string'
	},{
		name: 'key',
		type: 'string'
	},{
		name: 'value',
		type: 'string'
	},{
		name: 'clazz',
		type: 'string',
		defaultValue: 'com.qpp.cgp.domain.common.Configuration'
	}
//	,{
//		name: 'ConfigurationGroup_id',
//		type: 'int'
//	}
	],
	validations : [ {
		type : 'length',
		field : 'title',
		min : 1
	}, {
		type : 'length',
		field : 'description',
		min : 1
	} ],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/configurations',
		reader:{
			type:'json',
			root:'data'
		},
		writer: {
			type : 'json'
		}
	}
});










