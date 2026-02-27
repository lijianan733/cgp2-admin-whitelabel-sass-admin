Ext.define('CGP.product.edit.store.SkuProductExclusive', {
    extend: 'Ext.data.Store',

    required: ['CGP.product.edit.model.Product'],

    model: 'CGP.product.edit.model.Product',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/configurable/{configurableProductId}/skuProduct/exclusive',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {

        var me = this;

        if (config.configurableProductId) {
            me.proxy = {
                type: 'uxrest',
                url: adminPath + 'api/products/configurable/' + config.configurableProductId + '/skuProduct/exclusive',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            };
        }

        me.callParent([config]);

    },
    autoLoad: true
})