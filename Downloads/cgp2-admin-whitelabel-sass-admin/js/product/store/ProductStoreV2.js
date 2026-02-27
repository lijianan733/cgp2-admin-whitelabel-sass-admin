/**
 * Created by nan on 2018/6/28.
 */
Ext.Loader.syncRequire([
    'CGP.product.model.Product'
])
Ext.define('CGP.product.store.ProductStoreV2', {
    extend: 'Ext.data.Store',
    require: ['CGP.product.model.Product'],
    model: 'CGP.product.model.Product',
    remoteSort: true,
    pageSize: 25,

    params: null,
    constructor: function (config) {
        var me = this;
        me.proxy = {
            type: 'uxrest',
            url: adminPath + "api/products/list",
            reader: {
                type: 'json',
                root: 'data.content'
            }
        };
        if (config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true

});