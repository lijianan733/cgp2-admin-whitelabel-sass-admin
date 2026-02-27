/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.define("partner.productSupplier.store.EnableProductStore", {
    extend: 'Ext.data.Store',
    model: 'partner.productSupplier.model.EnableProductModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productofmanufactures/manufacture/{manufactureId}',
        reader: {
            type: 'json',
            root: "data.content"
        }
    },
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/productofmanufactures/manufacture';
        me.callParent(arguments);
    }
});