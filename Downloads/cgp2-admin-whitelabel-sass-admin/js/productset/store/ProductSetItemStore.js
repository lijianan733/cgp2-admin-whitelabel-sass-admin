/**
 * Created by nan on 2021/4/6
 */
Ext.define('CGP.productset.store.ProductSetStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.productset.model.ProductSetItemModel'],
    model: 'CGP.productset.model.ProductSetItemModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productsetitems',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    //model.js
    remoteSort: true,
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
