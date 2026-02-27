Ext.define('CGP.cmsformcomponentrendertemplate.store.CmsFormComponentRenderTemplateStore',{
	extend:'Ext.data.Store',
	require:['CGP.cmsformcomponentrendertemplate.model.CmsFormComponentRenderTemplateModel'],
	model:'CGP.cmsformcomponentrendertemplate.model.CmsFormComponentRenderTemplateModel',
	PageSize: 25,
	proxy: {
		type:'uxrest',
		url: adminPath + 'api/form-element-component-template',
		ready:{
			type:'json',
			root:'data.content'
		}
	},
	sorters: [{
		property: '_id',
		direction: 'DESC'
	}],
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