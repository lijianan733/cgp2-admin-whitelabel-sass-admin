/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dsdatasource.store.DsdataSource",{
    extend : 'Ext.data.Store',
    requires : ["CGP.dsdatasource.model.DsdataSource"],

    model : "CGP.dsdatasource.model.DsdataSource",
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
        url:adminPath + 'api/dynamicsize/datasources',
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
