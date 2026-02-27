/**
 * currency store
 */
Ext.define("CGP.attributesets.store.Attributesets",{
	extend : 'Ext.data.Store',
	requires : ["CGP.attributesets.model.Attributesets"],

	model : "CGP.attributesets.model.Attributesets",
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
		url:adminPath + 'api/admin/bom/schema/attributeSets',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
    /**
     * @cfg {boolean} autoLoad
     * 是否自动加载
     */
	autoLoad:true
});