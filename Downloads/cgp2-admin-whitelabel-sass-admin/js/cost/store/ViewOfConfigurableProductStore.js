/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.Loader.syncRequire([
    'CGP.cost.proxy.DiyRest'
])
Ext.define('CGP.cost.store.ViewOfConfigurableProductStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.cost.model.ViewOfProductModel'],
    model: 'CGP.cost.model.ViewOfProductModel',
    pageSize: 25,
    proxy: {
        type: 'diyrest',
        timeout: 60000,
        url: mccsPath + 'api/costAccounting/statistics/products/{configurationProductId}/cost',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: false,
    constructor: function (config) {
        var me = this;
        if (config && config.productId) {
            me.proxy.url = mccsPath + 'api/costAccounting/statistics/products/' + config.productId + '/cost';
        }
        me.callParent(arguments);
    }
})
