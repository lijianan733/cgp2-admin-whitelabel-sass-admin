/**
 * currency store
 */
Ext.define("CGP.materialviewtype.store.PageContentSchema",{
    extend : 'Ext.data.Store',
    requires : ["CGP.materialviewtype.model.PageContentSchema"],

    model : "CGP.materialviewtype.model.PageContentSchema",
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
        url:adminPath + 'api/pageContentSchemas',
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