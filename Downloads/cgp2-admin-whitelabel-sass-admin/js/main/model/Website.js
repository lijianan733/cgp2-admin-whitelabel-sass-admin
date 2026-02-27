/**
 * 网站管理的model
 */
Ext.define('CGP.main.model.Website',{
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
	}]
});
