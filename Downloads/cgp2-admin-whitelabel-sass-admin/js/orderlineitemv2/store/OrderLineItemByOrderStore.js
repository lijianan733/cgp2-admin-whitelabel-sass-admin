Ext.Loader.syncRequire([
    'CGP.orderlineitemv2.model.OrderLineItemByOrder'
])
Ext.define('CGP.orderlineitemv2.store.OrderLineItemByOrderStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderlineitemv2.model.OrderLineItemByOrder',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{orderId}/lineItems/v2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    sorters: [{
        property: 'seqNo',
        direction: 'ASC'
    }],
    url: adminPath + 'api/orders/{0}/lineItems/v2',
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