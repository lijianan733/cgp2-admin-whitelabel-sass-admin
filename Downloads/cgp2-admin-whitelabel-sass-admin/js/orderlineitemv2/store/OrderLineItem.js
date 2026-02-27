Ext.define('CGP.orderlineitemv2.store.OrderLineItem', {
    extend: 'Ext.data.Store',
    requires: 'CGP.orderlineitemv2.model.OrderLineItem',
    model: 'CGP.orderlineitemv2.model.OrderLineItem',
    proxy: {
        type: 'uxrest',
        timeout: 60000,
        url: adminPath + 'api/orderItems/v3',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    sorters: [{
        property: 'datePurchased',
        direction: 'DESC'
    },{
        property: 'seqNo',
        direction: 'ASC'
    }],

    url: adminPath + 'api/orderItems/v3',
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})
