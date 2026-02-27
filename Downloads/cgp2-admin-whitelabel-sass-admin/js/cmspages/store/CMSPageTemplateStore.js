Ext.define('CGP.cmspages.store.CMSPageTemplateStore', {
	extend: 'Ext.data.Store',
	require: ['CGP.cmspages.model.CMSPageTemplateModel'],
	model: 'CGP.cmspages.model.CMSPageTemplateModel',
	PageSize: 25,
	proxy: {
		type: 'uxrest',
		url: cmsPagePath + 'api/cms-saas-page-template',
		reader: {
			type: 'json',
			root: 'data.content'
		}
	},
	autoLoad: true,
	remoteSort: true,
	params: null,
	constructor: function (config) {
		var me = this;
		if (config && config.params) {
			me.proxy.extraParams = config.params;
		}
		me.callParent(arguments);
	}
})