Ext.define("CGP.uat.store.UATLogStore",{
	extend : 'Ext.data.Store',
	requires : ["CGP.uat.model.UATLog"],
	
	model : 'CGP.uat.model.UATLog',
	url : adminPath  + 'api/admin/uat/{0}/uatlog',
	proxy : {
		type : "uxrest",
		url : adminPath  + 'api/admin/uat/{0}/uatlog',
		reader : {
			type : 'json',
			root : 'data'
		}
	},
	autoLoad : true,
	
	constructor : function(config){
		var me = this;
		var url = Ext.clone(me.url);
		me.proxy.url = Ext.String.format(url, config.id);
		me.callParent(arguments);
	}
});