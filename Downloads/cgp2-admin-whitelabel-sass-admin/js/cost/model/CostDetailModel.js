/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.define('CGP.cost.model.CostDetailModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number',
        }, {//成本总额
            name: 'totalCost',
            type: 'number',
        }, {//销售总数
            name: 'totalQty',
            type: 'number',
        }, {//平均成本
            name: 'productAverageCost',
            type: 'number',
        }, {//核算周期
            name: 'effectiveDuration',
            type: 'object',
        }, {//物料成本
            name: 'materialCost',
            type: 'number',
        }, {//所有成本项的合集,内容不固定
            name: 'list',
            type: 'array',
        },
        {//人工成本
            name: 'laborCost',
            type: 'number',
            convert: function (value, record) {
                var list = record.raw?.list || [];
                if (!Ext.isEmpty(value)) {
                    return value;
                } else if (list) {
                    var result = null;
                    list.map(function (item) {
                        if (item.name == 'laborCost') {
                            result = item.cost;
                        }
                    });
                    return result;
                }
            }
        },
        {//厂皮费
            name: 'overhead',
            type: 'number',
            convert: function (value, record) {
                var list = record.raw?.list || [];
                if (!Ext.isEmpty(value)) {
                    return value;
                } else if (list) {
                    var result = null;
                    list.map(function (item) {
                        if (item.name == 'overhead') {
                            result = item.cost;
                        }
                    });
                    return result;
                }
            }

        },
        {//机器折旧费
            name: 'dpctOfMcn',
            type: 'number',
            convert: function (value, record) {
                var list = record.raw?.list || [];
                if (!Ext.isEmpty(value)) {
                    return value;
                } else if (list) {
                    var result = null;
                    list.map(function (item) {
                        if (item.name == 'dpctOfMcn') {
                            result = item.cost;
                        }
                    });
                    return result;
                }
            }
        },
        {
            name: 'clazz',
            type: 'string',
        }],
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/costAccounting/statistics/overview',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})