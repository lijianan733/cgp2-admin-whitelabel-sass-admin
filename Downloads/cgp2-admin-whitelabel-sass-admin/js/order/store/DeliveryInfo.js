Ext.define('CGP.order.store.DeliveryInfo', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'orderId',
        type: 'int'
    }, {
        name: 'orderNo',
        type: 'string'
    }, {
        name: 'weight',
        type: 'int'
    }, {
        name: 'shippingCost',
        type: 'float'
    }, {
        name: 'deliveryNo',
        type: 'string'
    }, {
        name: 'shippingMethodName',
        type: 'string'
    }, {
        name: 'deliveryDate',
        type: 'date',
        convert: function (value) {
            return new Date(value)
        },
        serialize: function (value) {
            var time = value.getTime();
            return time;
        }
    }, {
        name: 'shippingMethod',
        type: 'string'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/shipmentInfos',
        reader: {
            root: 'data',
            type: 'json'
        }
    },
    autoLoad: true,


    constructor: function (config) {
        var me = this;

        var orderIds = config.orderIds;
        me.proxy.extraParams = {
            orderIds: orderIds
        };

        me.callParent(arguments);
    },
})