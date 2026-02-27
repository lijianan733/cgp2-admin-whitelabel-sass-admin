/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.define('CGP.orderitemsmultipleaddress.store.OrderItemsMultipleAddressStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderitemsmultipleaddress.model.OrderItemsMultipleAddressModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/50083170/lineItemsV2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})