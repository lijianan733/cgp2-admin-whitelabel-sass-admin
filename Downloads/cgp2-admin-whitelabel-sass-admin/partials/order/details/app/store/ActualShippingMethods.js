Ext.define('CGP.orderdetails.store.ActualShippingMethods', {
    extend: 'Ext.data.Store',
    idProperty: 'code',
    fields: ['code', 'title'],

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/' + 'orderId' + '/availableActualShippingMethods',
        reader: {
            type: 'json',
            root: 'data'
        }
    },

    autoLoad: true,
    url: adminPath + 'api/orders/{0}/availableActualShippingMethods',

    constructor: function (config) {
        var me = this;
        var url = Ext.clone(me.url);
        url = Ext.String.format(Ext.clone(url), config.orderId);
        me.proxy.url = url;
        delete config.orderId;
        me.callParent(arguments);
    }
})
