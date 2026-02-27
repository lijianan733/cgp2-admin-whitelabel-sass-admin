/**
 * currency store
 */
Ext.Loader.syncRequire([
	'CGP.currency.model.Currency'
])
Ext.define("CGP.currency.store.Currency",{
	extend : 'Ext.data.Store',
	requires : ["CGP.currency.model.Currency"],

	model : "CGP.currency.model.Currency",
    /**
     * @cfg {boolean} remoteSort
     * 是否在服务器端排序
     */
	remoteSort:false,
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
	pageSize:25,
    /**
     * @cfg {Ext.data.Proxy} proxy
     * store proxy
     */
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/currencies',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
    /**
     * @cfg {boolean} autoLoad
     * 是否自动加载
     */
	autoLoad:true,
	constructor: function (config) {
		var me = this;
		if (config && config.params) {
			me.proxy.extraParams = config.params;
		}
		me.callParent(arguments);
	}
});
