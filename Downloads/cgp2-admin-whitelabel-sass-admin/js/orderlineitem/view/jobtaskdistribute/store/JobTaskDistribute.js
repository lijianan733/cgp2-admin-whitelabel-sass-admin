/**
 * Created by admin on 2020/8/12.
 */

Ext.define("CGP.orderlineitem.view.jobtaskdistribute.store.JobTaskDistribute",{
    extend : 'Ext.data.Store',
    requires : ["CGP.orderlineitem.view.jobtaskdistribute.model.JobTaskDistribute"],

    model : "CGP.orderlineitem.view.jobtaskdistribute.model.JobTaskDistribute",
    /**
     * @cfg {boolean} remoteSort
     * 是否在服务器端排序
     */
    remoteSort:false,
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    // pageSize:25,
    /**
     * @cfg {Ext.data.Proxy} proxy
     * store proxy
     */
    proxy:{
        type:'uxrest',
        url:cgp2ComposingPath + 'api/orderItemImpressions/orderItems/'+'/impression/distribute/status',
        reader:{
            type:'json',
            root:'data'
        }
    },
    /**
     * @cfg {boolean} autoLoad
     * 是否自动加载
     */
    autoLoad:true,
    constructor: function (config) {
        var me = this;
        if (config) {
            me.proxy.url = cgp2ComposingPath + 'api/orderItemImpressions/orderItems/'+config['orderLineItemId']+'/impression/distribute/status';
        }
        me.callParent(arguments);
    }
});
