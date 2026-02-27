/**
 * Created by nan on 2018/7/23.
 *
 */
Ext.define("CGP.productcatalog.store.ExcludeCatalogProductStore", {
    extend: 'Ext.data.Store',
    pageSize: 25,
    model: 'CGP.common.model.ProductModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/product-of-catalog/{id}/products',
        reader: {
            type: 'json',
            root: "data.content"
        }
    },
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/product-of-catalog/' + config.catalogId + '/products'
        me.callParent(arguments);
    }
});

