Ext.define('CGP.cmspagestemplate.model.CMSPageTemplateModel', {
	extend: 'Ext.data.Model',
	idProperty: '_id',
	fields: [
		{
			name: '_id',
			type: 'string',
			useNull: true
		},
		{
			name: 'clazz',
			type: 'string',
			defaultValue: 'com.qpp.domain.cms.CMSSaasPageTemplate'
		},
		{
			name: 'name',
			type: 'string'
		},
		{
			name: 'cmsType',
			type: 'string'
		},
		{
			name: 'description',
			type: 'string'
		},
		{
			name: 'templateFilePath',
			type: 'string'
		},
		{
			name: 'staticPreviewFile',
			type: 'string'
		},
		{
			name: 'status',
			type: 'int'
		},
		{
			name: 'cmsContext',
			type: 'object'
		},
		{
			name: 'tags',
			type: 'array'
		},
		{
			name: 'imageSizeLimits',
			type: 'array'
		}
	],
	proxy: {
		type: 'uxrest',
		url: cmsPagePath + 'api/cms-saas-page-template',
		reader: {
			type: 'json',
			root: 'data'
		}
	}
})