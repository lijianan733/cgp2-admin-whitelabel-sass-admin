/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.define('CGP.cost.model.MaterialCostModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        }, {//物料名称
            name: 'name',
            type: 'string',
        }, {//描述
            name: 'description',
            type: 'string',
        }, {//数量
            name: 'qty',
            type: 'number',
        }, {//物料单位
            name: 'unit',
            type: 'string',
        }, {//平均成本
            name: 'averageCost',
            type: 'number',
        }, {//去年平均成本
            name: 'lastMaterialAverageCost',
            type: 'number',
        }, {//成本总额
            name: 'totalCost',
            type: 'number',
        }, {//成本总额
            name: 'clazz',
            type: 'string',
        }, {
            name: 'materialId',
            type: 'string'
        }],
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/costAccounting/statistics/materials/cost/detail',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})