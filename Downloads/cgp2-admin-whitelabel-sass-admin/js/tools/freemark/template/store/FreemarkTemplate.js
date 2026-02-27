/**
 * Created by admin on 2020/8/12.
 */

Ext.define("CGP.tools.freemark.template.store.FreemarkTemplate",{
    extend : 'Ext.data.Store',
    requires : ["CGP.tools.freemark.template.model.FreemarkTemplate"],

    model : "CGP.tools.freemark.template.model.FreemarkTemplate",
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
        url:composingPath + 'api/freemarker/templates',
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
