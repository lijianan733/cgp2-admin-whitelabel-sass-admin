/**
 * Created by nan on 2020/2/14.
 */
Ext.define('CGP.product.view.managerskuattribute.store.SkuAttributePropertyStore', {
    extend: 'Ext.data.Store',
    request: 'CGP.product.view.managerskuattribute.model.SkuAttributePropertyModel',
    model: 'CGP.product.view.managerskuattribute.model.SkuAttributePropertyModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/skuAttributePropertyValueController',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    pageSize: 25,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }

})
