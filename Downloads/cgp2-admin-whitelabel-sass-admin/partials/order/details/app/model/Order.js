Ext.define('CGP.orderdetails.model.Order', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'orderId',
            type: 'int'
        },
        {
            name: 'orderTotalQty',
            type: 'int'
        },
        {
            name: 'totalQty',
            type: 'int'
        },
        {
            name: 'shipmentInfo',
            type: 'object',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return {};
                } else {
                    return value;
                }
            },
        },
        {
            name: 'shipmentBox',
            type: 'array'
        },
        {
            name: 'websiteId',
            type: 'int'
        },
        'websiteCode', {
            name: '_id',
            type: 'string'
        },
        {
            name: 'id',
            type: 'int',
            useNull: true,
            convert: function (value, record) {
                if (Ext.isEmpty(value)) {
                    return record.get('_id');
                } else {
                    return value;
                }
            }
        },
        {
            name: 'statusHistories',
            type: 'object'
        },
        {
            name: 'orderNumber',
            type: 'string'
        },
        {
            name: 'datePurchased',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        'orderNo',
        'status',
        'customerEmail',
        {
            name: 'statusId',
            type: 'int'
        },
        {
            name: 'shipmentBoxes',
            type: 'object'
        },
        {
            name: 'shippingModuleCode',
            type: 'string'
        },
        {
            name: 'deliveryAddressId',
            type: 'int'
        },
        {
            name: 'deliveryCountryId',
            type: 'int'
        },
        'deliveryName',
        'deliveryFirstName',
        'deliveryLastName',
        {
            name: 'deliveryAddress',
            type: 'string',
            convert: function (value, record) {
                var address = record.get('deliveryCountry') + ' ' + record.get('deliveryState') + ' ' + record.get('deliveryCity') + ' ' + record.get('deliverySuburb') + ' ' +
                    record.get('deliveryStreetAddress1') + " " + record.get("deliveryStreetAddress2") + ' ' + record.get('deliveryMobile') + ' ' + record.get('deliveryName');
                return address;
            }
        },
        'deliveryEmail',
        'deliveryCity',
        'deliveryPostcode',
        'deliveryTelephone',
        'deliveryMobile',
        'deliveryLocationType',
        'deliveryStreetAddress1',
        'deliveryStreetAddress2',
        'deliveryState',
        'deliveryCompany',
        'deliveryCountry',
        'deliverySuburb',
        {
            name: 'suspectedSanction',
            type: 'boolean'
        },
        {
            name: 'isMultiAddressDelivery',
            type: 'boolean'
        },
        {
            name: 'billingAddressId',
            type: 'int',
            useNull: true
        },
        {
            name: 'billingCountryId',
            type: 'int'
        },
        'billingName',
        'billingTelephone',
        'billingFirstName',
        'billingLastName',
        'billingCity',
        'orderType',
        'sourceOrderNumber',
        {
            name: 'invoice',
            type: 'object'
        },
        {
            name: 'shippingMethod',
            type: 'string'
        },
        'shippingMethodCode',
        'paymentMethod',
        'paymentMethodCode',
        {
            name: 'lineItems',
            type: 'array'
        },
        {
            name: 'orderTotals',
            type: 'array'
        },
        {
            name: 'orderHistories',
            type: 'array'
        },
        'deliveryNo',
        {
            name: 'deliveryDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'comments',
            type: 'array'
        },
        'builderPreviewUrl',
        'builderEditUrl',
        {name: 'remark', type: 'string'},
        {
            name: 'producePartner',
            type: 'object'
        },
        {
            name: 'isRedo',
            type: 'boolean'
        },
        {
            name: 'shipmentInfoHistories',
            type: 'array'
        },
        {
            name: 'website',
            type: 'object'
        },
        {
            name: 'originalOrderNumber',
            type: 'string'
        },
        {
            name: 'signDate',
            type: 'number'
        },
        {
            name: 'signRemark',
            type: 'string'
        },
        //预计交收日期
        {
            name: 'estimatedDeliveryDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        }
    ]

})
