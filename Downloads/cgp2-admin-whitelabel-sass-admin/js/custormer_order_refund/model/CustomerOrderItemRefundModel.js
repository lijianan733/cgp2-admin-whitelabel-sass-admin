/**
 * @Description:
 * @author nan
 * @date 2025.05.22
 */
Ext.define('CGP.custormer_order_refund.model.CustomerOrderItemRefundModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        //customer订单项Id
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'productInstanceId',
            type: 'object'
        },
        {
            name: 'productId',
            type: 'string'
        },
        {
            name: 'productDescription',
            type: 'string'
        },
        //产品价格
        {
            name: 'price',
            type: 'string'
        },
        //产品总价
        {
            name: 'amount',
            type: 'number'
        },
        {
            name: 'priceStr',
            type: 'string'
        }, {
            name: 'amountStr',
            type: 'string'
        },
        //单个产品重量
        {
            name: 'productWeight',
            type: 'string'
        },
        //产品总重量
        {
            name: 'productSumWeight',
            type: 'string'
        },
        //可退款数量
        {
            name: 'canRefundedQty',
            type: 'string'
        },
        //可退款价格
        {
            name: 'canRefundedPrice',
            type: 'string'
        },
        //已退款数量
        {
            name: 'qtyRefunded',
            type: 'string'
        },
        //已退款价格
        {
            name: 'amountRefunded',
            type: 'string'
        },
        //customer订单项的数量
        {
            name: 'qty',
            type: 'string'
        },
        //产品名称
        {
            name: 'productName',
            type: 'string'
        },
        //产品model
        {
            name: 'productModel',
            type: 'string'
        },
        //产品的sku
        {
            name: 'productSku',
            type: 'string'
        },
        //物料id
        {
            name: 'materialId',
            type: 'string'
        },
        //物料名称
        {
            name: 'materialName',
            type: 'string'
        },
        //物料代码
        {
            name: 'materialCode',
            type: 'string'
        },
        //预览图信息
        {
            name: 'thumbnail',
            type: 'string'
        },
        {
            name: 'productInstanceThumbnail',
            type: 'string',
        },
        // 产品信息
        {
            name: 'productSku', // SKU
            type: 'string',
        },
        {
            name: 'unitPrice', // 单价
            type: 'string',
        },
        {
            name: 'totalPrice', // 拼单总价
            type: 'string',
        },

        {
            name: 'totalWeight', // 总重
            type: 'string',
        },
        {
            name: 'status', // 订单状态
            type: 'string',
        },
        {
            name: 'whitelabelOrderNumber', // QPSON订单号
            type: 'string',
        },
        {
            name: 'whitelabelOrderId', // QPSON订单Id
            type: 'string',
        },
        {
            name: 'refundQty',
            type: 'string',
        },
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