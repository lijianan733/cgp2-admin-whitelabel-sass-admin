/**
 * @Description: 订单列表接口的model
 * @author nan
 * @date 2024/6/14
 */
Ext.define('CGP.orderv2.model.OrderListModel', {
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
        }, {
            name: 'currency',
            type: 'object'
        },
        {
            name: 'taxCurrencyExchangeRates',
            type: 'array',
        },
        {
            name: 'itemGenerateStatus', //订单随机定制内容生成状态
            type: 'string',
        },
        {
            name: 'shippingCurrencyExchangeRates',
            type: 'array',
        },
        {
            name: 'paibanStatus',
            type: 'number'
        },
        'clazz',
        'createdDate',
        'createdBy',
        'modifiedDate',
        'orderNumber',
        //退款单，重做单
        'orderType',
        //一条龙，sample 普通
        'type',
        //第三方订单号
        {
            name: 'bindOrders',
            type: 'array'
        },
        //是否测试单
        {
            name: 'isTest',
            type: 'boolean'
        },
        //已上传总数
        {
            name: 'uploadedCountSum',
            type: 'int'
        },
        //待上传数
        {
            name: 'waitUploadCount',
            type: 'int'
        },
        //总成本带货币符合
        'totalCostString',
        // 下单日期
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
        //是否被制裁
        {
            name: 'suspectedSanction',
            type: 'boolean'
        },
        //是否多地址
        {
            name: 'isMultiAddressDelivery',
            type: 'boolean'
        },
        //审核日期
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
        //用户邮箱
        'customerEmail',
        //状态ID
        {
            name: 'statusId',
            type: 'int'
        },
        //状态名
        'statusName',
        //总价字符串，带货币
        'totalPriceString',
        //退款总额
        'totalRefunded',
        //付款方式
        'paymentMethod',
        //总数量
        {
            name: 'totalCount',
            type: 'int'
        },
        //总项数
        'totalQty',
        //走货方式， 自营配送，统一配送
        {

            name: 'orderDeliveryMethod',
            type: 'string'
        },
        'partnerId',
        'partnerName',
        //partner类型EXTERNAL
        'partnerType',
        {
            name: 'extraParams',
            type: 'object'
        },
        {
            name: 'isRedo',
            type: 'boolean'
        },
        {
            name: 'originalOrderNumber',
            type: 'string'
        },
        {
            name: 'isPause',
            type: 'boolean'
        },
        {
            name: 'remark',
            type: 'string'
        },
        //是否外派的订单标识
        {
            name: 'isOutboundOrder',
            type: 'boolean'
        },
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
        //付款日期
        {
            name: 'paidDate',
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
        //是否完成付款流程
        {
            name: 'isSuccessPay',
            type: 'boolean'
        },
        //订单来源
        {
            name: 'sourcePlatform',
            type: 'string'
        },
        //退款总额
        'totalRefunded',
        //收货人
        'deliveryName',
        //线下付款订单的付款状态对象数据
        'offlinePaymentStatus',
        //线下转账订单的转账付款凭证
        'transactionIds',
        //转账信息录入来源，BackEnd FrontEnd
        'transactionType',
        //订单预处理状态
        // INITIALIZED,
        // IN_PROGRESS,
        // COMPLETED,
        // FAILED
        {
            name: 'orderPostPreprocessTaskStatus',
            type: 'string'
        },
        {
            name: 'priceComponents',
            type: 'array',
            useNull: true,
        },
        //实付金额
        {
            name: 'modifiedAmount',
            type: 'string'
        },
        //实付金额的货币
        {
            name: 'modifiedCurrency',
            type: 'string'
        },
        //实付金额带货币符号
        {
            name: 'modifiedAmountStr',
            type: 'string'
        },
        //因为信贷额度的原因产生的锁定
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
        url: adminPath + 'api/orders',//取单条还是用旧接口
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
//去除了的字段
/*
var a = [

    {
        name: 'totalCost',
        type: 'string'
    },
    {
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
    'billingStreetAddress2',
    'billingCompany',
    'billingLocationType',
    'billingPostcode',
    'billingTelephone',
    'billingEmail',
    'shippingCode',
    'shippingMethod',

    {
        name: 'invoice',
        type: 'boolean',
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
        name: 'producePartner',
        type: 'object'
    }, {
        name: 'salesSource',//销售商信息
        type: 'object'
    }, {
        name: 'orderWay',//订单来源，
        type: 'string'
    },

    {
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

    //优惠的具体信息
    {
        name: 'discounts',
        type: 'array'
    }
]
*/
