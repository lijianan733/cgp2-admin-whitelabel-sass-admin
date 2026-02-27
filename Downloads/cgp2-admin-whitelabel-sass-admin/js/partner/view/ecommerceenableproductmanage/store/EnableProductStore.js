/**
 * Created by nan on 2017/12/11.
 */
Ext.define("CGP.partner.view.ecommerceenableproductmanage.store.EnableProductStore", {
    extend: 'Ext.data.Store',
    model: 'CGP.partner.view.ecommerceenableproductmanage.model.EnableProductModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/salers/{salerId}/productConfigs',
        reader: {
            type: 'json',
            root: "data.content"
        }
    },
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/salers/' + config.partnerId + '/productConfigs';
        me.callParent(arguments);
    }
});