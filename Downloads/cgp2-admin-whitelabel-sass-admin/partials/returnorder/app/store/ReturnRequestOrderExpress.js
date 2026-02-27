/**
 * State
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.store.ReturnRequestOrderExpress', {
    extend: 'Ext.data.Store',
    requires: ['CGP.returnorder.model.ReturnRequestOrderExpress'],

    model: 'CGP.returnorder.model.ReturnRequestOrderExpress',
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
        url: adminPath + 'api/partner/returnRequests/reasons',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    constructor:function (config){
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});