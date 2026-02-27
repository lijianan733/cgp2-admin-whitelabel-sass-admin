Ext.define('CGP.cmscontext.store.cmsContextStore',{
	extend:'Ext.data.Store',
	require:['CGP.cmscontext.model.cmsContextModel'],
	model:'CGP.cmscontext.model.cmsContextModel',
	PageSize: 25,
	proxy: {
		type:'uxrest',
		url: cmsPagePath + 'api/cms-saas-context',
		ready:{
			type:'json',
			root:'data.content'
		}
	},
	autoLoad:true,
	params:null,
	remoteSort: true,
	constructor:function(config){
		var me = this;
		if (config && config.params) {
			me.proxy.extraParams = config.params;
		}
		me.callParent(arguments);
	}
})