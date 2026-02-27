Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
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
        'type',
        {
            name: 'isCanAudit',
            type: 'boolean'
        },
        {
            name: 'bindOrders',
            type: 'object'
        }, {
            name: 'isTest',
            type: 'boolean'
        }, {
            name: 'uploadedCountSum',
            type: 'int'
        }, {
            name: 'waitUploadCount',
            type: 'int'
        },
        {
            name: 'shipmentOrder',
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
        }, {
            name: 'shipmentBoxes',
            type: 'object'
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
            name: 'confirmedDate',
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
        'customerEmail',
        'deliveryName',
        'deliveryMobile',
        'shippingModuleCode',
        {
            name: 'deliveryAddress',
            type: 'string',
            convert: function (value, record) {
                var address = record.get('deliveryCountry') + ' ' + record.get('deliveryState') + ' ' + record.get('deliveryCity') + ' ' + record.get('deliverySuburb') + ' ' +
                    record.get('deliveryStreetAddress1') + ' ' + record.get('deliveryMobile') + ' ' + record.get('deliveryName');
                return address;
            }
        },
        'billingName',
        'billingAddress',
        'status',
        'currencySymbol',
        'totalPrice',
        'signRemark',
        'signDate',
        'website',
        'websiteCode',
        'deliveryCountry',
        'deliveryState',
        'deliveryCity',
        'deliverySuburb',
        'deliveryStreetAddress1',
        'deliveryStreetAddress2',
        'deliveryCountryCode2',
        'deliveryCompany',
        'deliveryLocationType',
        'deliveryPostcode',
        'deliveryTelephone',
        'deliveryEmail',
        'billingCountry',
        'billingState',
        'billingCity',
        'billingSuburb',
        'billingStreetAddress1',
        'billingStreetAddress2'
        ,
        'billingCompany',
        'billingLocationType',
        'billingPostcode',
        'billingTelephone',
        'billingEmail',
        'totalRefunded',
        'shippingCode',
        'shippingMethod',
        'paymentMethod',
        {
            name: 'totalCount',
            type: 'int'
        },
        {
            name: 'totalQty',
            type: 'int'
        },
        {
            type: 'boolean',
            name: 'invoice'
        },
        {
            name: 'statusId',
            type: 'int'
        },
        'reprintNo',
        'redoNo',
        {
            name: 'reprintId',
            type: 'int'
        },
        {
            name: "shipmentRequirement",
            type: 'object',
        },
        {
            name: "itemGenerateStatus",
            type: 'string',
        },
        {
            name: 'redoId',
            type: 'int'
        },
        {
            name: 'websiteId',
            type: 'int',
            convert: function (value, record) {
                var websiteId = record.get('website').id;
                return websiteId;
            }
        },
        {
            name: 'partnerId',
            type: 'int'
        },
        {
            name: 'partnerName',
            type: 'string'
        },
        {
            name: 'bindOrderNumbers',
            type: 'string'
        },
        'builderPreviewUrl',
        'builderEditUrl',
        {
            name: 'partner',
            type: 'object'
        },
        {
            name: 'extraParams',
            type: 'object'
        },
        {
            name: 'producePartner',
            type: 'object'
        }, {
            name: 'isRedo',
            type: 'boolean'
        }, {
            name: 'salesSource',//销售商信息
            type: 'object'
        }, {
            name: 'orderWay',//订单来源，
            type: 'string'
        },
        {
            name: 'originalOrderNumber',
            type: 'string'
        },
        {
            name: 'isPause',
            type: 'boolean'
        }, {
            name: 'remark',
            type: 'string'
        }, {
            name: 'orderTotals',
            type: 'object'
        }, {
            name: 'statusHistories',
            type: 'array'
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
        //是否外派的订单标识
        {
            name: 'isOutboundOrder',
            type: 'boolean'
        },
        //需要装箱的产品数量,改数量排除了外派订单项
        /*{
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
        },*/
        //预计交收日期,订单生成后就有
        {
            name: 'estimatedDeliveryDate',
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
        //优惠的具体信息
        {
            name: 'discounts',
            type: 'array'
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
