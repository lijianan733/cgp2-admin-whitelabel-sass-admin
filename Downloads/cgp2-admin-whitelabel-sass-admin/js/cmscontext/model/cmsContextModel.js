Ext.define('CGP.cmscontext.model.cmsContextModel', {
	extend: 'Ext.data.Model',
	idProperty: '_id',
	fields: [
		{
			name: '_id',
			type: 'string'
		},
		{
			name: 'clazz',
			type: 'string',
			defaultValue: 'com.qpp.domain.cms.CMSContext'
		},
		{
			name: 'name',
			type: 'string'
		},
		{
			name: 'variables',
			type: 'array'
		},
	],
	proxy: {
		type: 'uxrest',
		url: cmsPagePath + 'api/cms-saas-context',
		reader: {
			type: 'json',
			root: 'data'
		}
	}
})