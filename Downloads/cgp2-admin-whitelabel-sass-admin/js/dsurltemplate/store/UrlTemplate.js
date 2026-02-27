/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dsurltemplate.store.UrlTemplate",{
    extend : 'Ext.data.Store',
    requires : ["CGP.dsurltemplate.model.UrlTemplate"],

    model : "CGP.dsurltemplate.model.UrlTemplate",
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
        url:adminPath + 'api/dynamicsize/urltemplates',
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
