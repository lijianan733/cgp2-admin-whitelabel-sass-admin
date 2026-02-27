Ext.define("CGP.cmspage.store.ProductStore",{
    model: 'CGP.cmspage.model.ProductModel',
    extend : 'Ext.data.Store',
    storeId: 'productStore',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products/list",
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});