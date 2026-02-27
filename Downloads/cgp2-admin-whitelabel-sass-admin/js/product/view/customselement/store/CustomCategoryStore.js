Ext.define('CGP.product.view.customselement.store.CustomCategoryStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.customselement.model.CustomsCategoryModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/customsCategory/findByProductId?productId={id}',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if (config.productId) {
            me.proxy.url = adminPath + 'api/customsCategory/findByProductId?productId=' + config.productId;
        }
        me.callParent(arguments);
    }
});