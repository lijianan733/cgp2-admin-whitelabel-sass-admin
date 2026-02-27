Ext.Loader.syncRequire([
    'CGP.orderitemsmultipleaddress.model.OrderLineItemByOrder'
])
Ext.define('CGP.orderitemsmultipleaddress.store.shipmentsItemTailAfterStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderlineitemv2.model.OrderLineItemByOrder',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{orderId}/lineItems/v3',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    url: adminPath + 'api/orders/{0}/lineItems/v3',
    constructor: function (config) {
        var me = this;
        var url = Ext.clone(me.url);
        if (config && config.params) {
            const {params} = config;
            me.proxy.extraParams = params;
        }
        me.proxy.url = Ext.String.format(url, config.orderId);
        me.callParent(arguments);
    }
});