/**
 * Created by nan on 2017/12/11.
 */
Ext.define("CGP.partner.view.enableproductmanage.store.EnableProductStore", {
    extend: 'Ext.data.Store',
    model: 'CGP.partner.view.enableproductmanage.model.EnableProductModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners/{partnerId}/products',
        reader: {
            type: 'json',
            root: "data.content"
        }
    },
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/partners/' + config.partnerId + '/products';
        me.callParent(arguments);
    }
});