Ext.define('CGP.deliveryorder.store.ShippingMethod', {
    extend: 'Ext.data.Store',
    idProperty: 'code',
    fields: ['code', 'title'],

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/shipmentOrders/{1}/availableActualShippingMethods',
        reader: {
            type: 'json',
            root: 'data'
        }
    },

    autoLoad: true,
    url: adminPath + 'api/shipmentOrders/{1}/availableActualShippingMethods',

    constructor: function (config) {
        var me = this;
        var url = Ext.clone(me.url);
        url = Ext.String.format(url, config?.websiteId, config?.orderId);
        me.proxy.url = url;
        delete config?.orderId;
        me.callParent(arguments);
    }
})
