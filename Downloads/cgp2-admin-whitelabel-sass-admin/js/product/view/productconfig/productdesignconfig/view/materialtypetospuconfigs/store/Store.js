Ext.define('CGP.product.view.productconfig.productdesignconfig.view.materialtypetospuconfigs.store.Store', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.materialtypetospuconfigs.model.Model',
    //    expanded: true,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigDesigns/{productConfigDesignId}/materialTypeToSpuConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function(config) {
        var productConfigDesignId = config.productConfigDesignId;
        this.proxy.url = adminPath + 'api/productConfigDesigns/'+productConfigDesignId+'/materialTypeToSpuConfigs';
        this.callParent(arguments);
    }
});