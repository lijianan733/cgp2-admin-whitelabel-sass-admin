Ext.define('Order.status.model.OrderDetail', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: '_id',
            type: 'string'
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
        'orderNumber',
        'orderType',
        'customerEmail',
        'datePurchased',
        'shippingMethod',
        'deliveryName',
        'deliveryCountry',
        'deliveryState',
        'deliveryCity',
        'shippingMethodCode',
        'deliveryStreetAddress1',
        'deliveryStreetAddress2',
        {
            name: 'shipmentInfoHistories',
            type: 'array'
        },
        'deliveryCompany',
        'deliveryLocationType',
        'deliveryPostcode',
        'deliveryTelephone',
        'deliveryEmail',
        'orderDeliveryMethod',
        {
            name: 'status',
            type: 'object'
        },
        {
            name: 'qty',
            type: 'int'
        },
        {
            name: 'totalQty',
            type: 'int'
        },
        {
            name: 'websiteId',
            type: 'int'
        },
        {
            name: 'deliveryAddress',
            type: 'object'
        },
        {
            name: 'statusHistories',
            type: 'array'
        },
        {
            name: 'deliveryNo',
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
            name: 'shipmentBoxes',
            type: 'object'
        },
        {
            name: 'paidDate',
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
            name: 'confirmedDate',
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
            name: 'isRedo',
            type: 'boolean'
        },
        //最晚发货日期
        {
            name: 'shippedDate',
            type: 'number',
            useNull: true,
        },
        //审核意见,审核不通过时显示
        {
            name: 'reviewAdvise',
            type: 'string'
        },
        //审核分类,审核不通过时显示
        {
            name: 'reviewCategory',
            type: 'string'
        },
        //订单项是否外派生产
        {
            name: 'isOutboundOrder',
            type: 'string'
        },
        //订单项外派生产商code
        {
            name: 'thirdManufactureProduction',
            type: 'string'
        },
        //订单项外派生产商name
        {
            name: 'thirdManufactureName',
            type: 'string'
        },
        //需要装箱的产品数量,改数量排除了外派订单项
        {
            name: 'needPackingQty',
            type: 'number',
            convert: function (value, record) {
                var needPackingQty = 0;
                var lineItems = record.raw.lineItems || [];
                lineItems.map(function (item) {
                    //没有第三方生产商
                    if (Ext.isEmpty(item.thirdManufactureProduction)) {
                        needPackingQty += item.qty;
                    }
                });
                return needPackingQty
            }
        },
        //订单带货币符号的金额
        {
            name: 'totalPriceString',
            type: 'string'
        },
        //付款方式
        {
            name: 'paymentModuleCode',
            type: 'string'
        },
        //因为信贷额度的订单锁定
        {
            name: 'isLockOrder',
            type: 'boolean'
        },
        //锁定的原因
        // 订单金额超过信贷额：50260201
        // 存在逾期账单：50260202
        {

            name: 'lockedCode',
            type: 'string'
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