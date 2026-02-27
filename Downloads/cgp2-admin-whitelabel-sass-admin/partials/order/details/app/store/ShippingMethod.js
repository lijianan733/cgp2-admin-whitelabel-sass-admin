Ext.define('CGP.orderdetails.store.ShippingMethod', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderdetails.model.ShippingMethod',

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{1}/availableShippingMethods',
        reader: {
            type: 'json',
            root: 'data'
        }
    },

    autoLoad: true,
    url: adminPath + 'api/orders/{1}/availableShippingMethods',

    constructor: function (config) {
        var me = this;
        var url = Ext.clone(me.url);
        url = Ext.String.format(url, config.websiteId, config.orderId);
        me.proxy.url = url;
        delete config.wesiteId;
        delete config.orderId;
        me.callParent(arguments);
    }
})
