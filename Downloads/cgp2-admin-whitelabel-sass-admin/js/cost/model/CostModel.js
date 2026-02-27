/**
 * @Description:
 * @author nan
 * @date 2022/9/6
 */
Ext.define('CGP.cost.model.CostModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        }, {//成本总额
            name: 'totalCost',
            type: 'number',
        }, {//销售总数
            name: 'totalProductQty',
            type: 'number',
        }, {//平均成本
            name: 'productAverageCost',
            type: 'number',
        }, {//核算货币
            name: 'currency',
            type: 'string',
        }, {//核算周期
            name: 'effectiveDuration',
            type: 'object',
        }, {
            name: 'clazz',
            type: 'string',
        }],
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/costAccounting/statistics/costAccountingCalculationLog',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
