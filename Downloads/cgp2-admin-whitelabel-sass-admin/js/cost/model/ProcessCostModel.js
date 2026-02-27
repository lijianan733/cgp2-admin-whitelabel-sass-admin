/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.define('CGP.cost.model.ProcessCostModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        }, {//工序名
            name: 'name',
            type: 'string',
        }, {
            name: 'workingHours',
            type: 'number'
        }, {//是否可以跟踪
            name: 'isTracking',
            type: 'boolean',
        }, {//成本项
            name: 'items',
            type: 'array',
        }, {//成本总额
            name: 'totalCost',
            type: 'number',
        }, {//人工成本
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
        }, {
            name: 'clazz',
            type: 'string',
        }, {
            name: 'processId',
            type: 'string'
        }],
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/costAccounting/statistics/process/cost/detail',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})