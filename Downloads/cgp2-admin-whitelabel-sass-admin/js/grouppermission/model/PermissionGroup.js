Ext.define('CGP.grouppermission.model.PermissionGroup',{
	extend:'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name:'name',
		type:'string'
	},{
		name:'title',
		type:'string'
	},{
		name: 'permissionIds',
		type: 'string'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/groupPermissions',
		reader:{
			type:'json',
			root:'data'
		}
	}
});
