/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.define('CGP.cost.model.ViewOfOrderItemModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        }, {//订单号
            name: 'orderNo',
            type: 'string',
        }, {//订单项编号
            name: 'orderItemId',
            type: 'string',
        }, {//单个产品的成本(产品平均成本)
            name: 'unitCost',
            type: 'number',
        }, {//销售单价
            name: 'salePrice',
            type: 'number',
        }, {//产品缩略图
            name: 'thumbnail',
            type: 'string',
        }, {//产品信息
            name: 'product',
            type: 'object',
        }, {//销售数量
            name: 'qty',
            type: 'number',
        }, {//成本总额
            name: 'totalCost',
            type: 'number',
        }, {//销售总额
            name: 'totalPrice',
            type: 'number',
        }, {
            name: 'clazz',
            type: 'string',
        },
        {
            name: 'startTime',
            type: 'number',
        }, {
            name: 'endTime',
            type: 'number',
        }],
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/costAccounting/statistics/saleOrderItems/cost',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})