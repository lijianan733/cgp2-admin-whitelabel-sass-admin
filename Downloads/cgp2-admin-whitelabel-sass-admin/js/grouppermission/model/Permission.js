//权限树的model
Ext.define('CGP.grouppermission.model.Permission',{
		extend: 'Ext.data.Model',
		fields: [{name: 'id',type: 'int'},
			{name: 'title', type: 'string'},
			{name: 'description', type: 'string'}
	]
});