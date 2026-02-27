/**
 * @Description:
 * @author nan
 * @date 2022/12/5
 */
Ext.define('CGP.orderrefund.model.OrderRefundModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: 'order',
            type: 'object'
        },
        {
            name: 'orderId',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.order?._id;
            }
        },
        //FullOrder:全单,Product：部分产品,SalesTax：销售税,ShippingFee：运费
        {
            name: 'type',
            type: 'string'
        },
        //退货订单号
        {
            name: 'requestNo',
            type: 'string'
        },
        {
            name: 'salesOrderNo',
            type: 'string'
        },
        //取系统配置,partner上的指定配置字段
        {
            name: 'from',
            type: 'string'
        },
        //['WhiteLabelOrder', 'SalesOrder'],
        {
            name: 'refundOrderType',
            type: 'string'
        },
        //订单支付总额
        {
            name: 'paymentAmount',
            type: 'number'
        },
        //支付币种
        {
            name: 'currencyCode',
            type: 'string'
        },
        //付款方式,默认PayPal
        {
            name: 'paymentMethod',
            type: 'string'
        },
        //付款业务流水号
        {
            name: 'paymentTranId',
            type: 'string'
        },
        //退款交易流水号
        {
            name: 'refundTranId',
            type: 'string'
        },
        //退款产品总价
        {
            name: 'productsAmount',
            type: 'number'
        },
        //退运费数
        {
            name: 'shippingAmount',
            type: 'number'
        },
        //退消费税数量
        {
            name: 'salesTaxAmount',
            type: 'number'
        },
        //退款原因
        {
            name: 'reason',
            type: 'string'
        },
        //退款申请状态，申请中,同意,拒绝
        {
            name: 'state',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: '_id',
            type: 'string'
        },
        //退款申请时间
        {
            name: 'createdDate',
            type: 'number'
        },
        //退款申请人
        {
            name: 'createdUser',
            type: 'object',
            convert: function (value) {
                return value?.emailAddress;
            }
        },
        //取消申请时间
        {
            name: 'cancelDate',
            type: 'number'
        },
        //取消申请人
        {
            name: 'cancelUser',
            type: 'string',
            convert: function (value) {
                return value?.emailAddress;
            }
        },
        //退款时间
        {
            name: 'refundDate',
            type: 'number'
        },
        //退款操作人
        {
            name: 'refundUser',
            type: 'string',
            convert: function (value) {
                return value?.emailAddress;
            }
        },
        //操作历史单独接口查询
        {
            name: 'history',
            type: 'array'
        },
        //
        {
            name: 'remark',
            type: 'string'
        },
        {
            name: 'refundItems',
            type: 'array'
        },
        //退款总额
        {
            name: 'allRefundAmount',
            type: 'number'
        }, {
            name: 'orderNumber',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.order?.orderNumber;
            }
        },
        //关联订单信息
        {
            name: 'bindOrder',
            type: 'object'
        }


    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/refundRequests',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})