Ext.define('CGP.cmspages.store.ContextStore',{
	extend:'Ext.data.Store',
	require: ['CGP.cmspages.model.ContextModel'],
	model:'CGP.cmspages.model.ContextModel',
	PageSize:25,
	// 正式
	proxy:{
		type:'uxrest',
		url: cmsPagePath + 'api/cms-saas-context',
		reader: {
			type: 'json',
			root: 'data.content'
		}
	},
	autoLoad:true,
	remoteSort: true,
	params:null,
	constructor: function (config) {
		var me = this;
		if (config && config.params) {
			me.proxy.extraParams = config.params;
		}
		me.callParent(arguments);
	}
})