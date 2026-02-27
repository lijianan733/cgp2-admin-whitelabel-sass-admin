/**
 * @Description:
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.proxy.DiyRest'
])
Ext.define('CGP.cost.store.ViewOfCatalogStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.cost.model.ViewOfCatalogModel'],
    model: 'CGP.cost.model.ViewOfCatalogModel',
    pageSize: 25,
    proxy: {
        type: 'diyrest',
        url: mccsPath + 'api/costAccounting/statistics/productCategories/cost',
        reader: {
            type: 'json',
            root: 'data.content'
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
