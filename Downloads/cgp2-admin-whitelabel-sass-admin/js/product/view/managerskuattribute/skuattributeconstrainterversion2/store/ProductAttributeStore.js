/**
 * Created by nan on 2019/10/21.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.ProductAttributeStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.ProductAttributeModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/configurable/{id}/skuAttributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var configurableId = config.productId;
        this.proxy.url = adminPath + 'api/products/configurable/' + configurableId + '/skuAttributes';
        this.callParent(arguments);
    }
});
