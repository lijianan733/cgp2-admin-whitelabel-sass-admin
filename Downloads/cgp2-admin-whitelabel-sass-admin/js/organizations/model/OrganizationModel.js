Ext.define('CGP.organizations.model.OrganizationModel', {
	extend: 'Ext.data.Model',
	idProperty: '_id',
	fields: [
		{
			name: 'id',
			type: 'int',
			useNull: true,
		},
		{
			name: 'name',
			type: 'string',
		},
		{
			name: 'clazz',
			type: 'string',
			defaultValue: 'com.qpp.cgp.domain.common.Organization',
		},
		{
			name: 'code',
			type: 'string',
		},
		{
			name: 'currency',
			type: 'object',
		},
		{
			name: 'countries',
			type: 'array',
		},
	],
	proxy: {
		type: 'uxrest',
		url: adminPath + 'api/organizations',
		reader: {
			type: 'json',
			root: 'data',
		},
	},
})