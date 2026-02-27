/**
 * Created by nan on 2018/9/13.
 */
Ext.define("CGP.orderdetails.store.CustomsCategroyStore", {
    extend: 'Ext.data.Store',
    model: 'CGP.customscategory.model.CustomsCategory',
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