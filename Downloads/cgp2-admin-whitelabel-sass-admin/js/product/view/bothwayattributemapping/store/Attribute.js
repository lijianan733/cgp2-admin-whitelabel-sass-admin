/**
 * Created by nan on 2019/1/16.
 */
Ext.define("CGP.product.view.bothwayattributemapping.store.Attribute", {
    extend: 'Ext.data.Store',
    model: "CGP.product.view.bothwayattributemapping.model.Attribute",
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/configurable/{productId}/skuAttributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    constructor: function (config) {
        me = this;
        me.proxy.url = adminPath + 'api/products/configurable/' + config.productId + '/skuAttributes';
        me.callParent(arguments);
    }

});