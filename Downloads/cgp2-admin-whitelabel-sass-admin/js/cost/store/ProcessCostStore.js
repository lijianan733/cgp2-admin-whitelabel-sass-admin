/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.Loader.syncRequire([
    'CGP.cost.proxy.DiyRest'
])
Ext.define('CGP.cost.store.ProcessCostStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.cost.model.ProcessCostModel'],
    model: 'CGP.cost.model.ProcessCostModel',
    pageSize: 25,
    proxy: {
        type: 'diyrest',
        url: mccsPath + 'api/costAccounting/statistics/process/cost/detail',
        reader: {
            type: 'json',
            root: 'data.content'
        },
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        extraDeal: function (request, query) {
            var me = this;
            var queryType = {
                catalogName: 'CATALOG_NAME',
                productId: 'PRODUCT',
                orderLineItemId: 'ORDER_ITEM',
                manufactureOrderId: 'MANUFACTURE_ORDER',
                catalogId: 'CATALOG'
            };
            var filter = ['name', 'description'];
            var filterArr = [];
            request.jsonData = {};
            request.jsonData['queryType'] = 'ALL';
            //当productId和manufactureOrderId,orderLineItemId共存时
            //优先使用manufactureOrderId,orderLineItemId
            if (query.length > 0) {
                query.map(function (item) {
                    if (queryType[item.name]) {
                        request.jsonData[item.name] = item.value;
                        request.jsonData['queryType'] = queryType[item.name];
                    }
                    if (Ext.Array.contains(filter, item.name)) {
                        filterArr.push(item);
                    }
                });
                request.params.filter = Ext.encode(filterArr);
            }
        },
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
