/**
 * Created by nan on 2018/6/28.
 */

Ext.define('CGP.product.store.ProductStore', {
    extend: 'Ext.data.Store',
    require: ['CGP.product.model.Product'],
    model: 'CGP.product.model.Product',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products/list",
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true

});