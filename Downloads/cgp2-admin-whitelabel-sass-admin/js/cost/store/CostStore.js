/**
 * @Description:成本核算统计
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.proxy.DiyRest'
])
Ext.define('CGP.cost.store.CostStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.cost.model.CostModel'],
    model: 'CGP.cost.model.CostModel',
    pageSize: 25,
    proxy: {
        type: 'diyrest',
        url: mccsPath + 'api/costAccounting/statistics/costAccountingCalculationLog',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: false,
    getMethod: function () {
        var me = this;
        return 'POST'
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
