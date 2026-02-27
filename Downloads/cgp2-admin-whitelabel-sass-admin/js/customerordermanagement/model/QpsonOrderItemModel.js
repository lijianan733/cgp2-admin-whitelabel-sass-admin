/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.model.QpsonOrderItemModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.color.RgbColor'
        },

        //图
        {
            name: 'thumbnail',
            type: 'object',
        },
        {
            name: 'customThumbnail',
            type: 'string',
            convert: function (value, record) {
                var thumbnail = record.get('thumbnail');
                if (thumbnail) {
                    return thumbnail['customThumbnail'];
                }
            }
        },
        {
            name: 'configThumbnail',
            type: 'string',
            convert: function (value, record) {
                var thumbnail = record.get('thumbnail');
                if (thumbnail) {
                    return thumbnail['configThumbnail'];
                }
            }
        },
        

        // 产品信息
        // 属性信息
        {
            name: 'productDescription', // cardStock
            type: 'string',
        },
        {
            name: 'productSku', // SKU
            type: 'string',
        },
        {
            name: 'productWeight', // 单重
            type: 'string',
        },
        {
            name: 'unitPrice', // 单价
            type: 'string',
        },


        // 属性信息
        {
            name: 'attribute', // cardStock
            type: 'object',
        },


        // 数量
        {
            name: 'qty', // 数量
            type: 'int',
        },


        // 总计
        {
            name: 'totalPrice', // 总价
            type: 'string',
        },
        {
            name: 'totalWeight', // 总重
            type: 'string',
        },


        // 其他
        {
            name: 'storeOrderInfo',
            type: 'object',
        },
        {
            name: 'bindOrderNumber', // 店铺单号
            type: 'string',
            convert: function (value, record) {
                var storeOrderInfo = record.get('storeOrderInfo');
                if (storeOrderInfo) {
                    return storeOrderInfo['orderNumber'];
                }
            }
        },
        {
            name: 'bindOrderId', // 店铺单Id
            type: 'string',
            convert: function (value, record) {
                var storeOrderInfo = record.get('storeOrderInfo');
                if (storeOrderInfo) {
                    return storeOrderInfo['orderId'];
                }
            }
        },
        {
            name: 'productInstanceId', // productInstanceId
            type: 'string',
        },
        {
            name: 'randomDesignReview',
            type: 'boolean'
        },
        {
            name: 'fixDesignReview',
            type: 'boolean'
        },
        {
            name: 'isFinishedProduct',
            type: 'boolean'
        },
        {
            name: 'designId',
            type: 'string'
        },
    ],
})