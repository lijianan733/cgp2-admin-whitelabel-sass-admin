/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.define('CGP.cost.model.ViewOfProductModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        }, {//平均成本
            name: 'averageCost',
            type: 'number',
        }, {//物料成本
            name: 'materialCost',
            type: 'number'
        }, {//分类名
            name: 'productDto',
            type: 'object',
        }, {//总成本
            name: 'totalCost',
            type: 'number',
        }, {//总数量
            name: 'totalQty',
            type: 'number',
        },
        {//总数量
            name: 'items',
            type: 'number',
        },
        {//人工成本
            name: 'laborCost',
            type: 'number',
            convert: function (value, record) {
                var items = record.raw?.items || [];
                if (!Ext.isEmpty(value)) {
                    return value;
                } else if (items) {
                    var result = null;
                    items.map(function (item) {
                        if (item.name == 'laborCost') {
                            result = item.cost;
                        }
                    });
                    return result;
                }
            }
        }, {//厂皮费
            name: 'overhead',
            type: 'number',
            convert: function (value, record) {
                var items = record.raw?.items || [];
                if (!Ext.isEmpty(value)) {
                    return value;
                } else if (items) {
                    var result = null;
                    items.map(function (item) {
                        if (item.name == 'overhead') {
                            result = item.cost;
                        }
                    });
                    return result;
                }
            }

        }, {//机器折旧费
            name: 'dpctOfMcn',
            type: 'number',
            convert: function (value, record) {
                var items = record.raw?.items || [];
                if (!Ext.isEmpty(value)) {
                    return value;
                } else if (items) {
                    var result = null;
                    items.map(function (item) {
                        if (item.name == 'dpctOfMcn') {
                            result = item.cost;
                        }
                    });
                    return result;
                }
            }
        },

    ],
})