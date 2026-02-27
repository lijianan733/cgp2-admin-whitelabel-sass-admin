/**
 * @author xiu
 * @date 2025/1/21
 */
Ext.define('CGP.extraorderreportforms.defaults.ExtraorderreportformsDefaults', {
    //正式配置
    config: {
        sample: {
            columnsText: [
                /*{
                    text: '序号',
                    type: 'string',
                    name: 'orderNo'
                },*/
                {
                    text: '订单号',
                    type: 'string',
                    name: 'orderNumber'
                },
                {
                    text: '下单时间',
                    type: 'date',
                    name: 'datePurchased',
                    isSortable: true,
                },
                {
                    text: '订单状态',
                    type: 'string',
                    name: 'status',
                    isSortable: true,
                },
                {
                    text: 'partner 名称',
                    type: 'string',
                    name: 'partnerName'
                },
                {
                    text: 'partner id',
                    type: 'string',
                    name: 'partnerId'
                },
                {
                    text: 'partner 邮箱',
                    type: 'string',
                    name: 'partnerEmail'
                },
                {
                    text: '下单数量',
                    type: 'string',
                    name: 'qty',
                    isSortable: true,
                },
                {
                    text: '下单货币',
                    type: 'string',
                    name: 'currencyCode',
                    isSortable: true,
                },
                {
                    text: '付款方式',
                    type: 'string',
                    name: 'paymentMethod',
                    isSortable: true,
                },
                {
                    text: '订单总金额',
                    type: 'string',
                    name: 'totalPrice',
                    isSortable: true,
                },
                {
                    text: '产品金额',
                    type: 'string',
                    name: 'productPrice',
                    isSortable: true,
                },
                {
                    text: '税费',
                    type: 'string',
                    name: 'tax',
                    isSortable: true,
                },
                {
                    text: '运费',
                    type: 'string',
                    name: 'shippingPrice',
                    isSortable: true,
                },
                {
                    text: '折扣',
                    type: 'string',
                    name: 'discountPrice',
                    isSortable: true,
                },
                {
                    text: '优惠券',
                    type: 'string',
                    name: 'couponCode',
                    isSortable: true,
                },
                {
                    text: '运输方式',
                    type: 'string',
                    name: 'shippingMethod',
                    isSortable: true,
                },
                {
                    text: '收件人名称',
                    type: 'string',
                    name: 'deliveryName'
                },
                {
                    text: '收件人邮箱',
                    type: 'string',
                    name: 'deliveryEmail'
                },
                {
                    text: '收件国家',
                    type: 'string',
                    name: 'deliveryCountry',
                    isSortable: true,
                },
                {
                    text: '收件详细地址',
                    type: 'string',
                    name: 'deliveryStreetAddress' //deliveryStreetAddress2
                },
                {
                    text: 'shipping NO',
                    type: 'string',
                    name: 'shippingNo',
                    isSortable: true,
                },
            ],
            filtersText: [
                {
                    text: '下单时间',
                    name: 'datePurchased',
                    type: 'date'
                },
            ]
        },
        partner: {
            columnsText: [
                /* {
                     text: '序号',
                     type: 'string',
                     name: 'orderNo'
                 },*/
                {
                    text: '订单号',
                    type: 'string',
                    name: 'orderNumber'
                },
                {
                    text: '下单时间',
                    type: 'date',
                    name: 'datePurchased',
                    isSortable: true,
                },
                {
                    text: '订单状态',
                    type: 'string',
                    name: 'status',
                    isSortable: true,
                },
                {
                    text: 'partner 名称',
                    type: 'string',
                    name: 'partnerName'
                },
                {
                    text: 'partner id',
                    type: 'string',
                    name: 'partnerId'
                },
                {
                    text: 'partner 邮箱',
                    type: 'string',
                    name: 'partnerEmail'
                },
                {
                    text: '下单数量',
                    type: 'string',
                    name: 'qty',
                    isSortable: true,
                },
                {
                    text: '下单货币',
                    type: 'string',
                    name: 'currencyCode',
                    isSortable: true,
                },
                {
                    text: '付款方式',
                    type: 'string',
                    name: 'paymentMethod',
                    isSortable: true,
                },
                {
                    text: '订单总金额',
                    type: 'string',
                    name: 'totalPrice',
                    isSortable: true,
                },
                {
                    text: '产品金额',
                    type: 'string',
                    name: 'productPrice',
                    isSortable: true,
                },
                {
                    text: '税费',
                    type: 'string',
                    name: 'tax',
                    isSortable: true,
                },
                {
                    text: '运费',
                    type: 'string',
                    name: 'shippingPrice',
                    isSortable: true,
                },
                {
                    text: '折扣',
                    type: 'string',
                    name: 'discountPrice',
                    isSortable: true,
                },
                {
                    text: '优惠券',
                    type: 'string',
                    name: 'couponCode',
                    isSortable: true,
                },
            ],
            filtersText: [
                {
                    text: '下单时间',
                    name: 'datePurchased',
                    type: 'date'
                },
            ]
        },
        customer: {
            columnsText: [
                /*{
                    text: '序号',
                    type: 'string',
                    name: 'orderNo'
                },*/
                {
                    text: 'partner 名称',
                    type: 'string',
                    name: 'partnerName'
                },
                {
                    text: 'customer 订单号',
                    type: 'string',
                    name: 'customerOrderNumber'
                },
                {
                    text: 'qpson订单号',
                    type: 'string',
                    name: 'orderNumber'
                },
                {
                    text: 'qpson下单时间',
                    type: 'date',
                    name: 'datePurchased',
                    isSortable: true,
                },
                {
                    text: '订单状态',
                    type: 'string',
                    name: 'status',
                    isSortable: true,
                },
                {
                    text: 'partner id',
                    type: 'string',
                    name: 'partnerId'
                },
                {
                    text: 'partner邮箱',
                    type: 'string',
                    name: 'partnerEmail' //partnerId
                },
                {
                    text: '下单数量',
                    type: 'string',
                    name: 'qty',
                    isSortable: true,
                },
                {
                    text: '下单货币',
                    type: 'string',
                    name: 'currencyCode',
                    isSortable: true,
                },
                {
                    text: '付款方式',
                    type: 'string',
                    name: 'paymentMethod',
                    isSortable: true,
                },
                {
                    text: '订单总金额',
                    type: 'string',
                    name: 'totalPrice',
                    isSortable: true,
                },
                {
                    text: '产品金额',
                    type: 'string',
                    name: 'productPrice',
                    isSortable: true,
                },
                {
                    text: '税费',
                    type: 'string',
                    name: 'tax',
                    isSortable: true,
                },
                {
                    text: '运费',
                    type: 'string',
                    name: 'shippingPrice',
                    isSortable: true,
                },
                {
                    text: '折扣',
                    type: 'string',
                    name: 'discountPrice',
                    isSortable: true,
                },
                {
                    text: '运输方式',
                    type: 'string',
                    name: 'shippingMethod',
                    isSortable: true,
                },
                {
                    text: '收件人名称',
                    type: 'string',
                    name: 'deliveryName',
                },
                {
                    text: '收件人邮箱',
                    type: 'string',
                    name: 'deliveryEmail'
                },
                {
                    text: '收件国家',
                    type: 'string',
                    name: 'deliveryCountry',
                    isSortable: true,
                },
                {
                    text: '收件详细地址',
                    type: 'string',
                    name: 'deliveryStreetAddress' // deliveryStreetAddress2
                },
                {
                    text: 'shipping NO',
                    type: 'string',
                    name: 'shippingNo',
                    isSortable: true,
                },
                {
                    text: '店铺URL',
                    type: 'string',
                    name: 'storeUrl'
                },
            ],
            filtersText: [
                {
                    text: 'customer 订单号',
                    name: 'customerOrderNumber',
                    type: 'string'
                },
                {
                    text: 'qpson 订单号',
                    name: 'orderNumber',
                    type: 'string'
                },
                {
                    text: '下单时间',
                    name: 'datePurchased',
                    type: 'date'
                },
            ]
        },
    },
    //测试配置
    test: {}
})