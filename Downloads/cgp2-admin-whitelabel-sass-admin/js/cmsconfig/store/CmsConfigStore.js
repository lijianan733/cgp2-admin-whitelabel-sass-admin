/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmsconfig.store.CmsConfigStore', {
	extend:'Ext.data.Store',
	require:['CGP.cmsconfig.model.CmsConfigModel'],
	model:'CGP.cmsconfig.model.CmsConfigModel',
	pageSize: 50,
	proxy: {
		type: 'uxrest',
		url: adminPath + 'api/cms-configs',
		ready:{
			type:'json',
			root:'data.content'
		}
	},
	autoLoad: true,
	params:null,
	constructor:function(config){
		var me = this;
		if(config && config.params){
			me.proxy.extraParams = config.params;
		}
		me.callParent(arguments);
	}
})