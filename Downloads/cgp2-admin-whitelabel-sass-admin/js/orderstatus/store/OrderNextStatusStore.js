/**
 * @Description:
 * @author nan
 * @date 2023/5/24
 */
Ext.define('CGP.orderstatus.store.OrderNextStatusStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderstatus.model.OrderStatusModel',
    pageSize: 100,
    sorters: [{
        property: 'fontSort',
        direction: 'ASC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{orderId}/nextStatus',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    remoteSort: false,
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/orders/' + config.orderId + '/nextStatus';
        me.callParent(arguments)
        me.on('load', function (store, records) {
           ;
            store.doSort(function (item1, item2) {
                return item1.raw.fontSort - item2.raw.fontSort;
            });
        })
    }
})