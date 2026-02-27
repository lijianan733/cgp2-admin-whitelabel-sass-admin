Ext.define('CGP.partnerapplys.model.Website',{
	extend : 'Ext.data.Model',
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