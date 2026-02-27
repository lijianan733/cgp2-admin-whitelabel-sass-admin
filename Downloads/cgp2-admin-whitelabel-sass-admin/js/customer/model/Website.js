/**
 * 网站管理的model
 */
Ext.define('CGP.customer.model.Website',{
	extend : 'Ext.data.Model',
	idProperty : 'id',
	fields : [{
		name: 'id',
		type: 'int',
		useNull: true
	},{
		name: 'name',
		type: 'string'
	},{
		name: 'code',
		type: 'string'
	},{
		name: 'url',
		type: 'string'
	}],
	proxy : {
		type: 'uxrest',
		url: adminPath + 'api/websites',
		reader: {
			type : 'json',
			root : 'data'
		}
	}
});
