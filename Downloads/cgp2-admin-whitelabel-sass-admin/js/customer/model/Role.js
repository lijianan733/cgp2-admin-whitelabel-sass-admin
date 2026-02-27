/**
 * 角色model
 */
Ext.define('CGP.customer.model.Role',{
	extend : 'Ext.data.Model',
	idProperty : 'id',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name : 'name',
		type : 'string'
	},{
		name : 'description',
		type : 'string'
	},{
		name : 'permissionIds',
		type: 'string'
	}],
	proxy : {
		type: 'uxrest',
		url :  adminPath + 'api/roles',
		reader : {
			type : 'json',
			root : 'data'
		}
	}
});
