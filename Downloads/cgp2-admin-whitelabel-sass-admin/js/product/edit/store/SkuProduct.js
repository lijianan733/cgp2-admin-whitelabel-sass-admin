Ext.define('CGP.product.edit.store.SkuProduct', {
    extend: 'Ext.data.Store',

    required: ['CGP.product.edit.model.Product'],

    model: 'CGP.product.edit.model.Product',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/configurable/{configurableProductId}/skuProduct',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {

        var me = this;

        if (config.configurableProductId) {
            me.proxy = {
                type: 'uxrest',
                url: adminPath + 'api/products/configurable/' + config.configurableProductId + '/skuProduct',
                reader: {
                    type: 'json',
                    root: 'data.content'
                }
            };
            // me.proxy = {
            //     type: 'uxrest',
            //     url: adminPath + 'api/products/list',
            //     reader: {
            //         type: 'json',
            //         root: 'data.content'
            //     }
            // };
            // me.proxy.extraParams = {'filter':'[{"name":"configurableProduct.id","value":'+config.configurableProductId+',"type":"number"}]'};
        }

        me.callParent([config]);

    },
    autoLoad: true
    });