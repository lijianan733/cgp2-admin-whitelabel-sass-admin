Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SimplifySBOMMaterialViewTypeStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.SimplifySBOMMaterialViewType',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/simplifyMaterialViewType',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    pageSize: 100,
    params: null,
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
