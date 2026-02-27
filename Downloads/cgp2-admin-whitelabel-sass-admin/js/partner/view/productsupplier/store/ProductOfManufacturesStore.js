/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.define('partner.productSupplier.store.ProductOfManufacturesStore', {
    extend: 'Ext.data.Store',
    require: ['partner.productSupplier.model.ProductOfManufacturesModel'],
    model: 'partner.productSupplier.model.ProductOfManufacturesModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productofmanufactures/partner/{id}',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    remoteSort: true,
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config.params) {
            me.proxy.url = adminPath + 'api/productofmanufactures/partner/' + config.params.id;
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
})