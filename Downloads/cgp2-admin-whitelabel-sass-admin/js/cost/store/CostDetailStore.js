/**
 * @Description:核算结果总览
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.proxy.DiyRest'
])
Ext.define('CGP.cost.store.CostDetailStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.cost.model.CostDetailModel'],
    model: 'CGP.cost.model.CostDetailModel',
    pageSize: 25,
    proxy: {
        type: 'diyrest',
        extraDeal: function (request, query) {
            var me = this;
            var queryType = {
                catalogName: 'CATALOG_NAME',
                productId: 'PRODUCT',
                orderLineItemId: 'ORDER_ITEM',
                manufactureOrderId: 'MANUFACTURE_ORDER',
                catalogId: 'CATALOG',
                All: 'ALL'//不处理
            };
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
        },
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        url: mccsPath + 'api/costAccounting/statistics/overview',
        reader: {
            type: 'json',
            root: 'data'
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
});
