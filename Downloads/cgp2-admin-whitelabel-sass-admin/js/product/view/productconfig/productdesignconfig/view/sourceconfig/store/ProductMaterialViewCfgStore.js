Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.ProductMaterialViewCfgStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.ProductMaterialViewCfgModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productMaterialViewTypes',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (!Ext.isEmpty(config) && !Ext.isEmpty(config.params)) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
})
