Ext.define('CGP.orderdetails.store.PaymentMethod', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderdetails.model.PaymentMethod',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{1}/availablePaymentMethods',
        reader: {
            type: 'json',
            root: 'data'
        }
    },

    autoLoad: true,

    constructor: function (config) {

        var me = this;

        var url = me.proxy.url;

        me.proxy.url = Ext.String.format(url,config.orderId);

        me.callParent(arguments);

    }
})
