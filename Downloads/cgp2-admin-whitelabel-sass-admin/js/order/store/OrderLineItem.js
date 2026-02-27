Ext.Loader.syncRequire([
    'CGP.orderlineitem.model.OrderLineItem'
])
Ext.define('CGP.order.store.OrderLineItem', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderlineitem.model.OrderLineItem',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{orderId}/lineItemsV2',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    pageSize: 1000,
    url: adminPath + 'api/orders/{0}/lineItemsV2',

    constructor: function (config) {
        var me = this;
        var url = Ext.clone(me.url);
        me.proxy.url = Ext.String.format(url, config.orderId);
        me.callParent(arguments);
    }
});