/**
 * Created by nan on 2018/3/26.
 */
Ext.define('CGP.partner.view.suppliersupportableproduct.store.SupportableProductStore', {
    extend: 'Ext.data.Store',
    request: 'CGP.partner.view.suppliersupportableproduct.model.SupportableProductModel',
    model: 'CGP.partner.view.suppliersupportableproduct.model.SupportableProductModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners/{partnerId}/supportedProducts',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/producers/' + config.partnerId + '/supportedProductConfigs';
        me.callParent(arguments);
    }
})