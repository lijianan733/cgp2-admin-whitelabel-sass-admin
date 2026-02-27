Ext.define('CGP.orderwaittingsettlementanalyze.model.Model', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'product',
            type: 'object'
        },
        {
            name: 'datePurchased',
            type: 'date',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return null;
                } else {
                    return new Date(value)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'order.datePurchased',
            type: 'date',
            convert: function (value, record) {
                var datePurchased = record.get('datePurchased');
                if (Ext.isEmpty(datePurchased)) {
                    return null;
                } else {
                    return new Date(datePurchased)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'orderNumber',
            type: 'string'
        },
        {
            name: 'partner',
            type: 'object'
        },
        {
            name: 'bindOrderNumbers',
            type: 'array'
        },
        {
            name: 'deliveryNo',
            type: 'string'
        },
        {
            name: 'extraParam',
            type: 'object'
        },
        {
            name: 'productDisplayName',
            type: 'string'
        },
        {
            name: 'deliveryDate',
            type: 'date',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return null;
                } else {
                    return new Date(value)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'order.deliveryDate',
            type: 'date',
            convert: function (value, record) {
                var deliveryDate = record.get('deliveryDate');
                if (Ext.isEmpty(deliveryDate)) {
                    return null;
                } else {
                    return new Date(deliveryDate)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'receivedDate',
            type: 'date',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return null;
                } else {
                    return new Date(value)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'order.receivedDate',
            type: 'date',
            convert: function (value, record) {
                var receivedDate = record.get('receivedDate');
                if (Ext.isEmpty(receivedDate)) {
                    return null;
                } else {
                    return new Date(receivedDate)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'productSku',
            type: 'string'
        },
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'qty',
            type: 'int'
        },
        {
            name: 'price',
            type: 'string'
        },
        {
            name: 'amount',
            type: 'string'
        },
        //product info
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'isTest',
            type: 'boolean'
        },
        {
            name: 'orderId',
            type: 'int'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orderItemsV2',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});