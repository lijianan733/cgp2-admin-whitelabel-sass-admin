/**
 * State
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.store.ReturnRequestOrder', {
    extend: 'Ext.data.Store',
    requires: ['CGP.returnorder.model.ReturnRequestOrder'],

    model: 'CGP.returnorder.model.ReturnRequestOrder',
    remoteSort: true,
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    pageSize:25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/returnRequestOrders',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor:function (config){
        var me=this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});