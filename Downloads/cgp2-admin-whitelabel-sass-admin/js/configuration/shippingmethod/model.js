Ext.define('CGP.model.ShippingModule',{
	extend : 'Ext.data.Model',
	idProperty:'id',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name : 'code',
		type : 'string'
	},{
		name: 'title',
		type: 'string'
	},{
		name: 'description', 
		type: 'string'
	},{
		name: 'sortOrder',
		type: 'int',
		useNull: true
	},{
		name: 'available', 
		type: 'boolean'
	},{
		name : 'website',
		type : 'int'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/shippingModules',
		reader:{
			type:'json',
			root:'data'
		},
		writer: {
			type : 'json'
		}
	}
});










