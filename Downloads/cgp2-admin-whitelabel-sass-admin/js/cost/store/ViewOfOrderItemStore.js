/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.Loader.syncRequire([
    'CGP.cost.proxy.DiyRest'
])
Ext.define('CGP.cost.store.ViewOfOrderItemStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.cost.model.ViewOfOrderItemModel'],
    model: 'CGP.cost.model.ViewOfOrderItemModel',
    pageSize: 25,
    proxy: {
        type: 'diyrest',
        url: mccsPath + 'api/costAccounting/statistics/saleOrderItems/cost',
        reader: {
            type: 'json',
            root: 'data.content'
        },
        extraDeal: function (request, query) {
            var me = this;
            request.jsonData = {};
            request.jsonData['queryType'] = 'ALL';
            if (query.length > 0) {
                query.map(function (item) {
                    if (queryType[item.name]) {
                        request.jsonData[item.name] = item.value;
                        request.jsonData['queryType'] = queryType[item.name];
                    }
                });
            }
        }
    },
    autoLoad: false,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})