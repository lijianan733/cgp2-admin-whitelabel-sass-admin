/**
 * Created by admin on 2019/12/17.
 */
Ext.define('CGP.product.store.ProductAttributeMapping', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.model.ProductAttributeMapping',
    autoLoad :true,
    pageSize:100,
    proxy: {
        type: 'uxrest',
        url:adminPath + 'api/productAttributeMappings',
        reader: {
            type: 'json',
            root:'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})
