Ext.define('CGP.uat.model.Website',{
	extend : 'Ext.data.Model',
	idProperty : 'id',
	fields : [{
		name: 'id',
		type: 'int',
		useNull: true
	},{
		name: 'name',
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