/**
 * Created by nan on 2018/5/17.
 */
Ext.syncRequire(['CGP.order.model.BatchDeliverOrderModel']);
Ext.define('CGP.order.store.BatchDeliverOrderStore', {
    extend: 'Ext.data.Store',
    require: 'CGP.order.model.BatchDeliverOrderModel',
    model: 'CGP.order.model.BatchDeliverOrderModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [
        {
            property: 'datePurchased',
            direction: 'DESC'
        }
    ],
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    }
})