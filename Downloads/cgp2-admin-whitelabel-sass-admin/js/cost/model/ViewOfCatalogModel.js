/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.define('CGP.cost.model.ViewOfCatalogModel', {
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
        {//成本项集合
            name: 'processCostItems',
            type: 'array',
        },
        {//总数量
            name: 'qty',
            type: 'number',
        },
        {//类目名称
            name: 'productCategoryName',
            type: 'string',
        },
        {//类目名称
            name: 'productCategoryId',
            type: 'number',
        },
        {//人工成本
            name: 'laborCost',
            type: 'number',
            convert: function (value, record) {
                var processCostItems = record.raw?.processCostItems || [];
                if (!Ext.isEmpty(value)) {
                    return value;
                } else if (processCostItems) {
                    var result = null;
                    processCostItems.map(function (item) {
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
                var processCostItems = record.raw?.processCostItems || [];
                if (!Ext.isEmpty(value)) {
                    return value;
                } else if (processCostItems) {
                    var result = null;
                    processCostItems.map(function (item) {
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
                var processCostItems = record.raw?.processCostItems || [];
                if (!Ext.isEmpty(value)) {
                    return value;
                } else if (processCostItems) {
                    var result = null;
                    processCostItems.map(function (item) {
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
        }],
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/costAccounting/statistics/productCategories/{productCategoryId}/products/cost',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
