/**
 * @Description:t退款特有的model
 * @author nan
 * @date 2022/12/7
 */
Ext.define('CGP.orderrefund.model.OrderItemModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'orderStatusId',
            type: 'int'
        }, {
            name: 'order',
            type: 'object'
        }, {
            name: 'state',
            type: 'object'
        }, {
            name: 'productInstance',
            type: 'object'
        }, {
            name: 'product',
            type: 'object'
        },
        'orderStatusName',
        {
            name: 'orderId',
            type: 'int',
            convert: function (value, record) {
                var order = record.get('order');
                if (!Ext.isEmpty(order)) {
                    return order.id;
                }
            }
        },
        {
            name: 'orderNumber',
            type: 'string',
            convert: function (value, record) {
                var order = record.get('order');
                if (!Ext.isEmpty(order)) {
                    return order.orderNumber;
                }
            }
        },
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'orderLineItemUploadStatus',
            type: 'string'
        },
        {
            name: 'seqNo',
            type: 'int'
        },
        //orderItemStatus
        {
            name: 'orderItemStatusId',
            type: 'int'
        },
        'orderItemStatusName',
        {
            name: 'qty',
            type: 'int'
        },
        {
            name: 'producingQty',
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
        {
            name: 'product',
            type: 'object'
        },
        {
            name: 'productId',
            type: 'int'
        },
        'productName',
        'productModel',
        'productSku',
        'productImageUrl',
        'projectThumbnail',
        'builderType',
        'projectImage',
        {
            name: 'addressBook',
            type: 'object'
        },

        {
            name: 'thumbnailInfo',
            type: 'object',
        },

        //已退产品总价
        {
            name: 'refundedAmount',
            type: 'string'
        },
        //已退产品总数
        {
            name: 'refundQty',
            type: 'number'
        },
        //产品单价
        {
            name: 'productPrice',
            type: 'number'
        },
        //允许退款数量
        {
            name: 'allowRefundQty',
            type: 'number'
        },
        //产品总价
        {
            name: 'totalproductPrice',
            type: 'number'
        },
        //退款总额
        {
            name: 'refundAmount',
            type: 'number'
        },
        //产品重量
        {
            name: 'productWeight',
            type: 'number',
            useNull: true,
        },
        //产品成本
        {
            name: 'productCosting',
            type: 'number',
            useNull: true,
        }
    ]

})