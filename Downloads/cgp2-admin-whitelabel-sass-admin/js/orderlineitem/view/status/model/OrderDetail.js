Ext.define('CGP.orderlineitem.view.status.model.OrderDetail', {
    extend: 'Ext.data.Model',

    fields: [{
        name: '_id',
        type: 'string'
    }, 'orderNumber', 'orderType', 'customerEmail', 'datePurchased', 'shippingMethod', 'deliveryName', 'deliveryCountry', 'deliveryState', 'deliveryCity', 'shippingMethodCode', 'deliveryStreetAddress1', 'deliveryStreetAddress2'
        , 'deliveryCompany', 'deliveryLocationType', 'deliveryPostcode', 'deliveryTelephone', 'deliveryEmail', {
            name: 'status',
            type: 'object'
        },
        {
            name: 'suspectedSanction',
            type: 'boolean'
        },
        {
            name: 'isMultiAddressDelivery',
            type: 'boolean'
        },
        {
            name: 'qty',
            type: 'int'
        }, {
            name: 'totalQty',
            type: 'int'
        }, {
            name: 'websiteId',
            type: 'int'
        }, {
            name: 'deliveryAddress',
            type: 'object'
        }, {
            name: 'statusHistories',
            type: 'array'
        }, {
            name: 'deliveryNo',
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
            name: 'shipmentBoxes',
            type: 'object'
        }, {
            name: 'paidDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        }, {
            name: 'confirmedDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        }, {
            name: 'shipmentInfo',
            type: 'object',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return {};
                } else {
                    return value;
                }
            },
        }, {
            name: 'shipmentBox',
            type: 'array'
        }, {
            name: 'isRedo',
            type: 'boolean'
        },
        {
            name: 'id',
            type: 'int',
            convert: function (value, record) {
                if (Ext.isEmpty(value)) {
                    return parseInt(record.get('_id'));
                } else {
                    return value;
                }
            }
        },
        {
            name: 'thumbnailInfo',
            type: 'object',
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})