Ext.define('CGP.orderlineitem.store.OrderLineItem', {
    extend: 'Ext.data.Store',
    requires: 'CGP.orderlineitem.model.OrderLineItem',
    model: 'CGP.orderlineitem.model.OrderLineItem',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orderItemsV2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    sorters: [{
        property: 'order.datePurchased',
        direction: 'DESC'
    }],

    url: adminPath + 'api/orderItemsV2',
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})
