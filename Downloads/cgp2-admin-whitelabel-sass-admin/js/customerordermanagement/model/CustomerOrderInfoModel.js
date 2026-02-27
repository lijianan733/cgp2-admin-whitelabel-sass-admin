/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.model.CustomerOrderInfoModel', {
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
            name: 'productInstanceThumbnail',
            type: 'string',
        },


        // 产品信息
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
        {
            name: 'price', // 拼单价
            type: 'string',
        },
        {
            name: 'totalPrice', // 拼单总价
            type: 'string',
        },


        // 属性信息
        {
            name: 'productDescription', // cardStock
            type: 'string',
        },


        // 数量
        {
            name: 'qty', // 数量
            type: 'int',
        },


        // 总计
        {
            name: 'amount', // 总价
            type: 'string',
        },
        {
            name: 'totalWeight', // 总重
            type: 'string',
        },


        // 其他
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
            name: 'productInstanceId', // productInstanceId
            type: 'string',
        }
    ],
})