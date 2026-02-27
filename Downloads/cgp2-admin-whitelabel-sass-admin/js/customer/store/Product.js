Ext.define("CGP.customer.store.Product", {
    extend: 'Ext.data.Store',
    model: 'CGP.partner.view.enableproductmanage.model.EnableProductModel',
    autoLoad: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/products',
        reader: {
            type: 'json',
            root: "data.content"
        }
    },
    constructor: function (config) {
        var me = this;
        if (config.email) {
            me.proxy.extraParams={'userEmail':config.email};
        }
        me.callParent(arguments);
    }
});
