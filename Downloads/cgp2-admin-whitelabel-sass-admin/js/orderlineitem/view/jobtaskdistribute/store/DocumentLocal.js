/**
 * Created by admin on 2020/8/12.
 */

Ext.define("CGP.orderlineitem.view.jobtaskdistribute.store.DocumentLocal",{
    extend : 'Ext.data.Store',
    requires : ["CGP.orderlineitem.view.jobtaskdistribute.model.DocumentLocal"],

    model : "CGP.orderlineitem.view.jobtaskdistribute.model.DocumentLocal",
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    pageSize:25,
    /**
     * @cfg {Ext.data.Proxy} proxy
     * store proxy
     */
    proxy : {
        type : 'memory'
    },
    autoLoad:true
});
