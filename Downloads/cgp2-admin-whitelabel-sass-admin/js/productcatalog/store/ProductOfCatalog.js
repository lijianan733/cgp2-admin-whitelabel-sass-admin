/**
 * Created by miao on 2022/5/9.
 *
 */
Ext.define("CGP.productcatalog.store.ProductOfCatalog", {
    extend: 'Ext.data.Store',
    pageSize: 25,
    model: 'CGP.productcatalog.model.ProductOfCatalog',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/product-of-catalog/catalogs/{id}',
        reader: {
            type: 'json',
            root: "data.content"
            // root: "content"
        }
    },
    constructor: function (config) {
        var me = this;
        if(config.catalogId){
            me.proxy.url = adminPath + 'api/product-of-catalog/catalogs/' + config.catalogId
        }
        me.callParent(arguments);
    }
});

