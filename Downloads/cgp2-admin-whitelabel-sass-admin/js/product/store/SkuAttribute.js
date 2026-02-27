Ext.define('CGP.product.store.SkuAttribute', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.model.SkuAttribute',
    //    expanded: true,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/configurable/{id}/skuAttributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function(config) {
        var configurableId = config.configurableId;
        this.proxy.url = adminPath + 'api/products/configurable/'+configurableId+'/skuAttributes';
        this.callParent(arguments);
    }
});