Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.store.OrderLineItem', {
    extend: 'Ext.data.Store',
    requires: 'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.OrderLineItem',
    model: 'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.OrderLineItem',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/49908060/lineItemsV2',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,

    url: adminPath + 'api/orders/49908060/lineItemsV2',

    constructor: function (config) {
        var me = this;
        var url = Ext.clone(config.url);
        me.proxy.url = Ext.String.format(url, Ext.Object.fromQueryString(location.search).id);
        me.callParent(arguments);
    }
})