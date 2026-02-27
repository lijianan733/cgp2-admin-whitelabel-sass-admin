/**
 * @Description:
 * @author nan
 * @date 2025.05.22
 */
Ext.define('CGP.custormer_order_refund.model.CustomerOrderRefundModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'order',
            type: 'object'
        },
        {
            name: 'from',
            type: 'string'
        },
        //退货请求单号
        {
            name: 'requestNo',
            type: 'string'
        },
        //销售订单号
        {
            name: 'salesOrderNo',
            type: 'string'
        },
        //WhiteLabelOrder
        // SalesOrder
        // CustomerOrder
        //退款订单类型
        {
            name: 'refundOrderType',
            type: 'string'
        },
        //FullOrder
        // Product
        // SalesTax
        // ShippingFee
        // ImportService
        // Other
        //退款类型
        {
            name: 'type',
            type: 'string'
        },
        //支付金额
        {
            name: 'paymentAmount',
            type: 'string'
        },
        //货币
        {
            name: 'currencyCode',
            type: 'string'
        },
        //付款方式
        {
            name: 'paymentMethod',
            type: 'string'
        },
        //付款流水号
        {
            name: 'paymentTranId',
            type: 'string'
        },
        //退款记录
        {
            name: 'refundTranId',
            type: 'string'
        },
        //退产品金额
        {
            name: 'productsAmount',
            type: 'string'
        },
        //退运费金额
        {
            name: 'shippingAmount',
            type: 'string'
        },
        //退税费金额
        {
            name: 'salesTaxAmount',
            type: 'string'
        },
        //退款原因
        {
            name: 'reason',
            type: 'string'
        },
        //退款状态码
        {
            name: 'state',
            type: 'string'
        },
        //退款项目列表
        {
            name: 'refundItems',
            type: 'object'
        },
        {
            name: 'createdDate',
            type: 'string'
        }, {
            name: 'createdUser',
            type: 'object'
        }, {
            name: 'cancelDate',
            type: 'string'
        }, {
            name: 'cancelUser',
            type: 'object'
        },
        //退款日期
        {
            name: 'refundDate',
            type: 'string'
        },
        {
            name: 'refundUser',
            type: 'object'
        },
        {
            name: 'bindOrder',
            type: 'object'
        },
        //退款总额
        {
            name: 'allRefundAmount',
            type: 'number'
        },
        {
            name: 'customerOrderNumber',
            type: 'string'
        },
        //记录接口计算出来的qpson订单退款信息
        {
            name: 'document',
            type: 'object'
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/customer/orders/refundRequests',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})