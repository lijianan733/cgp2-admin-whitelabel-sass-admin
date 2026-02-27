Ext.define('CGP.organizations.store.OrganizationStore', {
	extend: 'Ext.data.Store',
	require: ['CGP.organizations.model.OrganizationModel'],
	model: 'CGP.organizations.model.OrganizationModel',
	pageSize: 25,
	proxy: {
		type: 'uxrest',
		url: adminPath + 'api/organizations',
		reader: {
			type: 'json',
			root: 'data.content',
		},
	},
	autoLoad: true,
	params: null,
	constructor: function (config) {
		var me = this;
		if (config && config.params) {
			me.proxy.extraParams = config.params;
		}
		me.callParent(arguments);
	},
})